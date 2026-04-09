import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";

export const adminRoomTypeRouter = createTRPCRouter({
  list: baseProcedure.query(({ ctx }) =>
    ctx.db.roomType.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { rooms: true } } },
    }),
  ),

  create: adminProcedure
    .input(z.object({ name: z.string().min(2).max(50) }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const exists = await ctx.db.roomType.findUnique({
        where: { name: input.name },
      });
      if (exists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Loại phòng đã tồn tại",
        });

      const roomType = await ctx.db.roomType.create({ data: input });
      return roomType;
    }),

  update: adminProcedure
    .input(z.object({ id: z.string(), name: z.string().min(2).max(50) }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const duplicate = await ctx.db.roomType.findFirst({
        where: { name: input.name, id: { not: input.id } },
      });
      if (duplicate)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tên loại phòng đã tồn tại",
        });

      const roomType = await ctx.db.roomType.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      return roomType;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const count = await ctx.db.room.count({
        where: { roomTypeId: input.id },
      });
      if (count > 0)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Không thể xóa: loại phòng đang được dùng bởi ${count} phòng`,
        });

      await ctx.db.roomType.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
