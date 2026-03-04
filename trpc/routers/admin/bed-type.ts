import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { CACHE_KEYS, invalidateCache } from "@/lib/redis";

const invalidateBedTypeCache = () => invalidateCache(CACHE_KEYS.BED_TYPES_ALL);

export const adminBedTypeRouter = createTRPCRouter({
  list: baseProcedure.query(({ ctx }) =>
    ctx.db.bedType.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { roomBeds: true } } },
    }),
  ),

  create: adminProcedure
    .input(z.object({ name: z.string().min(2).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.bedType.findUnique({
        where: { name: input.name },
      });
      if (exists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Loại giường đã tồn tại",
        });

      const bedType = await ctx.db.bedType.create({ data: input });
      await invalidateBedTypeCache();
      return bedType;
    }),

  update: adminProcedure
    .input(z.object({ id: z.string(), name: z.string().min(2).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const duplicate = await ctx.db.bedType.findFirst({
        where: { name: input.name, id: { not: input.id } },
      });
      if (duplicate)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tên loại giường đã tồn tại",
        });

      const bedType = await ctx.db.bedType.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      await invalidateBedTypeCache();
      return bedType;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const usageCount = await ctx.db.roomBed.count({
        where: { bedTypeId: input.id },
      });
      if (usageCount > 0)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Không thể xóa: loại giường đang được dùng trong ${usageCount} phòng`,
        });

      await ctx.db.bedType.delete({ where: { id: input.id } });
      await invalidateBedTypeCache();
      return { success: true };
    }),
});
