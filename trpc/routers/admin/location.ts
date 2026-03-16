import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { getOrSet, invalidateCache, CACHE_KEYS, TTL } from "@/lib/redis";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";

const invalidateCountryCache = () => invalidateCache(CACHE_KEYS.COUNTRY_ALL);

const invalidateCityCache = () => invalidateCache(CACHE_KEYS.CITY_ALL);

export const adminLocationRouter = createTRPCRouter({
  listCountries: baseProcedure.query(({ ctx }) =>
    getOrSet(
      CACHE_KEYS.COUNTRY_ALL,
      () =>
        ctx.db.country.findMany({
          orderBy: { name: "asc" },
          include: { _count: { select: { cities: true } } },
        }),
      TTL.LONG,
    ),
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
      await invalidateCountryCache();
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
      await invalidateCountryCache();
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
      await invalidateCountryCache();
      return { success: true };
    }),

  listCities: baseProcedure
    .input(z.object({ countryId: z.string().optional() }))
    .query(({ ctx, input }) => {
      const cacheKey = input.countryId
        ? `${CACHE_KEYS.CITY_ALL}:${input.countryId}`
        : CACHE_KEYS.CITY_ALL;

      return getOrSet(
        cacheKey,
        () =>
          ctx.db.city.findMany({
            where: input.countryId ? { countryId: input.countryId } : undefined,
            orderBy: { name: "asc" },
            include: {
              country: { select: { name: true } },
              _count: { select: { addresses: true } },
            },
          }),
        TTL.LONG,
      );
    }),

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
      await invalidateCityCache();
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
      await invalidateCityCache();
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
      await invalidateCityCache();
      return { success: true };
    }),
});
