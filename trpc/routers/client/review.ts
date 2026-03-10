import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        bookingRef: z.string(),
        overallRating: z.number().int().min(1).max(5),
        title: z.string().max(200).optional(),
        comment: z.string().min(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingRef: input.bookingRef },
        include: { review: true },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      if (booking.status !== "CHECKED_OUT") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chỉ có thể đánh giá sau khi check-out",
        });
      }
      if (booking.review) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bạn đã đánh giá booking này rồi",
        });
      }

      return ctx.db.review.create({
        data: {
          bookingId: booking.id,
          hotelId: booking.hotelId,
          userId: ctx.user.id,
          overallRating: input.overallRating,
          title: input.title,
          comment: input.comment,
          status: "PENDING",
        },
      });
    }),

  myReviews: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), updatedAt: z.date() }).optional(),
        limit: z.number().int().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {
        userId: ctx.user.id,
        status: "APPROVED",
      };
      if (input.cursor) {
        where.OR = [
          { updatedAt: { lt: input.cursor.updatedAt } },
          { updatedAt: input.cursor.updatedAt, id: { lt: input.cursor.id } },
        ];
      }

      const reviews = await ctx.db.review.findMany({
        where,
        take: input.limit + 1,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        include: {
          hotel: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
          booking: {
            select: { checkIn: true, checkOut: true, bookingRef: true },
          },
        },
      });

      let nextCursor: { id: string; updatedAt: Date } | null = null;
      if (reviews.length > input.limit) {
        reviews.pop();
        const last = reviews[reviews.length - 1];
        nextCursor = { id: last.id, updatedAt: last.updatedAt };
      }

      return { items: reviews, nextCursor };
    }),

  getForBooking: protectedProcedure
    .input(z.object({ bookingRef: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: {
          bookingRef: input.bookingRef,
        },
        include: {
          review: {
            where: {
              status: "APPROVED",
            },
          },
          hotel: { select: { name: true } },
          items: { include: { room: { select: { name: true } } }, take: 1 },
        },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return booking;
    }),
});
