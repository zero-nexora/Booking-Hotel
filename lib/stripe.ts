import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const createPaymentIntent = (opts: {
  amount: number;
  currency: string;
  bookingRef: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}) => {
  return stripe.paymentIntents.create({
    amount: opts.amount,
    currency: opts.currency.toLowerCase(),
    receipt_email: opts.customerEmail,
    metadata: {
      bookingRef: opts.bookingRef,
      ...opts.metadata,
    },
  });
};

export const retrivePaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

export const createRefund = (opts: {
  paymentIntentId: string;
  amount?: number;
  metadata?: Record<string, string>;
}) => {
  return stripe.refunds.create({
    payment_intent: opts.paymentIntentId,
    ...(opts.amount ? { amount: opts.amount } : {}),
    metadata: opts.metadata,
  });
};

export const verifyWebhookSignature = (
  payload: string | Buffer,
  signature: string,
) => {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET,
  );
};
