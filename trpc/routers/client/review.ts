import { z } from "zod";
import { reviewRateLimit } from "@/lib/rate-limit";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const clientReviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        overallRating: z.number().min(1).max(5).int(),
        title: z.string().max(100).optional(),
        comment: z.string().min(10).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await reviewRateLimit.limit(ctx.user.id);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const booking = await ctx.db.booking.findFirst({
        where: {
          id: input.bookingId,
          userId: ctx.user.id,
          status: "CHECKED_OUT",
        },
        include: { review: true },
      });
      if (!booking)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chỉ đánh giá được sau khi đã trả phòng",
        });
      if (booking.review)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bạn đã gửi đánh giá cho lần đặt này",
        });

      return ctx.db.review.create({
        data: {
          bookingId: input.bookingId,
          hotelId: booking.hotelId,
          userId: ctx.user.id,
          overallRating: input.overallRating,
          title: input.title,
          comment: input.comment,
          status: "PENDING",
        },
      });
    }),
});
