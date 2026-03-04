import { z } from "zod";
import { searchRateLimit } from "@/lib/rate-limit";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { getOrSet, TTL } from "@/lib/redis";

const cursor = z
  .object({ id: z.string(), updatedAt: z.coerce.date() })
  .nullish();

export const clientHotelRouter = createTRPCRouter({
  /* ── Khách sạn nổi bật trang chủ ── */
  featured: baseProcedure.query(({ ctx }) =>
    getOrSet(
      "hotels:featured",
      () =>
        ctx.db.hotel.findMany({
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            name: true,
            slug: true,
            starRating: true,
            address: {
              select: {
                city: {
                  select: { name: true, country: { select: { name: true } } },
                },
              },
            },
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true, alt: true },
            },
            rooms: {
              where: { isActive: true },
              orderBy: { basePrice: "asc" },
              take: 1,
              select: { basePrice: true },
            },
            _count: { select: { reviews: { where: { status: "APPROVED" } } } },
          },
        }),
      TTL.MEDIUM,
    ),
  ),

  /* ── Danh sách infinite scroll ── */
  list: baseProcedure
    .input(
      z.object({
        cursor,
        limit: z.number().min(1).max(50).default(12),
        cityId: z.string().optional(),
        countryId: z.string().optional(),
        cityName: z.string().optional(),
        checkIn: z.coerce.date().optional(),
        checkOut: z.coerce.date().optional(),
        guests: z.number().min(1).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        amenityIds: z.array(z.string()).optional(),
        starRating: z.number().min(1).max(5).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await searchRateLimit.limit(ip);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const {
        cursor: cur,
        limit,
        cityId,
        countryId,
        cityName,
        checkIn,
        checkOut,
        guests,
        minPrice,
        maxPrice,
        amenityIds,
        starRating,
      } = input;

      // Tìm phòng không khả dụng
      let unavailableRoomIds: string[] = [];
      if (checkIn && checkOut) {
        const locked = await ctx.db.roomAvailability.findMany({
          where: {
            date: { gte: checkIn, lt: checkOut },
            status: { in: ["LOCKED", "BOOKED", "MAINTENANCE"] },
            OR: [
              { lockExpiresAt: null },
              { lockExpiresAt: { gt: new Date() } },
            ],
          },
          select: { roomId: true },
          distinct: ["roomId"],
        });
        unavailableRoomIds = locked.map((r) => r.roomId);
      }

      let availableHotelIds: string[] | undefined;
      if (checkIn && checkOut) {
        const rooms = await ctx.db.room.findMany({
          where: {
            isActive: true,
            id: { notIn: unavailableRoomIds },
            ...(guests ? { capacity: { gte: guests } } : {}),
          },
          select: { hotelId: true },
          distinct: ["hotelId"],
        });
        availableHotelIds = rooms.map((r) => r.hotelId);
      }

      const where = {
        status: "ACTIVE" as const,
        ...(starRating ? { starRating } : {}),
        ...(availableHotelIds ? { id: { in: availableHotelIds } } : {}),
        ...(amenityIds?.length
          ? { amenities: { some: { amenityId: { in: amenityIds } } } }
          : {}),
        ...(minPrice || maxPrice
          ? {
              rooms: {
                some: {
                  isActive: true,
                  basePrice: {
                    ...(minPrice ? { gte: minPrice } : {}),
                    ...(maxPrice ? { lte: maxPrice } : {}),
                  },
                },
              },
            }
          : {}),
        ...(cityId || countryId || cityName
          ? {
              address: {
                city: {
                  ...(cityId ? { id: cityId } : {}),
                  ...(cityName
                    ? {
                        name: {
                          contains: cityName,
                          mode: "insensitive" as const,
                        },
                      }
                    : {}),
                  ...(countryId ? { countryId } : {}),
                },
              },
            }
          : {}),
        ...(cur
          ? {
              OR: [
                { updatedAt: { lt: cur.updatedAt } },
                { AND: [{ updatedAt: cur.updatedAt }, { id: { lt: cur.id } }] },
              ],
            }
          : {}),
      };

      const items = await ctx.db.hotel.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        take: limit + 1,
        select: {
          id: true,
          name: true,
          slug: true,
          starRating: true,
          updatedAt: true,
          address: {
            select: {
              street: true,
              city: {
                select: { name: true, country: { select: { name: true } } },
              },
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true, alt: true },
          },
          amenities: {
            take: 5,
            select: {
              amenity: { select: { id: true, name: true, icon: true } },
            },
          },
          rooms: {
            where: { isActive: true },
            orderBy: { basePrice: "asc" },
            take: 1,
            select: { basePrice: true },
          },
          _count: { select: { reviews: { where: { status: "APPROVED" } } } },
        },
      });

      let nextCursor: typeof cur = null;
      if (items.length > limit) {
        const last = items.pop()!;
        nextCursor = { id: last.id, updatedAt: last.updatedAt };
      }
      return { items, nextCursor };
    }),

  /* ── Chi tiết theo slug ── */
  detail: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) =>
      getOrSet(
        `hotel:${input.slug}`,
        async () => {
          const hotel = await ctx.db.hotel.findUnique({
            where: { slug: input.slug, status: "ACTIVE" },
            include: {
              address: { include: { city: { include: { country: true } } } },
              policy: true,
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
              },
              amenities: { include: { amenity: true } },
              rooms: {
                where: { isActive: true },
                include: {
                  images: {
                    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                  },
                  roomType: {
                    select: {
                      name: true,
                    },
                  },
                  beds: {
                    include: {
                      bedType: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                  amenities: { include: { amenity: true } },
                },
              },
              _count: {
                select: { reviews: { where: { status: "APPROVED" } } },
              },
            },
          });
          
          if (!hotel) throw new TRPCError({ code: "NOT_FOUND" });
          return hotel;
        },
        TTL.LONG,
      ),
    ),

  /* ── Đánh giá infinite ── */
  reviews: baseProcedure
    .input(
      z.object({
        hotelId: z.string(),
        cursor,
        limit: z.number().min(1).max(20).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { hotelId, cursor: cur, limit } = input;
      const items = await ctx.db.review.findMany({
        where: {
          hotelId,
          status: "APPROVED",
          ...(cur
            ? {
                OR: [
                  { updatedAt: { lt: cur.updatedAt } },
                  {
                    AND: [{ updatedAt: cur.updatedAt }, { id: { lt: cur.id } }],
                  },
                ],
              }
            : {}),
        },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        take: limit + 1,
        select: {
          id: true,
          overallRating: true,
          title: true,
          comment: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { name: true, image: true } },
        },
      });

      let nextCursor: typeof cur = null;
      if (items.length > limit) {
        const last = items.pop()!;
        nextCursor = { id: last.id, updatedAt: last.updatedAt };
      }
      return { items, nextCursor };
    }),

  /* ── Danh sách địa điểm cho search ── */
  locations: baseProcedure.query(({ ctx }) =>
    getOrSet(
      "locations:all",
      () =>
        ctx.db.country.findMany({
          include: { cities: { orderBy: { name: "asc" } } },
          orderBy: { name: "asc" },
        }),
      TTL.DAY,
    ),
  ),
});
