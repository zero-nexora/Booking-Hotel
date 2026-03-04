import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const clientUserRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) =>
    ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
  ),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        phone: z.string().optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
        select: { id: true, name: true, email: true, phone: true, image: true },
      }),
    ),
});
