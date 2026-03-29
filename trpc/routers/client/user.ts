import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  emailVerified: true,
  role: true,
  createdAt: true,
} as const;

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) =>
    ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: userProfileSelect,
    }),
  ),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.userMutation, ctx.user.id);

      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
        select: { id: true, name: true, phone: true, image: true },
      });
    }),

  connectedAccounts: protectedProcedure.query(({ ctx }) =>
    ctx.db.account.findMany({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        providerId: true,
        accountId: true,
        createdAt: true,
        userId: true,
      },
    }),
  ),

  deleteAccount: protectedProcedure
    .input(z.object({ confirm: z.literal(true) }))
    .mutation(async ({ ctx }) => {
      await ctx.db.user.delete({ where: { id: ctx.user.id } });
      return { success: true };
    }),
});
