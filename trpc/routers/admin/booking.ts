import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { PaymentStatus, Prisma } from "@/prisma/generated/prisma/client";
import { stripe } from "@/lib/stripe";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import {
  assertFound,
  buildPaginatedResult,
  getSkip,
  paginationInput,
} from "@/trpc/helpers";
import {
  sendBookingCancellation,
  sendCheckoutSummary,
  sendNoShow,
} from "@/lib/email";
import { formatCurrencyUSD, formatDateShort } from "@/lib/utils";

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["CHECKED_OUT"],
};

const bookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
]);

const paymentStatusEnum = z.enum([
  "UNPAID",
  "PENDING",
  "PAID",
  "REFUNDED",
  "FAILED",
  "CANCELLED",
]);

const BOOKING_ITEM_STATUS_MAP: Record<string, string> = {
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
  NO_SHOW: "CANCELLED",
};

const RELEASES_ROOM = new Set(["CHECKED_OUT", "CANCELLED", "NO_SHOW"]);

const bookingListSelect = {
  id: true,
  bookingRef: true,
  status: true,
  paymentStatus: true,
  guestName: true,
  guestEmail: true,
  guestPhone: true,
  checkIn: true,
  checkOut: true,
  totalAmount: true,
  currency: true,
  createdAt: true,
  hotel: { select: { name: true, slug: true } },
  items: {
    select: {
      nights: true,
      room: {
        select: { name: true, roomType: { select: { name: true } } },
      },
    },
  },
} as const;

const bookingForUpdateSelect = {
  id: true,
  bookingRef: true,
  status: true,
  paymentStatus: true,
  checkIn: true,
  checkOut: true,
  totalAmount: true,
  currency: true,
  guestName: true,
  guestEmail: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      nights: true,
      room: {
        select: {
          name: true,
        },
      },
    },
  },
  hotel: { select: { name: true } },
  payments: {
    where: { status: "PAID" as const, type: "CHARGE" as const },
    select: {
      id: true,
      amount: true,
      currency: true,
      stripePaymentIntentId: true,
    },
  },
} as const;

type RefundRecord = {
  stripeRefundId: string;
  amount: Prisma.Decimal;
  currency: string;
};

const processStripeRefunds = async (
  payments: {
    amount: Prisma.Decimal;
    currency: string;
    stripePaymentIntentId: string | null;
  }[],
): Promise<RefundRecord[]> => {
  const refunds: RefundRecord[] = [];
  for (const payment of payments) {
    if (!payment.stripePaymentIntentId) continue;
    try {
      const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
      });
      refunds.push({
        stripeRefundId: refund.id,
        amount: payment.amount,
        currency: payment.currency,
      });
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Hoàn tiền thất bại. Vui lòng kiểm tra Stripe dashboard.",
      });
    }
  }
  return refunds;
};

const buildBookingWhere = (input: {
  status?: z.infer<typeof bookingStatusEnum>;
  paymentStatus?: z.infer<typeof paymentStatusEnum>;
  hotelId?: string;
  from?: Date;
  to?: Date;
  search?: string;
}) => ({
  ...(input.status && { status: input.status }),
  ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
  ...(input.hotelId && { hotelId: input.hotelId }),
  ...((input.from || input.to) && {
    checkIn: {
      ...(input.from && { gte: input.from }),
      ...(input.to && { lte: input.to }),
    },
  }),
  ...(input.search && {
    OR: [
      { bookingRef: { contains: input.search, mode: "insensitive" as const } },
      { guestName: { contains: input.search, mode: "insensitive" as const } },
      { guestEmail: { contains: input.search, mode: "insensitive" as const } },
    ],
  }),
});

const bookingFilterInput = z.object({
  status: bookingStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
  hotelId: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const adminBookingRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      paginationInput.extend({
        search: z.string().optional(),
        status: bookingStatusEnum.optional(),
        paymentStatus: paymentStatusEnum.optional(),
        hotelId: z.string().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = buildBookingWhere(input);
      const [items, total] = await Promise.all([
        ctx.db.booking.findMany({
          where,
          skip: getSkip(input),
          take: input.limit,
          orderBy: { createdAt: "desc" },
          select: bookingListSelect,
        }),
        ctx.db.booking.count({ where }),
      ]);
      return buildPaginatedResult(items, total, input);
    }),

  events: adminProcedure.input(bookingFilterInput).query(({ ctx, input }) =>
    ctx.db.booking.findMany({
      where: buildBookingWhere(input),
      orderBy: { checkIn: "asc" },
      select: {
        id: true,
        guestName: true,
        status: true,
        checkIn: true,
        checkOut: true,
        hotel: { select: { name: true } },
      },
    }),
  ),

  detail: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          hotel: {
            select: {
              name: true,
              slug: true,
              address: { include: { city: { include: { country: true } } } },
            },
          },
          items: {
            include: {
              room: {
                select: {
                  name: true,
                  roomType: { select: { name: true } },
                  floor: true,
                },
              },
            },
          },
          payments: true,
          review: true,
        },
      });
      return assertFound(booking);
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "CONFIRMED",
          "CHECKED_IN",
          "CHECKED_OUT",
          "CANCELLED",
          "NO_SHOW",
        ]),
        cancelReason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        select: bookingForUpdateSelect,
      });
      assertFound(booking);

      const allowed = VALID_TRANSITIONS[booking!.status] ?? [];
      if (!allowed.includes(input.status))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Không thể chuyển từ ${booking!.status} sang ${input.status}`,
        });

      const now = new Date();
      const bookingItemIds = booking!.items.map((i) => i.id);
      const releasesRoom = RELEASES_ROOM.has(input.status);
      const paidPayments = booking!.payments;
      const hasPaidPayments = paidPayments.length > 0;

      let stripeRefunds: RefundRecord[] = [];
      let newPaymentStatus: PaymentStatus | undefined;

      if (input.status === "CANCELLED") {
        if (hasPaidPayments) {
          stripeRefunds = await processStripeRefunds(paidPayments);
          newPaymentStatus = "REFUNDED";
        } else {
          newPaymentStatus = "CANCELLED";
        }
      }

      // NO_SHOW: không hoàn tiền, không gọi stripe, tạo refund record 0 USD để ghi nhận
      const noShowZeroRefunds =
        input.status === "NO_SHOW" && hasPaidPayments
          ? paidPayments.map((p) => ({
              bookingId: booking!.id,
              userId: ctx.user.id,
              type: "REFUND" as const,
              status: "REFUNDED" as const,
              amount: new Prisma.Decimal(0),
              currency: p.currency,
              refundedAt: now,
            }))
          : [];

      await ctx.db.$transaction([
        ctx.db.booking.update({
          where: { id: input.id },
          data: {
            status: input.status,
            ...(input.status === "CANCELLED" || input.status === "NO_SHOW"
              ? { cancelledAt: now, cancelReason: input.cancelReason ?? null }
              : {}),
            ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}),
          },
        }),
        ctx.db.bookingItem.updateMany({
          where: { bookingId: input.id },
          data: { status: BOOKING_ITEM_STATUS_MAP[input.status] as never },
        }),
        ...(releasesRoom
          ? [
              ctx.db.roomAvailability.updateMany({
                where: { bookingItemId: { in: bookingItemIds } },
                data: {
                  status: "AVAILABLE",
                  bookingItemId: null,
                  lockToken: null,
                  lockExpiresAt: null,
                },
              }),
            ]
          : []),
        ...stripeRefunds.map((r) =>
          ctx.db.payment.create({
            data: {
              bookingId: booking!.id,
              userId: ctx.user.id,
              type: "REFUND",
              status: "PENDING",
              amount: r.amount,
              currency: r.currency,
              stripeRefundId: r.stripeRefundId,
            },
          }),
        ),
        ...noShowZeroRefunds.map((data) => ctx.db.payment.create({ data })),
      ]);

      const firstItem = booking!.items[0];
      const roomName = firstItem?.room?.name ?? "—";
      const nights = firstItem?.nights ?? 0;
      const checkIn = formatDateShort(booking!.checkIn);
      const checkOut = formatDateShort(booking!.checkOut);
      const totalAmount = formatCurrencyUSD(Number(booking!.totalAmount));
      const { currency } = booking!;
      const hotelName = booking!.hotel.name;
      const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://staywise.vn";

      if (input.status === "CHECKED_OUT") {
        sendCheckoutSummary({
          to: booking!.guestEmail,
          name: booking!.guestName,
          bookingRef: booking!.bookingRef,
          hotelName,
          roomName,
          checkIn,
          checkOut,
          nights,
          totalAmount,
          currency,
          reviewUrl: `${BASE_URL}/reviews/new?booking=${booking!.bookingRef}`,
          hotelsUrl: `${BASE_URL}/hotels`,
        }).catch((err) =>
          console.error("[email] sendCheckoutSummary failed:", err),
        );
      }

      if (input.status === "NO_SHOW") {
        sendNoShow({
          to: booking!.guestEmail,
          name: booking!.guestName,
          bookingRef: booking!.bookingRef,
          hotelName,
          roomName,
          checkIn,
          checkOut,
          totalAmount,
          currency,
          supportUrl: `${BASE_URL}/support?booking=${booking!.bookingRef}`,
          hotelsUrl: `${BASE_URL}/hotels`,
        }).catch((err) => console.error("[email] sendNoShow failed:", err));
      }

      if (input.status === "CANCELLED") {
        const refundTotal = stripeRefunds.reduce(
          (sum, r) => sum + Number(r.amount),
          0,
        );
        sendBookingCancellation({
          to: booking!.guestEmail,
          name: booking!.guestName,
          bookingRef: booking!.bookingRef,
          hotelName,
          roomName,
          checkIn,
          checkOut,
          totalAmount,
          currency,
          refundAmount:
            refundTotal > 0 ? formatCurrencyUSD(refundTotal) : undefined,
          cancelReason: input.cancelReason,
          hotelsUrl: `${BASE_URL}/hotels`,
        }).catch((err) =>
          console.error("[email] sendBookingCancellation failed:", err),
        );
      }

      return { success: true };
    }),
});
