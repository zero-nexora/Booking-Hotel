import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
// import { getOrSet, CACHE_KEYS, TTL } from "@/lib/redis";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import {
  popNextCursor,
  buildCursorWhere,
  cursorInput,
  assertFound,
} from "@/trpc/helpers";
import { Prisma } from "@/prisma/generated/prisma/browser";
import { calcNights } from "@/lib/utils";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

const hotelSearchInput = z.object({
  search: z.string().optional(),
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
  view: z.enum(["list", "grid", "map"]).optional(),
  cursor: cursorInput,
  limit: z.number().int().min(1).max(50).default(DEFAULT_PAGE_SIZE),
});

const hotelPublicInclude = {
  images: { where: { isPrimary: true }, take: 1 },
  address: { include: { city: { include: { country: true } } } },
  amenities: { include: { amenity: true }, take: 5 },
  reviews: {
    where: { status: "APPROVED" as const },
    select: { overallRating: true },
  },
} as const;

const computeAvgRating = (
  reviews: { overallRating: number }[],
): number | null =>
  reviews.length > 0
    ? reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length
    : null;

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
      avgRating: computeAvgRating(h.reviews),
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

  highlightedReviews: baseProcedure.query(({ ctx }) =>
    ctx.db.review.findMany({
      where: { status: "APPROVED", overallRating: { gte: 4 } },
      take: 6,
      orderBy: { overallRating: "desc" },
      include: {
        user: { select: { name: true, image: true } },
        hotel: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    }),
  ),

  search: baseProcedure
    .input(hotelSearchInput)
    .query(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.search, "hotel-search");

      const {
        search,
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
        adults,
        children,
        view,
      } = input;

      const roomWhere: Prisma.RoomWhereInput = {
        isActive: true,
        capacity: { gte: adults + children },
      };

      if (minPrice !== undefined || maxPrice !== undefined) {
        roomWhere.basePrice = {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        };
      }
      if (bedTypes?.length)
        roomWhere.beds = { some: { bedType: { name: { in: bedTypes } } } };
      if (roomTypes?.length) roomWhere.roomType = { name: { in: roomTypes } };
      if (checkIn && checkOut) {
        const dates: Date[] = [];
        const cur = new Date(checkIn);
        while (cur < checkOut) {
          dates.push(new Date(cur));
          cur.setDate(cur.getDate() + 1);
        }
        roomWhere.availability = {
          none: {
            date: { in: dates },
            status: { not: "AVAILABLE" },
          },
        };
      }

      const isPriceSort = sort === "price_asc" || sort === "price_desc";
      const isRatingSort = sort === "rating";

      const hotelWhere: Prisma.HotelWhereInput = {
        status: "ACTIVE",
        rooms: { some: roomWhere },
      };

      if (stars?.length) hotelWhere.starRating = { in: stars };
      if (amenities?.length)
        hotelWhere.amenities = {
          some: { amenity: { name: { in: amenities } } },
        };

      const andConditions: Prisma.HotelWhereInput[] = [];

      if (search) {
        andConditions.push({
          OR: [
            {
              address: {
                city: { name: { contains: search, mode: "insensitive" } },
              },
            },
            {
              address: {
                city: {
                  country: { name: { contains: search, mode: "insensitive" } },
                },
              },
            },
          ],
        });
      }

      if (!isPriceSort && !isRatingSort && cursor) {
        andConditions.push(buildCursorWhere(cursor)!);
      }

      if (andConditions.length) {
        hotelWhere.AND = andConditions;
      }

      const orderBy: Prisma.HotelOrderByWithRelationInput[] =
        sort === "stars"
          ? [{ starRating: "desc" }, { updatedAt: "desc" }]
          : [{ updatedAt: "desc" }];

      const rows = await ctx.db.hotel.findMany({
        where: hotelWhere,
        take:
          isPriceSort || isRatingSort || view === "map" ? undefined : limit + 1,
        orderBy,
        include: {
          ...hotelPublicInclude,
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
        avgRating: computeAvgRating(h.reviews),
        reviewCount: h.reviews.length,
        minPrice: h.rooms[0]?.basePrice ?? null,
      }));

      if (minRating !== undefined)
        results = results.filter((h) => (h.avgRating ?? 0) >= minRating);

      if (isPriceSort) {
        results.sort((a, b) => {
          const pa = Number(a.minPrice ?? Infinity);
          const pb = Number(b.minPrice ?? Infinity);
          return sort === "price_asc" ? pa - pb : pb - pa;
        });

        if (cursor) {
          const cursorIndex = results.findIndex((r) => r.id === cursor.id);
          if (cursorIndex !== -1) results = results.slice(cursorIndex + 1);
        }
      }

      if (isRatingSort) {
        results.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));

        if (cursor) {
          const cursorIndex = results.findIndex((r) => r.id === cursor.id);
          if (cursorIndex !== -1) results = results.slice(cursorIndex + 1);
        }
      }

      const { items, nextCursor } = popNextCursor(results, limit);
      return { items, nextCursor };
    }),

  detail: baseProcedure
    .input(
      z.object({
        slug: z.string(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
        adults: z.number().int().min(1).default(1),
        children: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const hotel = await ctx.db.hotel.findUnique({
        where: { slug: input.slug, status: "ACTIVE" },
        include: {
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
          },
          address: {
            include: { city: { include: { country: true } } },
          },
          policy: true,
          amenities: { include: { amenity: true } },
          rooms: {
            where: {
              isActive: true,
              capacity: { gte: input.adults + input.children },
              availability: {
                none: {
                  date: { gte: input.checkIn, lte: input.checkOut },
                  status: { not: "AVAILABLE" },
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
          _count: {
            select: { reviews: { where: { status: "APPROVED" } } },
          },
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
        availableRooms = hotel.rooms.filter(
          (r) =>
            r.availability?.every((a) => a.status === "AVAILABLE") !== false,
        );
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
        cursor: cursorInput,
        limit: z.number().int().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cursorWhere = buildCursorWhere(input.cursor);
      const reviews = await ctx.db.review.findMany({
        where: {
          hotelId: input.hotelId,
          status: "APPROVED",
          ...cursorWhere,
        },
        take: input.limit + 1,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        include: { user: { select: { name: true, image: true } } },
      });
      return popNextCursor(reviews, input.limit);
    }),

  filterOptions: baseProcedure.query(async ({ ctx }) => {
    const [amenities, bedTypes, roomTypes] = await Promise.all([
      ctx.db.amenity.findMany({
        select: { id: true, name: true, icon: true },
      }),
      ctx.db.bedType.findMany({ select: { id: true, name: true } }),
      ctx.db.roomType.findMany({ select: { id: true, name: true } }),
    ]);
    return { amenities, bedTypes, roomTypes };
  }),

  roomDetail: baseProcedure
    .input(
      z.object({
        hotelSlug: z.string(),
        roomSlug: z.string(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
        adults: z.number().int().min(1).default(1),
        children: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { hotelSlug, roomSlug, adults, children, checkIn, checkOut } =
        input;

      await checkRateLimit(rateLimiters.search, "room-detail");

      const room = await ctx.db.room.findFirst({
        where: {
          slug: roomSlug,
          isActive: true,
          hotel: { slug: hotelSlug, status: "ACTIVE" },
        },
        include: {
          roomType: true,
          beds: { include: { bedType: true } },
          amenities: { include: { amenity: true } },
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
          },
          hotel: {
            include: {
              policy: true,
              address: {
                include: { city: { include: { country: true } } },
              },
            },
          },
        },
      });

      assertFound(room);

      const guestCount = adults + children;
      if (room!.capacity < guestCount)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Phòng chỉ chứa tối đa ${room!.capacity} khách`,
        });

      const hasDateRange = !!(checkIn && checkOut);

      let isAvailable = true;
      let nights: number | undefined;
      let totalPrice: number | undefined;

      if (hasDateRange) {
        const conflict = await ctx.db.roomAvailability.findFirst({
          where: {
            roomId: room!.id,
            date: { gte: checkIn, lt: checkOut },
            status: { not: "AVAILABLE" },
          },
          select: { id: true },
        });

        isAvailable = !conflict;
        nights = calcNights(checkIn!, checkOut!);
        totalPrice = Number(room!.basePrice) * nights;
      }

      return { ...room!, isAvailable, nights, totalPrice };
    }),

  bookingContext: baseProcedure
    .input(
      z.object({
        hotelSlug: z.string(),
        roomSlug: z.string(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
        adults: z.number().int().min(1).default(1),
        children: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { hotelSlug, roomSlug, checkIn, checkOut, adults, children } =
        input;

      const hotel = await ctx.db.hotel.findUnique({
        where: { slug: hotelSlug, status: "ACTIVE" },
        include: {
          images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
          address: { include: { city: { include: { country: true } } } },
          policy: true,
          amenities: { include: { amenity: true } },
          rooms: {
            where: {
              slug: roomSlug,
              isActive: true,
              capacity: { gte: adults + children },
            },
            include: {
              roomType: true,
              images: { where: { isPrimary: true }, take: 1 },
              beds: { include: { bedType: true } },
              amenities: { include: { amenity: true } },
              availability:
                checkIn && checkOut
                  ? { where: { date: { gte: checkIn, lt: checkOut } } }
                  : undefined,
            },
          },
          _count: {
            select: { reviews: { where: { status: "APPROVED" } } },
          },
        },
      });

      if (!hotel)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Khách sạn không tồn tại",
        });

      const room = hotel.rooms[0];
      if (!room)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Phòng không tồn tại",
        });

      const allApprovedReviews = await ctx.db.review.aggregate({
        where: { hotelId: hotel.id, status: "APPROVED" },
        _avg: { overallRating: true },
        _count: true,
      });

      const nights =
        checkIn && checkOut
          ? Math.round(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
            )
          : null;

      const roomWithPrice = nights
        ? { ...room, totalPrice: Number(room.basePrice) * nights, nights }
        : room;

      return {
        ...hotel,
        rooms: [roomWithPrice],
        avgRating: allApprovedReviews._avg.overallRating,
        reviewCount: allApprovedReviews._count,
      };
    }),
});
