import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import {
  assertFound,
  buildPaginatedResult,
  getSkip,
  paginationInput,
} from "@/trpc/helpers";
import { Prisma } from "@/prisma/generated/prisma/client";

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
      const { status, hotelId, search } = input;
      const where: Prisma.ReviewWhereInput = {
        ...(status && { status }),
        ...(hotelId && { hotelId }),
        ...(search && {
          OR: [
            { comment: { contains: input.search, mode: "insensitive" } },
            { user: { name: { contains: input.search, mode: "insensitive" } } },
            {
              hotel: { name: { contains: input.search, mode: "insensitive" } },
            },
          ],
        }),
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

      return { success: true };
    }),
});
