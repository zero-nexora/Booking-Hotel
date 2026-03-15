import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@/generated/prisma/client";

const HotelSearchInput = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  adults: z.number().int().min(1).default(1),
  children: z.number().int().min(0).default(0),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  stars: z.array(z.number().int().min(1).max(5)).optional(),
  amenities: z.array(z.string()).optional(),
  bedTypes: z.array(z.string()).optional(),
  roomTypes: z.array(z.string()).optional(),
  minRating: z.number().optional(),
  sort: z
    .enum(["price_asc", "price_desc", "rating", "stars"])
    .default("price_asc"),
  cursor: z.object({ id: z.string(), updatedAt: z.date() }).optional(),
  limit: z.number().int().min(1).max(50).default(12),
});

export const hotelRouter = createTRPCRouter({
  featured: baseProcedure.query(async ({ ctx }) => {
    const hotels = await ctx.db.hotel.findMany({
      where: { status: "ACTIVE" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        address: { include: { city: { include: { country: true } } } },
        reviews: {
          where: { status: "APPROVED" },
          select: { overallRating: true },
        },
      },
    });

    return hotels.map((h) => ({
      ...h,
      avgRating:
        h.reviews.length > 0
          ? h.reviews.reduce((s, r) => s + r.overallRating, 0) /
            h.reviews.length
          : null,
      reviewCount: h.reviews.length,
    }));
  }),

  popularDestinations: baseProcedure.query(async ({ ctx }) => {
    const cities = await ctx.db.city.findMany({
      include: {
        country: true,
        addresses: {
          include: {
            hotel: { where: { status: "ACTIVE" }, select: { id: true } },
          },
        },
      },
    });

    return cities
      .map((c) => ({
        id: c.id,
        name: c.name,
        country: c.country.name,
        hotelCount: c.addresses.filter((a) => a.hotel).length,
      }))
      .filter((c) => c.hotelCount > 0)
      .sort((a, b) => b.hotelCount - a.hotelCount)
      .slice(0, 8);
  }),

  topAmenities: baseProcedure.query(async ({ ctx }) => {
    const amenities = await ctx.db.amenity.findMany({
      include: { hotels: { select: { hotelId: true } } },
    });
    return amenities
      .map((a) => ({ ...a, usageCount: a.hotels.length }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 12);
  }),

  highlightedReviews: baseProcedure.query(async ({ ctx }) => {
    return ctx.db.review.findMany({
      where: { status: "APPROVED", overallRating: { gte: 4 } },
      take: 6,
      orderBy: { overallRating: "desc" },
      include: {
        user: { select: { name: true, image: true } },
        hotel: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    });
  }),

  search: baseProcedure
    .input(HotelSearchInput)
    .query(async ({ ctx, input }) => {
      const {
        city,
        country,
        checkIn,
        checkOut,
        minPrice,
        maxPrice,
        stars,
        amenities,
        bedTypes,
        roomTypes,
        minRating,
        sort,
        cursor,
        limit,
      } = input;

      const roomWhere: Prisma.RoomWhereInput = { isActive: true };

      if (minPrice !== undefined || maxPrice !== undefined) {
        roomWhere.basePrice = {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        };
      }
      if (bedTypes?.length) {
        roomWhere.beds = { some: { bedType: { name: { in: bedTypes } } } };
      }
      if (roomTypes?.length) {
        roomWhere.roomType = { name: { in: roomTypes } };
      }
      if (checkIn && checkOut) {
        const dates: Date[] = [];
        const cur = new Date(checkIn);
        while (cur < checkOut) {
          dates.push(new Date(cur));
          cur.setDate(cur.getDate() + 1);
        }
        roomWhere.availability = {
          every: { date: { in: dates }, status: "AVAILABLE" },
        };
      }

      const hotelWhere: Prisma.HotelWhereInput = {
        status: "ACTIVE",
        rooms: { some: roomWhere },
      };

      if (stars?.length) hotelWhere.starRating = { in: stars };
      if (amenities?.length) {
        hotelWhere.amenities = {
          some: { amenity: { name: { in: amenities } } },
        };
      }
      if (city || country) {
        hotelWhere.address = {
          city: {
            ...(city && { name: { contains: city, mode: "insensitive" } }),
            ...(country && {
              country: { name: { contains: country, mode: "insensitive" } },
            }),
          },
        };
      }
      if (cursor) {
        hotelWhere.OR = [
          { updatedAt: { lt: cursor.updatedAt } },
          { updatedAt: { equals: cursor.updatedAt }, id: { lt: cursor.id } },
        ];
      }

      const isPriceSort = sort === "price_asc" || sort === "price_desc";

      const orderBy: Prisma.HotelOrderByWithRelationInput[] =
        sort === "stars"
          ? [{ starRating: "desc" }, { updatedAt: "desc" }]
          : [{ updatedAt: "desc" }];

      const rows = await ctx.db.hotel.findMany({
        where: hotelWhere,
        take: isPriceSort ? 500 : limit + 1,
        orderBy,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          address: { include: { city: { include: { country: true } } } },
          amenities: { include: { amenity: true }, take: 5 },
          reviews: {
            where: { status: "APPROVED" },
            select: { overallRating: true },
          },
          rooms: {
            where: roomWhere,
            orderBy: { basePrice: "asc" },
            take: 1,
            select: { basePrice: true },
          },
        },
      });

      let results = rows.map((h) => ({
        ...h,
        avgRating:
          h.reviews.length > 0
            ? h.reviews.reduce((s, r) => s + r.overallRating, 0) /
              h.reviews.length
            : null,
        reviewCount: h.reviews.length,
        minPrice: h.rooms[0]?.basePrice ?? null,
      }));

      if (minRating !== undefined) {
        results = results.filter((h) => (h.avgRating ?? 0) >= minRating);
      }

      if (isPriceSort) {
        results.sort((a, b) => {
          const pa = Number(a.minPrice ?? Infinity);
          const pb = Number(b.minPrice ?? Infinity);
          return sort === "price_asc" ? pa - pb : pb - pa;
        });
      }

      let nextCursor: { id: string; updatedAt: Date } | null = null;

      if (results.length > limit) {
        results = results.slice(0, limit);
        const last = results[results.length - 1];
        if (last) nextCursor = { id: last.id, updatedAt: last.updatedAt };
      }

      return { items: results, nextCursor };
    }),

  detail: baseProcedure
    .input(
      z.object({
        slug: z.string(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const hotel = await ctx.db.hotel.findUnique({
        where: { slug: input.slug, status: "ACTIVE" },
        include: {
          images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
          address: { include: { city: { include: { country: true } } } },
          policy: true,
          amenities: { include: { amenity: true } },
          rooms: {
            where: {
              isActive: true,
              availability: {
                every: {
                  date: { gte: input.checkIn, lte: input.checkOut },
                  status: "AVAILABLE",
                },
              },
            },
            include: {
              roomType: true,
              images: { where: { isPrimary: true }, take: 1 },
              beds: { include: { bedType: true } },
              amenities: { include: { amenity: true } },
              availability:
                input.checkIn && input.checkOut
                  ? {
                      where: {
                        date: { gte: input.checkIn, lt: input.checkOut },
                      },
                    }
                  : undefined,
            },
          },
          _count: { select: { reviews: { where: { status: "APPROVED" } } } },
        },
      });

      if (!hotel)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Khách sạn không tồn tại",
        });

      const allApprovedReviews = await ctx.db.review.aggregate({
        where: { hotelId: hotel.id, status: "APPROVED" },
        _avg: { overallRating: true },
        _count: true,
      });

      let availableRooms = hotel.rooms;
      if (input.checkIn && input.checkOut) {
        const nights = Math.round(
          (input.checkOut.getTime() - input.checkIn.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        availableRooms = hotel.rooms.filter((r) => {
          const available = r.availability?.every(
            (a) => a.status === "AVAILABLE",
          );
          return available !== false;
        });
        availableRooms = availableRooms.map((r) => ({
          ...r,
          totalPrice: Number(r.basePrice) * nights,
          nights,
        })) as typeof availableRooms;
      }

      return {
        ...hotel,
        rooms: availableRooms,
        avgRating: allApprovedReviews._avg.overallRating,
        reviewCount: allApprovedReviews._count,
      };
    }),

  reviews: baseProcedure
    .input(
      z.object({
        hotelId: z.string(),
        cursor: z.object({ id: z.string(), updatedAt: z.date() }).optional(),
        limit: z.number().int().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {
        hotelId: input.hotelId,
        status: "APPROVED",
      };
      if (input.cursor) {
        where.OR = [
          { updatedAt: { lt: input.cursor.updatedAt } },
          { updatedAt: input.cursor.updatedAt, id: { lt: input.cursor.id } },
        ];
      }

      const reviews = await ctx.db.review.findMany({
        where,
        take: input.limit + 1,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        include: { user: { select: { name: true, image: true } } },
      });

      let nextCursor: { id: string; updatedAt: Date } | null = null;
      if (reviews.length > input.limit) {
        reviews.pop();
        const last = reviews[reviews.length - 1];
        nextCursor = { id: last.id, updatedAt: last.updatedAt };
      }

      return { items: reviews, nextCursor };
    }),

  filterOptions: baseProcedure.query(async ({ ctx }) => {
    const [amenities, bedTypes, roomTypes] = await Promise.all([
      ctx.db.amenity.findMany({ select: { id: true, name: true, icon: true } }),
      ctx.db.bedType.findMany({ select: { id: true, name: true } }),
      ctx.db.roomType.findMany({ select: { id: true, name: true } }),
    ]);
    return { amenities, bedTypes, roomTypes };
  }),
});
