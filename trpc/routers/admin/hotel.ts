import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { invalidateCache } from "@/lib/redis";
import { generateUniqueSlug } from "@/lib/slugify";

const addressSchema = z.object({
  cityId: z.string(),
  street: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const policySchema = z.object({
  checkInTime: z.string().default("14:00"),
  checkOutTime: z.string().default("12:00"),
});

const invalidateHotelCache = (...extra: string[]) =>
  invalidateCache("hotels:featured", ...extra);

export const adminHotelRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).optional(),
        starRating: z.number().min(1).max(5).optional(),
        cityId: z.string().optional(),
        countryId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status, starRating, cityId, countryId } =
        input;
      const skip = (page - 1) * limit;

      const where = {
        ...(status && { status }),
        ...(starRating && { starRating }),
        ...(search && {
          name: { contains: search, mode: "insensitive" as const },
        }),
        ...((cityId || countryId) && {
          address: {
            city: {
              ...(cityId && { id: cityId }),
              ...(countryId && { countryId }),
            },
          },
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.hotel.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            starRating: true,
            phone: true,
            email: true,
            createdAt: true,
            address: {
              select: {
                street: true,
                city: {
                  select: {
                    name: true,
                    country: { select: { name: true } },
                  },
                },
              },
            },
            policy: { select: { checkInTime: true, checkOutTime: true } },
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
            _count: { select: { rooms: true, bookings: true, reviews: true } },
          },
        }),
        ctx.db.hotel.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  detail: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const hotel = await ctx.db.hotel.findUnique({
        where: { id: input.id },
        include: {
          address: { include: { city: { include: { country: true } } } },
          policy: true,
          images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
          amenities: { include: { amenity: true } },
          _count: { select: { rooms: true, bookings: true, reviews: true } },
        },
      });
      if (!hotel) throw new TRPCError({ code: "NOT_FOUND" });
      return hotel;
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().min(10),
        starRating: z.number().min(1).max(5).int().default(3),
        status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        address: addressSchema,
        policy: policySchema,
        amenityIds: z.array(z.string()).optional(),
        images: z
          .array(
            z.object({
              url: z.string().url(),
              alt: z.string().optional(),
              isPrimary: z.boolean().default(false),
              sortOrder: z.number().default(0),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, address, policy, amenityIds, images, ...hotelData } = input;

      const slug = await generateUniqueSlug(name, async (s) => {
        const ex = await ctx.db.hotel.findUnique({ where: { slug: s } });
        return !!ex;
      });

      const hotel = await ctx.db.$transaction(async (tx) => {
        const addr = await tx.address.create({ data: address });
        return tx.hotel.create({
          data: {
            ...hotelData,
            name,
            slug,
            addressId: addr.id,
            policy: { create: policy },
            ...(amenityIds?.length && {
              amenities: {
                create: amenityIds.map((amenityId) => ({ amenityId })),
              },
            }),
            ...(images?.length && { images: { create: images } }),
          },
        });
      });

      await invalidateHotelCache();
      return hotel;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).optional(),
        description: z.string().min(10).optional(),
        starRating: z.number().min(1).max(5).int().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        address: addressSchema.partial().optional(),
        policy: policySchema.partial().optional(),
        amenityIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, address, policy, amenityIds, ...hotelData } = input;

      const existing = await ctx.db.hotel.findUnique({
        where: { id },
        select: { slug: true, addressId: true },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.$transaction(async (tx) => {
        if (address)
          await tx.address.update({
            where: { id: existing.addressId },
            data: address,
          });

        if (policy)
          await tx.hotelPolicy.upsert({
            where: { hotelId: id },
            create: { hotelId: id, ...policy },
            update: policy,
          });

        if (amenityIds) {
          await tx.hotelAmenity.deleteMany({ where: { hotelId: id } });
          if (amenityIds.length)
            await tx.hotelAmenity.createMany({
              data: amenityIds.map((amenityId) => ({ hotelId: id, amenityId })),
            });
        }

        if (Object.keys(hotelData).length)
          await tx.hotel.update({ where: { id }, data: hotelData });
      });

      await invalidateHotelCache(`hotel:${existing.slug}`);
      return { success: true };
    }),

  addImages: adminProcedure
    .input(
      z.object({
        hotelId: z.string(),
        images: z.array(
          z.object({
            url: z.string().url(),
            alt: z.string().optional(),
            isPrimary: z.boolean().default(false),
            sortOrder: z.number().default(0),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hotel = await ctx.db.hotel.findUnique({
        where: { id: input.hotelId },
        select: { slug: true },
      });
      if (!hotel) throw new TRPCError({ code: "NOT_FOUND" });

      if (input.images.some((img) => img.isPrimary))
        await ctx.db.hotelImage.updateMany({
          where: { hotelId: input.hotelId },
          data: { isPrimary: false },
        });

      await ctx.db.hotelImage.createMany({
        data: input.images.map((img) => ({ ...img, hotelId: input.hotelId })),
      });

      await invalidateHotelCache(`hotel:${hotel.slug}`);
    }),

  deleteImage: adminProcedure
    .input(z.object({ imageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.db.hotelImage.findUnique({
        where: { id: input.imageId },
        include: { hotel: { select: { slug: true } } },
      });
      if (!image) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.hotelImage.delete({ where: { id: input.imageId } });
      await invalidateHotelCache(`hotel:${image.hotel.slug}`);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const hotel = await ctx.db.hotel.findUnique({
        where: { id: input.id },
        select: { slug: true, addressId: true, id: true },
      });
      if (!hotel) throw new TRPCError({ code: "NOT_FOUND" });

      const activeBookings = await ctx.db.booking.count({
        where: {
          hotelId: input.id,
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        },
      });
      if (activeBookings)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Không thể xóa: khách sạn đang có ${activeBookings} đặt phòng hoạt động`,
        });

      await ctx.db.$transaction(async (tx) => {
        await tx.hotel.delete({ where: { id: input.id } });
        await tx.address.delete({ where: { id: hotel.addressId } });
        await tx.hotelPolicy.delete({ where: { hotelId: hotel.id } });
      });

      await invalidateHotelCache(`hotel:${hotel.slug}`);
      return { success: true };
    }),
});
