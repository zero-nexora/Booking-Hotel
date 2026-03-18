import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(_req: NextRequest) {
  const now = new Date();

  const expiredBookings = await prisma.booking.findMany({
    where: {
      status: "PENDING",
      paymentStatus: "UNPAID",
      expiresAt: { lt: now },
    },
    select: {
      id: true,
      items: { select: { id: true } },
    },
  });

  if (!expiredBookings.length) {
    return NextResponse.json({ expired: 0 });
  }

  const bookingIds = expiredBookings.map((b) => b.id);
  const itemIds = expiredBookings.flatMap((b) => b.items.map((i) => i.id));

  await prisma.$transaction([
    prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: {
        status: "CANCELLED",
        cancelledAt: now,
        cancelReason: "Hết thời gian thanh toán",
      },
    }),
    prisma.bookingItem.updateMany({
      where: { id: { in: itemIds } },
      data: { status: "CANCELLED" },
    }),
    prisma.payment.updateMany({
      where: {
        bookingId: { in: bookingIds },
        status: "PENDING",
      },
      data: { status: "CANCELLED" },
    }),
    prisma.roomAvailability.updateMany({
      where: {
        bookingItemId: { in: itemIds },
      },
      data: {
        status: "AVAILABLE",
        bookingItemId: null,
        lockToken: null,
        lockExpiresAt: null,
      },
    }),
  ]);

  console.log(
    `[cron] expire-bookings: cancelled ${expiredBookings.length} bookings`,
  );
  return NextResponse.json({ expired: expiredBookings.length });
}

export const POST = verifySignatureAppRouter(handler);
