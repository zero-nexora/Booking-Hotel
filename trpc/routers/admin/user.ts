import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import { buildPaginatedResult, getSkip, paginationInput } from "@/trpc/helpers";

const userListSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  image: true,
  emailVerified: true,
  createdAt: true,
  _count: { select: { bookings: true, reviews: true } },
} as const;

export const adminUserRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      paginationInput.extend({
        search: z.string().optional(),
        role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search, role } = input;
      const where = {
        ...(role && { role }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          skip: getSkip(input),
          take: input.limit,
          orderBy: { createdAt: "desc" },
          select: userListSelect,
        }),
        ctx.db.user.count({ where }),
      ]);

      return buildPaginatedResult(items, total, input);
    }),

  setRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["ADMIN", "CUSTOMER"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      if (input.userId === ctx.user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Không thể đổi role của chính mình",
        });

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: { id: true, name: true, role: true },
      });
    }),
});
