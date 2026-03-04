import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { invalidateCache } from "@/lib/redis";

export const adminReviewRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
        hotelId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, status, hotelId } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(status && { status }),
        ...(hotelId && { hotelId }),
      };

      const [items, total] = await Promise.all([
        ctx.db.review.findMany({
          where,
          skip,
          take: limit,
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

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["APPROVED", "REJECTED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.id },
        include: { hotel: { select: { slug: true } } },
      });
      if (!review) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.review.update({
        where: { id: input.id },
        data: { status: input.status },
      });
      await invalidateCache(`hotel:${review.hotel.slug}`);
      return { success: true };
    }),
});
