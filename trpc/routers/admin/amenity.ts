import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";

export const adminAmenityRouter = createTRPCRouter({
  list: baseProcedure.query(({ ctx }) =>
    ctx.db.amenity.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { hotels: true, rooms: true } } },
    }),
  ),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const exists = await ctx.db.amenity.findUnique({
        where: { name: input.name },
      });
      if (exists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tiện nghi đã tồn tại",
        });

      const amenity = await ctx.db.amenity.create({ data: input });
      return amenity;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(100).optional(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      if (input.name) {
        const duplicate = await ctx.db.amenity.findFirst({
          where: { name: input.name, id: { not: input.id } },
        });
        if (duplicate)
          throw new TRPCError({
            code: "CONFLICT",
            message: "Tên tiện nghi đã tồn tại",
          });
      }

      const { id, ...data } = input;
      const amenity = await ctx.db.amenity.update({ where: { id }, data });
      return amenity;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const [hotelCount, roomCount] = await Promise.all([
        ctx.db.hotelAmenity.count({ where: { amenityId: input.id } }),
        ctx.db.roomAmenity.count({ where: { amenityId: input.id } }),
      ]);

      if (hotelCount > 0 || roomCount > 0)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Không thể xóa: tiện nghi đang được dùng bởi ${hotelCount} khách sạn và ${roomCount} phòng`,
        });

      await ctx.db.amenity.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
