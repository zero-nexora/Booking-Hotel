import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { invalidateCache, CACHE_KEYS } from "@/lib/redis";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import {
  assertFound,
  buildPaginatedResult,
  getSkip,
  paginationInput,
} from "@/trpc/helpers";

const reviewStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const adminReviewRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      paginationInput.pick({ page: true, limit: true }).extend({
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        status: reviewStatusEnum.optional(),
        hotelId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { status, hotelId } = input;
      const where = {
        ...(status && { status }),
        ...(hotelId && { hotelId }),
      };

      const [items, total] = await Promise.all([
        ctx.db.review.findMany({
          where,
          skip: getSkip(input),
          take: input.limit,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true, image: true } },
            hotel: { select: { name: true, slug: true } },
            booking: {
              select: { bookingRef: true, checkIn: true, checkOut: true },
            },
          },
        }),
        ctx.db.review.count({ where }),
      ]);

      return buildPaginatedResult(items, total, input);
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["APPROVED", "REJECTED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const review = await ctx.db.review.findUnique({
        where: { id: input.id },
        include: { hotel: { select: { slug: true } } },
      });
      assertFound(review);

      await ctx.db.review.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      await invalidateCache(CACHE_KEYS.HOTEL_DETAIL(review!.hotel.slug));
      return { success: true };
    }),
});
