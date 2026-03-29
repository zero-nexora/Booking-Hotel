import { z } from "zod";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import {
  calcNights,
  calcTotal,
  getBookingExpiresAt,
  getDatesInRange,
} from "@/lib/utils";
import { calcRefundAmount, calcRefundPolicy } from "@/lib/refund-policy";
import { stripe } from "@/lib/stripe";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import {
  assertFound,
  buildCursorWhere,
  cursorInput,
  popNextCursor,
} from "@/trpc/helpers";
import { sendBookingCancellation } from "@/lib/email";
import { format } from "date-fns";
import { env } from "@/lib/env";
import { Prisma } from "@/prisma/generated/prisma/client";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

const isPrismaUniqueError = (e: unknown): boolean =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

const guestInfoSchema = z.object({
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

type RefundRecord = {
  stripeRefundId: string;
  amount: Prisma.Decimal;
  refundAmount: number;
  currency: string;
};

const myBookingsInclude = {
  hotel: {
    include: { images: { where: { isPrimary: true }, take: 1 } },
  },
  items: {
    include: { room: { include: { roomType: true } } },
  },
  _count: { select: { payments: true } },
} as const;

const bookingDetailInclude = {
  hotel: {
    include: {
      address: { include: { city: { include: { country: true } } } },
      policy: true,
    },
  },
  items: {
    include: {
      room: {
        include: {
          roomType: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  },
  payments: { orderBy: { createdAt: "asc" as const } },
  review: true,
} as const;

export const bookingRouter = createTRPCRouter({
  createIntent: protectedProcedure
    .input(
      z.object({
        hotelSlug: z.string(),
        roomSlug: z.string(),
        checkIn: z.date(),
        checkOut: z.date(),
        adults: z.number().int().min(1),
        children: z.number().int().min(0).default(0),
        ...guestInfoSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.booking, ctx.user.id);

      const { hotelSlug, roomSlug, checkIn, checkOut, adults, children } =
        input;

      if (checkIn >= checkOut)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ngày checkout phải sau ngày checkin",
        });

      const [hotel, room] = await Promise.all([
        ctx.db.hotel.findUnique({
          where: { slug: hotelSlug, status: "ACTIVE" },
          select: { id: true, policy: true },
        }),
        ctx.db.room.findFirst({
          where: { slug: roomSlug, isActive: true },
          select: { id: true, basePrice: true },
        }),
      ]);

      if (!hotel)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Khách sạn không tồn tại",
        });
      if (!room)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Phòng không tồn tại",
        });

      const nights = calcNights(checkIn, checkOut);
      const total = calcTotal(room.basePrice, nights);
      const expiresAt = getBookingExpiresAt();
      const dates = getDatesInRange(checkIn, checkOut);

      const { booking, paymentId } = await ctx.db.$transaction(async (tx) => {
        const b = await tx.booking.create({
          data: {
            userId: ctx.user.id,
            hotelId: hotel.id,
            status: "PENDING",
            paymentStatus: "UNPAID",
            guestName: input.guestName,
            guestEmail: input.guestEmail,
            guestPhone: input.guestPhone,
            specialRequests: input.specialRequests,
            checkIn,
            checkOut,
            totalAmount: total,
            currency: "USD",
            expiresAt,
            items: {
              create: {
                roomId: room.id,
                checkIn,
                checkOut,
                nights,
                adults,
                children,
                unitPrice: room.basePrice,
                total,
                currency: "USD",
                status: "PENDING",
              },
            },
          },
          select: {
            id: true,
            bookingRef: true,
            items: { select: { id: true } },
          },
        });

        const bookingItemId = b.items[0]!.id;

        try {
          await tx.roomAvailability.createMany({
            data: dates.map((date) => ({
              roomId: room.id,
              date,
              status: "LOCKED" as const,
              bookingItemId,
              lockToken: b.id,
              lockExpiresAt: expiresAt,
            })),
          });
        } catch (e) {
          if (isPrismaUniqueError(e))
            throw new TRPCError({
              code: "CONFLICT",
              message: "Phòng đã được đặt trong khoảng thời gian này",
            });
          throw e;
        }

        const p = await tx.payment.create({
          data: {
            bookingId: b.id,
            userId: ctx.user.id,
            type: "CHARGE",
            status: "PENDING",
            amount: total,
            currency: "USD",
          },
          select: { id: true },
        });

        return { booking: b, paymentId: p.id };
      });

      let paymentIntent: Stripe.PaymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(total) * 100),
          currency: "usd",
          metadata: { bookingId: booking.id, bookingRef: booking.bookingRef },
        });
      } catch {
        await ctx.db.$transaction([
          ctx.db.booking.update({
            where: { id: booking.id },
            data: { status: "CANCELLED", paymentStatus: "CANCELLED" },
          }),
          ctx.db.payment.update({
            where: { id: paymentId },
            data: { status: "CANCELLED" },
          }),
          ctx.db.roomAvailability.updateMany({
            where: { lockToken: booking.id },
            data: {
              status: "AVAILABLE",
              lockToken: null,
              lockExpiresAt: null,
              bookingItemId: null,
            },
          }),
        ]);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Không thể khởi tạo thanh toán",
        });
      }

      await ctx.db.payment.update({
        where: { id: paymentId },
        data: { stripePaymentIntentId: paymentIntent.id },
      });

      return {
        bookingRef: booking.bookingRef,
        bookingId: booking.id,
        clientSecret: paymentIntent.client_secret,
        expiresAt,
        total,
        currency: "USD",
        nights,
      };
    }),

  getConfirmation: protectedProcedure
    .input(z.object({ bookingRef: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingRef: input.bookingRef },
        include: {
          hotel: {
            include: {
              address: { include: { city: { include: { country: true } } } },
              policy: true,
            },
          },
          items: { include: { room: { include: { roomType: true } } } },
          payments: { orderBy: { createdAt: "desc" } },
        },
      });
      assertFound(booking);
      if (booking!.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return booking!;
    }),

  myBookings: protectedProcedure
    .input(
      z.object({
        status: z
          .enum([
            "PENDING",
            "CONFIRMED",
            "CHECKED_IN",
            "CHECKED_OUT",
            "CANCELLED",
            "NO_SHOW",
          ])
          .optional(),
        cursor: cursorInput,
        limit: z.number().int().default(DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cursorWhere = buildCursorWhere(input.cursor);
      const bookings = await ctx.db.booking.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.status && { status: input.status }),
          ...cursorWhere,
        },
        take: input.limit + 1,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        include: myBookingsInclude,
      });
      return popNextCursor(bookings, input.limit);
    }),

  bookingDetail: protectedProcedure
    .input(z.object({ bookingRef: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingRef: input.bookingRef },
        include: bookingDetailInclude,
      });
      assertFound(booking);
      if (booking!.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return booking!;
    }),

  cancel: protectedProcedure
    .input(
      z.object({
        bookingRef: z.string(),
        cancelReason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.userCancel, ctx.user.id);

      const booking = await ctx.db.booking.findUnique({
        where: { bookingRef: input.bookingRef },
        select: {
          id: true,
          bookingRef: true,
          userId: true,
          status: true,
          checkIn: true,
          checkOut: true,
          totalAmount: true,
          currency: true,
          guestName: true,
          guestEmail: true,
          createdAt: true,
          hotel: { select: { name: true } },
          items: {
            select: {
              id: true,
              room: { select: { name: true } },
            },
          },
          payments: {
            where: { status: "PAID", type: "CHARGE" },
            select: {
              id: true,
              amount: true,
              currency: true,
              stripePaymentIntentId: true,
            },
          },
        },
      });

      assertFound(booking);
      if (booking!.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      if (!["PENDING", "CONFIRMED"].includes(booking!.status))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Không thể huỷ đặt phòng ở trạng thái này",
        });

      const now = new Date();
      const bookingItemIds = booking!.items.map((i) => i.id);
      const policy = calcRefundPolicy(
        booking!.checkIn,
        booking!.createdAt,
        now,
      );
      const refundPercent =
        booking!.payments.length > 0 ? policy.refundPercent : 0;

      const refunds: RefundRecord[] = [];
      for (const payment of booking!.payments) {
        if (!payment.stripePaymentIntentId) continue;
        if (refundPercent === 0) break;

        const refundAmount = calcRefundAmount(payment.amount, refundPercent);
        if (refundAmount <= 0) break;

        try {
          const refund = await stripe.refunds.create({
            payment_intent: payment.stripePaymentIntentId,
            amount: Math.round(refundAmount * 100),
          });
          refunds.push({
            stripeRefundId: refund.id,
            amount: payment.amount,
            refundAmount,
            currency: payment.currency,
          });
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Hoàn tiền thất bại. Vui lòng liên hệ hỗ trợ.",
          });
        }
      }

      const hasRefund = refunds.length > 0;
      const newPaymentStatus = hasRefund
        ? "REFUNDED"
        : booking!.payments.length > 0
          ? "PAID"
          : "CANCELLED";

      await ctx.db.$transaction([
        ctx.db.booking.update({
          where: { id: booking!.id },
          data: {
            status: "CANCELLED",
            cancelledAt: now,
            cancelReason: input.cancelReason ?? null,
            paymentStatus: newPaymentStatus,
          },
        }),
        ctx.db.bookingItem.updateMany({
          where: { bookingId: booking!.id },
          data: { status: "CANCELLED" },
        }),
        ctx.db.roomAvailability.updateMany({
          where: { bookingItemId: { in: bookingItemIds } },
          data: {
            status: "AVAILABLE",
            bookingItemId: null,
            lockToken: null,
            lockExpiresAt: null,
          },
        }),
        ...refunds.map((r) =>
          ctx.db.payment.create({
            data: {
              bookingId: booking!.id,
              userId: ctx.user.id,
              type: "REFUND",
              status: "PENDING",
              amount: new Prisma.Decimal(r.refundAmount),
              currency: r.currency,
              stripeRefundId: r.stripeRefundId,
            },
          }),
        ),
      ]);

      const item = booking!.items[0];
      if (booking!.guestEmail && item) {
        const refundTotal = refunds.reduce((sum, r) => sum + r.refundAmount, 0);
        await sendBookingCancellation({
          to: booking!.guestEmail,
          name: booking!.guestName,
          bookingRef: booking!.bookingRef ?? input.bookingRef,
          hotelName: booking!.hotel.name,
          roomName: item.room.name,
          checkIn: format(booking!.checkIn, "dd/MM/yyyy"),
          checkOut: format(booking!.checkOut, "dd/MM/yyyy"),
          totalAmount: Number(booking!.totalAmount).toLocaleString("vi-VN"),
          currency: booking!.currency,
          refundAmount:
            refundTotal > 0 ? refundTotal.toLocaleString("vi-VN") : "0",
          cancelReason: input.cancelReason,
          hotelsUrl: `${env.NEXT_PUBLIC_APP_URL}/hotels`,
        }).catch((err) =>
          console.error("[email] booking-cancellation failed", err),
        );
      }

      return {
        success: true,
        refunded: hasRefund,
        refundPercent,
        refundPolicy: policy.label,
      };
    }),

  quickStats: protectedProcedure.query(async ({ ctx }) => {
    const [bookingCount, reviewCount, totalSpent] = await Promise.all([
      ctx.db.booking.count({ where: { userId: ctx.user.id } }),
      ctx.db.review.count({ where: { userId: ctx.user.id } }),
      ctx.db.payment.aggregate({
        where: { userId: ctx.user.id, status: "PAID", type: "CHARGE" },
        _sum: { amount: true },
      }),
    ]);
    return {
      bookingCount,
      reviewCount,
      totalSpent: totalSpent._sum.amount ?? 0,
    };
  }),

  recentBookings: protectedProcedure.query(({ ctx }) =>
    ctx.db.booking.findMany({
      where: { userId: ctx.user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        hotel: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
        items: { include: { room: true }, take: 1 },
      },
    }),
  ),

  getVerification: baseProcedure
    .input(z.object({ bookingRef: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingRef: input.bookingRef },
        select: {
          bookingRef: true,
          status: true,
          paymentStatus: true,
          checkIn: true,
          checkOut: true,
          guestName: true,
          totalAmount: true,
          currency: true,
          hotel: {
            select: {
              name: true,
              starRating: true,
              address: {
                select: {
                  street: true,
                  city: { select: { name: true } },
                },
              },
            },
          },
          items: {
            select: {
              nights: true,
              adults: true,
              children: true,
              room: { select: { name: true } },
            },
          },
        },
      });

      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      return booking;
    }),
});
