import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { env } from "@/lib/env";
import {
  sendBookingConfirmation,
  sendBookingCancellation,
  sendPaymentFailed,
} from "@/lib/email";
import { format } from "date-fns";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await onPaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await onPaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "charge.refunded":
        await onChargeRefunded(event.data.object as Stripe.Charge);
        break;
    }
  } catch (err) {
    console.error(`[stripe-webhook] ${event.type}`, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function onPaymentSucceeded(pi: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: pi.id },
    select: {
      id: true,
      bookingId: true,
      booking: {
        select: {
          id: true,
          bookingRef: true,
          checkIn: true,
          checkOut: true,
          totalAmount: true,
          currency: true,
          guestName: true,
          guestEmail: true,
          items: {
            select: {
              id: true,
              adults: true,
              children: true,
              nights: true,
              room: { select: { name: true } },
            },
          },
          hotel: {
            select: {
              name: true,
              policy: { select: { checkInTime: true, checkOutTime: true } },
              address: {
                select: {
                  street: true,
                  city: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!payment) return;

  const { booking } = payment;
  const item = booking.items[0];

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: new Date() },
    }),
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED", paymentStatus: "PAID" },
    }),
    prisma.bookingItem.updateMany({
      where: { bookingId: booking.id },
      data: { status: "CONFIRMED" },
    }),
    prisma.roomAvailability.updateMany({
      where: { bookingItemId: { in: booking.items.map((i) => i.id) } },
      data: { status: "BOOKED", lockToken: null, lockExpiresAt: null },
    }),
  ]);

  if (booking.guestEmail && item) {
    const hotelAddress = [
      booking.hotel.address?.street,
      booking.hotel.address?.city.name,
    ]
      .filter(Boolean)
      .join(", ");

    await sendBookingConfirmation({
      to: booking.guestEmail,
      name: booking.guestName,
      bookingRef: booking.bookingRef,
      hotelName: booking.hotel.name,
      hotelAddress,
      roomName: item.room.name,
      checkIn: format(booking.checkIn, "EEEE, dd/MM/yyyy"),
      checkOut: format(booking.checkOut, "EEEE, dd/MM/yyyy"),
      nights: item.nights,
      adults: item.adults,
      children: item.children,
      totalAmount: Number(booking.totalAmount).toLocaleString("vi-VN"),
      currency: booking.currency,
      bookingUrl: `${env.NEXT_PUBLIC_APP_URL}/account/bookings/${booking.bookingRef}`,
    }).catch((err) => console.error("[email] booking-confirmation failed", err));
  }
}

async function onPaymentFailed(pi: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: pi.id },
    select: {
      id: true,
      bookingId: true,
      booking: {
        select: {
          bookingRef: true,
          checkIn: true,
          checkOut: true,
          totalAmount: true,
          currency: true,
          guestName: true,
          guestEmail: true,
          items: {
            select: { room: { select: { name: true } } },
          },
          hotel: { select: { name: true, slug: true } },
        },
      },
    },
  });
  if (!payment) return;

  const { booking } = payment;

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "FAILED",
      failureMessage: pi.last_payment_error?.message ?? "Thanh toán thất bại",
    },
  });

  const item = booking.items[0];
  if (booking.guestEmail && item) {
    const retryUrl = `${env.NEXT_PUBLIC_APP_URL}/account/bookings/${booking.bookingRef}`;
    await sendPaymentFailed({
      to: booking.guestEmail,
      name: booking.guestName,
      bookingRef: booking.bookingRef,
      hotelName: booking.hotel.name,
      roomName: item.room.name,
      checkIn: format(booking.checkIn, "dd/MM/yyyy"),
      checkOut: format(booking.checkOut, "dd/MM/yyyy"),
      totalAmount: Number(booking.totalAmount).toLocaleString("vi-VN"),
      currency: booking.currency,
      retryUrl,
    }).catch((err) => console.error("[email] payment-failed failed", err));
  }
}

async function onChargeRefunded(charge: Stripe.Charge) {
  const piId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!piId) return;

  const chargePayment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: piId, type: "CHARGE" },
    select: {
      bookingId: true,
      booking: {
        select: {
          bookingRef: true,
          checkIn: true,
          checkOut: true,
          totalAmount: true,
          currency: true,
          guestName: true,
          guestEmail: true,
          cancelReason: true,
          items: { select: { room: { select: { name: true } } } },
          hotel: { select: { name: true } },
        },
      },
    },
  });

  const refundIds = (charge.refunds?.data ?? []).map((r) => r.id);

  await Promise.all([
    prisma.payment.updateMany({
      where: { stripeRefundId: { in: refundIds } },
      data: { status: "REFUNDED", refundedAt: new Date() },
    }),
    chargePayment &&
      prisma.booking.update({
        where: { id: chargePayment.bookingId },
        data: { paymentStatus: "REFUNDED" },
      }),
  ]);

  if (!chargePayment) return;

  const { booking } = chargePayment;
  const item = booking.items[0];

  if (booking.guestEmail && item) {
    const refundTotal = charge.refunds?.data.reduce((sum, r) => sum + r.amount, 0) ?? 0;
    await sendBookingCancellation({
      to: booking.guestEmail,
      name: booking.guestName,
      bookingRef: booking.bookingRef,
      hotelName: booking.hotel.name,
      roomName: item.room.name,
      checkIn: format(booking.checkIn, "dd/MM/yyyy"),
      checkOut: format(booking.checkOut, "dd/MM/yyyy"),
      totalAmount: Number(booking.totalAmount).toLocaleString("vi-VN"),
      currency: booking.currency,
      refundAmount: (refundTotal / 100).toLocaleString("vi-VN"),
      cancelReason: booking.cancelReason ?? undefined,
      hotelsUrl: `${env.NEXT_PUBLIC_APP_URL}/hotels`,
    }).catch((err) => console.error("[email] booking-cancellation failed", err));
  }
}