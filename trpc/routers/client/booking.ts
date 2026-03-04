import { z } from "zod";
import { bookingRateLimit } from "@/lib/rate-limit";
import { stripe } from "@/lib/stripe";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const CURRENCY = "usd";
const LOCK_MINUTES = 15;

function getDateRange(checkIn: Date, checkOut: Date): Date[] {
  const dates: Date[] = [];
  const cur = new Date(checkIn);
  while (cur < checkOut) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const cursor = z
  .object({ id: z.string(), updatedAt: z.coerce.date() })
  .nullish();

export const clientBookingRouter = createTRPCRouter({
  /* ── Tạo booking + Stripe PaymentIntent ── */
  create: protectedProcedure
    .input(
      z.object({
        hotelId: z.string(),
        roomId: z.string(),
        checkIn: z.coerce.date(),
        checkOut: z.coerce.date(),
        adults: z.number().min(1),
        children: z.number().min(0).default(0),
        guestName: z.string().min(2),
        guestEmail: z.string().email(),
        guestPhone: z.string().optional(),
        specialRequests: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await bookingRateLimit.limit(ctx.user.id);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      if (input.checkIn >= input.checkOut)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ngày trả phòng phải sau ngày nhận phòng",
        });

      const nights = Math.ceil(
        (input.checkOut.getTime() - input.checkIn.getTime()) / 86_400_000,
      );

      const room = await ctx.db.room.findUnique({
        where: { id: input.roomId, isActive: true },
        include: { hotel: { select: { status: true } } },
      });
      if (!room || room.hotel.status !== "ACTIVE")
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Phòng không khả dụng",
        });

      const dates = getDateRange(input.checkIn, input.checkOut);
      const lockToken = randomUUID();
      const lockExpiresAt = new Date(Date.now() + LOCK_MINUTES * 60_000);

      return ctx.db.$transaction(async (tx) => {
        // Kiểm tra phòng bị khoá / đặt
        const blocked = await tx.roomAvailability.findMany({
          where: {
            roomId: input.roomId,
            date: { in: dates },
            status: { in: ["LOCKED", "BOOKED", "MAINTENANCE"] },
            OR: [
              { lockExpiresAt: null },
              { lockExpiresAt: { gt: new Date() } },
            ],
          },
        });
        if (blocked.length)
          throw new TRPCError({
            code: "CONFLICT",
            message: "Phòng đã được đặt trong khoảng thời gian này",
          });

        // Upsert availability → LOCKED
        const existing = await tx.roomAvailability.findMany({
          where: { roomId: input.roomId, date: { in: dates } },
          select: { date: true },
        });
        const existingSet = new Set(existing.map((r) => r.date.toISOString()));

        await tx.roomAvailability.createMany({
          data: dates
            .filter((d) => !existingSet.has(d.toISOString()))
            .map((d) => ({
              roomId: input.roomId,
              date: d,
              status: "LOCKED" as const,
              lockToken,
              lockExpiresAt,
            })),
        });
        await tx.roomAvailability.updateMany({
          where: { roomId: input.roomId, date: { in: dates } },
          data: { status: "LOCKED", lockToken, lockExpiresAt },
        });

        const unitPrice = Number(room.basePrice);
        const total = unitPrice * nights;

        const booking = await tx.booking.create({
          data: {
            userId: ctx.user.id,
            hotelId: input.hotelId,
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
            expiresAt: lockExpiresAt,
            items: {
              create: {
                roomId: input.roomId,
                checkIn: input.checkIn,
                checkOut: input.checkOut,
                nights,
                adults: input.adults,
                children: input.children,
                unitPrice,
                total,
                currency: "USD",
                status: "PENDING",
              },
            },
          },
          include: { items: true },
        });

        await tx.roomAvailability.updateMany({
          where: { roomId: input.roomId, date: { in: dates }, lockToken },
          data: { bookingItemId: booking.items[0].id },
        });

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total),
          currency: CURRENCY,
          metadata: {
            bookingId: booking.id,
            bookingRef: booking.bookingRef,
            userId: ctx.user.id,
          },
        });

        await tx.payment.create({
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
          clientSecret: paymentIntent.client_secret,
          expiresAt: lockExpiresAt,
        };
      });
    }),

  /* ── Danh sách booking của user (infinite) ── */
  list: protectedProcedure
    .input(
      z.object({
        cursor,
        limit: z.number().min(1).max(20).default(10),
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor: cur, limit, status } = input;

      const items = await ctx.db.booking.findMany({
        where: {
          userId: ctx.user.id,
          ...(status ? { status } : {}),
          ...(cur
            ? {
                OR: [
                  { updatedAt: { lt: cur.updatedAt } },
                  {
                    AND: [{ updatedAt: cur.updatedAt }, { id: { lt: cur.id } }],
                  },
                ],
              }
            : {}),
        },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        take: limit + 1,
        select: {
          id: true,
          bookingRef: true,
          status: true,
          paymentStatus: true,
          checkIn: true,
          checkOut: true,
          totalAmount: true,
          currency: true,
          createdAt: true,
          updatedAt: true,
          hotel: {
            select: {
              name: true,
              slug: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
              address: {
                select: {
                  city: {
                    select: { name: true, country: { select: { name: true } } },
                  },
                },
              },
            },
          },
          items: {
            select: {
              nights: true,
              room: {
                select: { name: true, roomType: { select: { name: true } } },
              },
            },
          },
        },
      });

      let nextCursor: typeof cur = null;
      if (items.length > limit) {
        const last = items.pop()!;
        nextCursor = { id: last.id, updatedAt: last.updatedAt };
      }
      return { items, nextCursor };
    }),

  /* ── Chi tiết booking ── */
  detail: protectedProcedure
    .input(z.object({ bookingRef: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findFirst({
        where: { bookingRef: input.bookingRef, userId: ctx.user.id },
        include: {
          hotel: {
            select: {
              name: true,
              slug: true,
              phone: true,
              images: { where: { isPrimary: true }, take: 1 },
              address: { include: { city: { include: { country: true } } } },
              policy: true,
            },
          },
          items: {
            include: {
              room: {
                select: {
                  name: true,
                  roomType: {
                    select: {
                      name: true,
                    },
                  },
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
          payments: {
            select: {
              id: true,
              type: true,
              status: true,
              amount: true,
              currency: true,
              paidAt: true,
              refundedAt: true,
            },
          },
          review: { select: { id: true, overallRating: true, status: true } },
        },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      return booking;
    }),

  /* ── Hủy booking ── */
  cancel: protectedProcedure
    .input(z.object({ bookingId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findFirst({
        where: {
          id: input.bookingId,
          userId: ctx.user.id,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        include: { items: true },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
            cancelReason: input.reason,
          },
        });
        await tx.bookingItem.updateMany({
          where: { bookingId: booking.id },
          data: { status: "CANCELLED" },
        });
        await tx.roomAvailability.updateMany({
          where: { bookingItemId: { in: booking.items.map((i) => i.id) } },
          data: {
            status: "AVAILABLE",
            bookingItemId: null,
            lockToken: null,
            lockExpiresAt: null,
          },
        });

        const paidPayment = await tx.payment.findFirst({
          where: { bookingId: booking.id, status: "PAID", type: "CHARGE" },
        });
        if (paidPayment?.stripePaymentIntentId) {
          const pi = await stripe.paymentIntents.retrieve(
            paidPayment.stripePaymentIntentId,
          );
          if (pi.latest_charge) {
            const refund = await stripe.refunds.create({
              charge: pi.latest_charge as string,
              metadata: { bookingId: booking.id },
            });
            await tx.payment.create({
              data: {
                bookingId: booking.id,
                userId: ctx.user.id,
                type: "REFUND",
                status: "PENDING",
                amount: Number(paidPayment.amount),
                currency: "VND",
                stripeRefundId: refund.id,
              },
            });
          }
        }
      });

      return { success: true };
    }),
});
