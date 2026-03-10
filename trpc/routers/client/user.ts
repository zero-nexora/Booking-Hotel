import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        emailVerified: true,
        role: true,
        createdAt: true,
      },
    });
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
        select: { id: true, name: true, phone: true, image: true },
      });
    }),

  connectedAccounts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.account.findMany({
      where: { userId: ctx.user.id },
      select: { id: true, providerId: true, accountId: true, createdAt: true },
    });
  }),

  deleteAccount: protectedProcedure
    .input(z.object({ confirm: z.literal(true) }))
    .mutation(async ({ ctx }) => {
      await ctx.db.user.delete({ where: { id: ctx.user.id } });
      return { success: true };
    }),
});
