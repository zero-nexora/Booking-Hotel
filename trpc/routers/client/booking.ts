import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import {
  calcNights,
  calcTotal,
  getBookingExpiresAt,
  getDatesInRange,
  buildCursorWhere,
} from "@/lib/utils";
import { Prisma } from "@/generated/prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function isPrismaUniqueError(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}

const GuestInfoSchema = z.object({
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

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
        ...GuestInfoSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { hotelSlug, roomSlug, checkIn, checkOut, adults, children } =
        input;

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
          if (isPrismaUniqueError(e)) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Phòng đã được đặt trong khoảng thời gian này",
            });
          }
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
          amount: Math.round(total * 100),
          currency: "usd",
          metadata: { bookingId: booking.id, bookingRef: booking.bookingRef },
        });
      } catch {
        await ctx.db.$transaction([
          ctx.db.booking.update({
            where: { id: booking.id },
            data: { status: "CANCELLED", paymentStatus: "UNPAID" },
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
          items: {
            include: {
              room: { include: { roomType: true } },
            },
          },
          payments: { orderBy: { createdAt: "desc" } },
        },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return booking;
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
        cursor: z.object({ id: z.string(), updatedAt: z.date() }).optional(),
        limit: z.number().int().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cursorWhere = buildCursorWhere(input.cursor);
      const where = {
        userId: ctx.user.id,
        ...(input.status && { status: input.status }),
        ...cursorWhere,
      };

      const bookings = await ctx.db.booking.findMany({
        where,
        take: input.limit + 1,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        include: {
          hotel: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
          items: {
            include: { room: { include: { roomType: true } } },
          },
          _count: { select: { payments: true } },
        },
      });

      let nextCursor: { id: string; updatedAt: Date } | null = null;
      if (bookings.length > input.limit) {
        bookings.pop();
        const last = bookings[bookings.length - 1];
        nextCursor = { id: last.id, updatedAt: last.updatedAt };
      }

      return { items: bookings, nextCursor };
    }),

  bookingDetail: protectedProcedure
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
          payments: { orderBy: { createdAt: "asc" } },
          review: true,
        },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return booking;
    }),

  cancel: protectedProcedure
    .input(
      z.object({
        bookingRef: z.string(),
        cancelReason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingRef: input.bookingRef },
        select: {
          id: true,
          userId: true,
          status: true,
          items: { select: { id: true } },
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

      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Không thể huỷ đặt phòng ở trạng thái này",
        });
      }

      const bookingItemIds = booking.items.map((i) => i.id);
      const hasPaidPayments = booking.payments.length > 0;

      const refunds = await Promise.all(
        booking.payments
          .filter((p) => p.stripePaymentIntentId)
          .map(async (payment) => {
            try {
              const refund = await stripe.refunds.create({
                payment_intent: payment.stripePaymentIntentId!,
              });
              return {
                paymentId: payment.id,
                stripeRefundId: refund.id,
                amount: payment.amount,
                currency: payment.currency,
              };
            } catch {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Hoàn tiền thất bại. Vui lòng liên hệ hỗ trợ.",
              });
            }
          }),
      );

      const now = new Date();

      await ctx.db.$transaction([
        ctx.db.booking.update({
          where: { id: booking.id },
          data: {
            status: "CANCELLED",
            cancelledAt: now,
            cancelReason: input.cancelReason ?? null,
            ...(hasPaidPayments && { paymentStatus: "REFUNDED" }),
          },
        }),
        ctx.db.bookingItem.updateMany({
          where: { bookingId: booking.id },
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
              bookingId: booking.id,
              userId: ctx.user.id,
              type: "REFUND",
              status: "REFUNDED",
              amount: r.amount,
              currency: r.currency,
              stripeRefundId: r.stripeRefundId,
              refundedAt: now,
            },
          }),
        ),
      ]);

      return { success: true, refunded: refunds.length > 0 };
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

  recentBookings: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.booking.findMany({
      where: { userId: ctx.user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        hotel: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        items: { include: { room: true }, take: 1 },
      },
    });
  }),
});
