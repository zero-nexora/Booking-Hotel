import { sendCheckInReminder } from "@/lib/email";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(_req: NextRequest) {
  const tomorrow = addDays(new Date(), 1);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      checkIn: { gte: startOfDay(tomorrow), lte: endOfDay(tomorrow) },
    },
    select: {
      bookingRef: true,
      checkIn: true,
      checkOut: true,
      guestName: true,
      guestEmail: true,
      hotel: {
        select: {
          name: true,
          phone: true,
          address: {
            select: {
              street: true,
              city: {
                select: {
                  name: true,
                },
              },
            },
          },
          policy: {
            select: {
              checkInTime: true,
              checkOutTime: true,
            },
          },
        },
      },
      items: {
        select: {
          room: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  let sent = 0;
  for (const booking of bookings) {
    if (!booking.guestEmail) continue;
    const item = booking.items[0];

    if (!item) continue;

    const hotelAddress = [
      booking.hotel.address.street,
      booking.hotel.address.city.name,
    ]
      .filter(Boolean)
      .join(", ");

    await sendCheckInReminder({
      to: booking.guestEmail,
      name: booking.guestName,
      bookingRef: booking.bookingRef,
      hotelName: booking.hotel.name,
      hotelAddress,
      hotelPhone: booking.hotel.phone ?? "",
      checkIn: format(booking.checkIn, "EEEE, dd/MM/yyyy"),
      checkInTime: booking.hotel.policy?.checkInTime ?? "14:00",
      checkOut: format(booking.checkOut, "EEEE, dd/MM/yyyy"),
      checkOutTime: booking.hotel.policy?.checkOutTime ?? "12:00",
      roomName: item.room.name,
      bookingUrl: `${env.NEXT_PUBLIC_APP_URL}/account/bookings/${booking.bookingRef}`,
    }).catch((err) =>
      console.error(
        `[cron] checkin-reminder email failed for ${booking.bookingRef}`,
        err,
      ),
    );

    sent++;
  }

  console.log(`[cron] checkin-reminder: sent ${sent} emails`);
  return NextResponse.json({ sent });
}

export const POST = verifySignatureAppRouter(handler);
