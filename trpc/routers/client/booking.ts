import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { calcNights, calcTotal, getBookingExpiresAt } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      const hotel = await ctx.db.hotel.findUnique({
        where: { slug: input.hotelSlug, status: "ACTIVE" },
        include: { policy: true },
      });
      if (!hotel)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Khách sạn không tồn tại",
        });

      const room = await ctx.db.room.findFirst({
        where: { hotelId: hotel.id, slug: input.roomSlug, isActive: true },
      });
      if (!room)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Phòng không tồn tại",
        });

      const nights = calcNights(input.checkIn, input.checkOut);
      const total = calcTotal(room.basePrice, nights);

      const dates: Date[] = [];
      const cur = new Date(input.checkIn);
      while (cur < input.checkOut) {
        dates.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }

      const unavailable = await ctx.db.roomAvailability.findFirst({
        where: {
          roomId: room.id,
          date: { in: dates },
          status: { not: "AVAILABLE" },
        },
      });
      if (unavailable)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Phòng đã được đặt trong khoảng ngày này",
        });

      const expiresAt = getBookingExpiresAt();

      const booking = await ctx.db.$transaction(async (tx) => {
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
            checkIn: input.checkIn,
            checkOut: input.checkOut,
            totalAmount: total,
            currency: "USD",
            expiresAt,
            items: {
              create: {
                roomId: room.id,
                checkIn: input.checkIn,
                checkOut: input.checkOut,
                nights,
                adults: input.adults,
                children: input.children,
                unitPrice: room.basePrice,
                total,
                currency: "USD",
                status: "PENDING",
              },
            },
          },
          include: { items: true },
        });

        const bookingItem = b.items[0];
        await tx.roomAvailability.createMany({
          data: dates.map((date) => ({
            roomId: room.id,
            date,
            status: "LOCKED",
            bookingItemId: bookingItem.id,
            lockToken: b.id,
            lockExpiresAt: expiresAt,
          })),
          skipDuplicates: true,
        });

        await tx.roomAvailability.updateMany({
          where: { roomId: room.id, date: { in: dates } },
          data: {
            status: "LOCKED",
            bookingItemId: bookingItem.id,
            lockToken: b.id,
            lockExpiresAt: expiresAt,
          },
        });

        return b;
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "usd",
        metadata: { bookingId: booking.id, bookingRef: booking.bookingRef },
      });

      await ctx.db.payment.create({
        data: {
          bookingId: booking.id,
          userId: ctx.user.id,
          type: "CHARGE",
          status: "PENDING",
          amount: total,
          currency: "USD",
          stripePaymentIntentId: paymentIntent.id,
        },
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

  confirmPayment: protectedProcedure
    .input(z.object({ bookingId: z.string(), paymentIntentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findFirst({
        where: {
          bookingId: input.bookingId,
          stripePaymentIntentId: input.paymentIntentId,
        },
        include: { booking: { include: { items: true } } },
      });
      if (!payment) throw new TRPCError({ code: "NOT_FOUND" });
      if (payment.booking.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });

      const intent = await stripe.paymentIntents.retrieve(
        input.paymentIntentId,
      );
      if (intent.status !== "succeeded") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Thanh toán chưa hoàn tất",
        });
      }

      await ctx.db.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: input.bookingId },
          data: { status: "CONFIRMED", paymentStatus: "PAID", expiresAt: null },
        });
        await tx.bookingItem.updateMany({
          where: { bookingId: input.bookingId },
          data: { status: "CONFIRMED" },
        });
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", paidAt: new Date() },
        });
        for (const item of payment.booking.items) {
          await tx.roomAvailability.updateMany({
            where: { bookingItemId: item.id },
            data: { status: "BOOKED", lockToken: null, lockExpiresAt: null },
          });
        }
      });

      return { bookingRef: payment.booking.bookingRef };
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
      const where: Record<string, unknown> = { userId: ctx.user.id };
      if (input.status) where.status = input.status;
      if (input.cursor) {
        where.OR = [
          { updatedAt: { lt: input.cursor.updatedAt } },
          { updatedAt: input.cursor.updatedAt, id: { lt: input.cursor.id } },
        ];
      }

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
      z.object({ bookingRef: z.string(), cancelReason: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingRef: input.bookingRef },
        include: {
          items: true,
          payments: { where: { status: "PAID", type: "CHARGE" } },
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

      await ctx.db.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
            cancelReason: input.cancelReason,
          },
        });
        await tx.bookingItem.updateMany({
          where: { bookingId: booking.id },
          data: { status: "CANCELLED" },
        });
        for (const item of booking.items) {
          await tx.roomAvailability.updateMany({
            where: { bookingItemId: item.id },
            data: {
              status: "AVAILABLE",
              bookingItemId: null,
              lockToken: null,
              lockExpiresAt: null,
            },
          });
        }

        for (const payment of booking.payments) {
          if (payment.stripePaymentIntentId) {
            const refund = await stripe.refunds.create({
              payment_intent: payment.stripePaymentIntentId,
            });
            await tx.payment.create({
              data: {
                bookingId: booking.id,
                userId: ctx.user.id,
                type: "REFUND",
                status: "REFUNDED",
                amount: payment.amount,
                currency: payment.currency,
                stripeRefundId: refund.id,
                refundedAt: new Date(),
              },
            });
          }
        }

        if (booking.payments.length > 0) {
          await tx.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: "REFUNDED" },
          });
        }
      });

      return { success: true };
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
