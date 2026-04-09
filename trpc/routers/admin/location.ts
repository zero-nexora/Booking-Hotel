import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";

export const adminLocationRouter = createTRPCRouter({
  listCountries: baseProcedure.query(({ ctx }) =>
    ctx.db.country.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { cities: true } } },
    }),
  ),

  createCountry: adminProcedure
    .input(z.object({ name: z.string().min(2).max(100) }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const exists = await ctx.db.country.findUnique({
        where: { name: input.name },
      });
      if (exists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Quốc gia đã tồn tại",
        });

      const country = await ctx.db.country.create({ data: input });
      return country;
    }),

  updateCountry: adminProcedure
    .input(z.object({ id: z.string(), name: z.string().min(2).max(100) }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const duplicate = await ctx.db.country.findFirst({
        where: { name: input.name, id: { not: input.id } },
      });
      if (duplicate)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tên quốc gia đã tồn tại",
        });

      const { id, ...data } = input;
      const country = await ctx.db.country.update({ where: { id }, data });
      return country;
    }),

  deleteCountry: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const cityCount = await ctx.db.city.count({
        where: { countryId: input.id },
      });
      if (cityCount > 0)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Không thể xóa: quốc gia đang chứa ${cityCount} thành phố`,
        });

      await ctx.db.country.delete({ where: { id: input.id } });
      return { success: true };
    }),

  listCities: baseProcedure
    .input(z.object({ countryId: z.string().optional() }))
    .query(({ ctx, input }) =>
      ctx.db.city.findMany({
        where: input.countryId ? { countryId: input.countryId } : undefined,
        orderBy: { name: "asc" },
        include: {
          country: { select: { name: true } },
          _count: { select: { addresses: true } },
        },
      }),
    ),

  createCity: adminProcedure
    .input(
      z.object({ name: z.string().min(2).max(100), countryId: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const exists = await ctx.db.city.findUnique({
        where: {
          name_countryId: { name: input.name, countryId: input.countryId },
        },
      });
      if (exists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Thành phố đã tồn tại trong quốc gia này",
        });

      const city = await ctx.db.city.create({ data: input });
      return city;
    }),

  updateCity: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(100).optional(),
        countryId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      if (input.name) {
        const targetCountryId =
          input.countryId ??
          (
            await ctx.db.city.findUnique({
              where: { id: input.id },
              select: { countryId: true },
            })
          )?.countryId;

        if (targetCountryId) {
          const duplicate = await ctx.db.city.findUnique({
            where: {
              name_countryId: {
                name: input.name,
                countryId: targetCountryId,
              },
            },
          });
          if (duplicate && duplicate.id !== input.id)
            throw new TRPCError({
              code: "CONFLICT",
              message: "Tên thành phố đã tồn tại trong quốc gia này",
            });
        }
      }

      const { id, ...data } = input;
      const city = await ctx.db.city.update({ where: { id }, data });
      return city;
    }),

  deleteCity: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const addrCount = await ctx.db.address.count({
        where: { cityId: input.id },
      });
      if (addrCount > 0)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Không thể xóa: thành phố đang liên kết với ${addrCount} khách sạn`,
        });

      await ctx.db.city.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
