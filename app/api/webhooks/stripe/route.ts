import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { env } from "@/lib/env";
import Stripe from "stripe";

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
    console.error(`[Stripe webhook] ${event.type}`, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function onPaymentSucceeded(pi: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: pi.id },
    include: { booking: { include: { items: true } } },
  });
  if (!payment) return;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: new Date() },
    });
    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED", paymentStatus: "PAID" },
    });
    await tx.bookingItem.updateMany({
      where: { bookingId: payment.bookingId },
      data: { status: "CONFIRMED" },
    });
    await tx.roomAvailability.updateMany({
      where: { bookingItemId: { in: payment.booking.items.map((i) => i.id) } },
      data: { status: "BOOKED", lockToken: null, lockExpiresAt: null },
    });
  });
}

async function onPaymentFailed(pi: Stripe.PaymentIntent) {
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: pi.id },
    data: {
      status: "FAILED",
      failureMessage: pi.last_payment_error?.message ?? "Thanh toán thất bại",
    },
  });
}

async function onChargeRefunded(charge: Stripe.Charge) {
  for (const refund of charge.refunds?.data ?? []) {
    await prisma.payment.updateMany({
      where: { stripeRefundId: refund.id },
      data: { status: "REFUNDED", refundedAt: new Date() },
    });
  }

  const piId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!piId) return;

  const chargePayment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: piId, type: "CHARGE" },
  });
  if (chargePayment) {
    await prisma.booking.update({
      where: { id: chargePayment.bookingId },
      data: { paymentStatus: "REFUNDED" },
    });
  }
}
