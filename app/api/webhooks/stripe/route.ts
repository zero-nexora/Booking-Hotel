import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { env } from "@/lib/env";
import {
  sendBookingConfirmation,
  sendPaymentFailed,
  sendRefundFailed,
} from "@/lib/email";
import { format } from "date-fns";
import Stripe from "stripe";
import { generateQRBase64 } from "@/lib/qr-code";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig)
    return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[stripe-webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await onPaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await onPaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "refund.created":
        await onRefundCreated(event.data.object as Stripe.Refund);
        break;
      case "refund.updated":
        await onRefundUpdated(event.data.object as Stripe.Refund);
        break;
      case "refund.failed":
        await onRefundFailed(event.data.object as Stripe.Refund);
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
          status: true,
          paymentStatus: true,
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

  if (booking.status === "CONFIRMED" && booking.paymentStatus === "PAID")
    return;
  if (booking.status === "CANCELLED") return;

  const item = booking.items[0];

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: new Date() },
    }),
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED", paymentStatus: "PAID", expiresAt: null },
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

    const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/booking/verify/${booking.bookingRef}`;
    const qrBase64 = await generateQRBase64(verifyUrl);

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
      verifyUrl,
      qrBase64,
    }).catch((err) =>
      console.error("[email] booking-confirmation failed", err),
    );
  }
}

async function onPaymentFailed(pi: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: pi.id },
    select: {
      id: true,
      status: true,
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
          items: { select: { room: { select: { name: true } } } },
          hotel: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!payment) return;
  if (payment.status === "FAILED") return;

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "FAILED",
      failureMessage: pi.last_payment_error?.message ?? "Thanh toán thất bại",
    },
  });

  const { booking } = payment;
  const item = booking.items[0];
  if (!booking.guestEmail || !item) return;

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
    retryUrl: `${env.NEXT_PUBLIC_APP_URL}/account/bookings/${booking.bookingRef}`,
  }).catch((err) => console.error("[email] payment-failed failed", err));
}

async function onRefundCreated(refund: Stripe.Refund) {
  const payment = await prisma.payment.findUnique({
    where: { stripeRefundId: refund.id },
    select: {
      id: true,
      status: true,
      amount: true,
      currency: true,
      booking: {
        select: {
          bookingRef: true,
          checkIn: true,
          checkOut: true,
          cancelReason: true,
          guestName: true,
          guestEmail: true,
          items: { select: { room: { select: { name: true } } } },
          hotel: { select: { name: true } },
        },
      },
    },
  });

  if (!payment) return;
  if (payment.status === "REFUNDED") return;

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "REFUNDED", refundedAt: new Date() },
  });

  const { booking } = payment;
  const item = booking.items[0];
  if (!booking.guestEmail || !item) return;
}

async function onRefundFailed(refund: Stripe.Refund) {
  const payment = await prisma.payment.findUnique({
    where: { stripeRefundId: refund.id },
    select: {
      id: true,
      status: true,
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
          items: { select: { room: { select: { name: true } } } },
          hotel: { select: { name: true } },
        },
      },
    },
  });

  if (!payment) return;
  if (payment.status === "FAILED") return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failureMessage: refund.failure_reason ?? "Hoàn tiền thất bại",
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: "FAILED" },
    }),
  ]);

  const { booking } = payment;
  const item = booking.items[0];
  if (!booking.guestEmail || !item) return;

  await sendRefundFailed({
    to: booking.guestEmail,
    name: booking.guestName,
    bookingRef: booking.bookingRef,
    hotelName: booking.hotel.name,
    roomName: item.room.name,
    checkIn: format(booking.checkIn, "dd/MM/yyyy"),
    checkOut: format(booking.checkOut, "dd/MM/yyyy"),
    totalAmount: Number(booking.totalAmount).toLocaleString("vi-VN"),
    currency: booking.currency,
    supportUrl: `${env.NEXT_PUBLIC_APP_URL}/support`,
  }).catch((err) => console.error("[email] refund-failed failed", err));
}

async function onRefundUpdated(refund: Stripe.Refund) {
  if (refund.status !== "failed") return;

  const payment = await prisma.payment.findUnique({
    where: { stripeRefundId: refund.id },
    select: {
      id: true,
      status: true,
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
          items: { select: { room: { select: { name: true } } } },
          hotel: { select: { name: true } },
        },
      },
    },
  });

  if (!payment) return;
  if (payment.status === "FAILED") return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failureMessage: refund.failure_reason ?? "Hoàn tiền thất bại",
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: "FAILED" },
    }),
  ]);

  const { booking } = payment;
  const item = booking.items[0];
  if (!booking.guestEmail || !item) return;

  await sendRefundFailed({
    to: booking.guestEmail,
    name: booking.guestName,
    bookingRef: booking.bookingRef,
    hotelName: booking.hotel.name,
    roomName: item.room.name,
    checkIn: format(booking.checkIn, "dd/MM/yyyy"),
    checkOut: format(booking.checkOut, "dd/MM/yyyy"),
    totalAmount: Number(booking.totalAmount).toLocaleString("vi-VN"),
    currency: booking.currency,
    supportUrl: `${env.NEXT_PUBLIC_APP_URL}/support`,
  }).catch((err) => console.error("[email] refund-failed failed", err));
}
