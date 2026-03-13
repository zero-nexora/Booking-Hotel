import { sendReviewRequest } from "@/lib/email";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

async function handler(_req: NextRequest) {
  const yesterday = subDays(new Date(), 1);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CHECKED_OUT",
      checkOut: {
        gte: startOfDay(yesterday),
        lte: endOfDay(yesterday),
      },
      review: null,
    },
    select: {
      bookingRef: true,
      checkOut: true,
      guestName: true,
      guestEmail: true,
      hotel: { select: { name: true } },
      items: { select: { room: { select: { name: true } } } },
    },
  });

  let sent = 0;
  for (const booking of bookings) {
    if (!booking.guestEmail) continue;
    const item = booking.items[0];
    if (!item) continue;

    await sendReviewRequest({
      to: booking.guestEmail,
      name: booking.guestName,
      hotelName: booking.hotel.name,
      roomName: item.room.name,
      checkOut: format(booking.checkOut, "dd/MM/yyyy"),
      reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/account/bookings/${booking.bookingRef}/review`,
    }).catch((err) =>
      console.error(
        `[cron] review-request email failed for ${booking.bookingRef}`,
        err,
      ),
    );

    sent++;
  }

  console.log(`[cron] review-request: sent ${sent} emails`);
  return NextResponse.json({ sent });
}

export const POST = verifySignatureAppRouter(handler);
