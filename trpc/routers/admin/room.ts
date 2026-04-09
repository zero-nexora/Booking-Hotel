import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { generateUniqueSlug } from "@/lib/slugify";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import {
  assertFound,
  buildPaginatedResult,
  getSkip,
  paginationInput,
} from "@/trpc/helpers";
import { PrismaClient } from "@/prisma/generated/prisma/client";

const bedInput = z.object({
  bedTypeId: z.string(),
  quantity: z.number().int().min(1).max(10),
});

const imageInput = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

const roomListSelect = {
  id: true,
  name: true,
  slug: true,
  capacity: true,
  sizeM2: true,
  floor: true,
  basePrice: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  hotelId: true,
  roomType: { select: { id: true, name: true } },
  images: {
    where: { isPrimary: true },
    take: 1,
    select: { url: true, alt: true },
  },
  beds: {
    select: {
      id: true,
      quantity: true,
      bedType: { select: { id: true, name: true } },
    },
  },
  _count: { select: { bookingItems: true } },
} as const;

const validateBeds = async (
  db: PrismaClient,
  beds: { bedTypeId: string; quantity: number }[],
): Promise<void> => {
  const ids = beds.map((b) => b.bedTypeId);

  if (new Set(ids).size !== ids.length)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Mỗi loại giường chỉ được nhập một lần trong cùng phòng",
    });

  const found = await db.bedType.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });

  if (found.length !== ids.length) {
    const foundIds = new Set(found.map((b) => b.id));
    const missing = ids.filter((id) => !foundIds.has(id));
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Loại giường không tồn tại: ${missing.join(", ")}`,
    });
  }
};

export const adminRoomRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      paginationInput.pick({ page: true, limit: true }).extend({
        limit: z.number().int().min(1).max(100).default(10),
        hotelId: z.string(),
        search: z.string().optional(),
        isActive: z.boolean().optional(),
        roomTypeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { hotelId, search, isActive, roomTypeId } = input;
      const where = {
        hotelId,
        ...(isActive !== undefined && { isActive }),
        ...(roomTypeId && { roomTypeId }),
        ...(search && {
          name: { contains: search, mode: "insensitive" as const },
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.room.findMany({
          where,
          skip: getSkip(input),
          take: input.limit,
          orderBy: { createdAt: "desc" },
          select: roomListSelect,
        }),
        ctx.db.room.count({ where }),
      ]);

      return buildPaginatedResult(items, total, input);
    }),

  detail: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
        include: {
          roomType: true,
          images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
          beds: { include: { bedType: true } },
          amenities: { include: { amenity: true } },
          hotel: { select: { id: true, name: true, slug: true } },
        },
      });
      return assertFound(room);
    }),

  create: adminProcedure
    .input(
      z.object({
        hotelId: z.string(),
        name: z.string().min(2),
        roomTypeId: z.string(),
        description: z.string().min(10),
        capacity: z.number().int().min(1).max(100),
        sizeM2: z.number().positive(),
        floor: z.number().int().optional(),
        basePrice: z.number().min(0),
        isActive: z.boolean().default(true),
        beds: z.array(bedInput).min(1, "Phải có ít nhất 1 loại giường"),
        amenityIds: z.array(z.string()).optional(),
        images: z.array(imageInput).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const { hotelId, name, beds, amenityIds, images, ...data } = input;

      const [hotel, roomType] = await Promise.all([
        ctx.db.hotel.findUnique({
          where: { id: hotelId },
          select: { slug: true },
        }),
        ctx.db.roomType.findUnique({
          where: { id: data.roomTypeId },
          select: { id: true },
        }),
      ]);

      if (!hotel)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Khách sạn không tồn tại",
        });
      if (!roomType)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Loại phòng không tồn tại",
        });

      await validateBeds(ctx.db, beds);

      const slug = await generateUniqueSlug(name, async (s) => {
        const ex = await ctx.db.room.findUnique({
          where: { hotelId_slug: { hotelId, slug: s } },
        });
        return !!ex;
      });

      const room = await ctx.db.room.create({
        data: {
          hotelId,
          name,
          slug,
          ...data,
          beds: { create: beds },
          ...(amenityIds?.length && {
            amenities: {
              create: amenityIds.map((amenityId) => ({ amenityId })),
            },
          }),
          ...(images?.length && { images: { create: images } }),
        },
        include: {
          roomType: { select: { id: true, name: true } },
          beds: { include: { bedType: { select: { id: true, name: true } } } },
        },
      });

      return room;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).optional(),
        roomTypeId: z.string().optional(),
        description: z.string().min(10).optional(),
        capacity: z.number().int().min(1).max(100).optional(),
        sizeM2: z.number().positive().optional(),
        floor: z.number().int().optional(),
        basePrice: z.number().min(0).optional(),
        isActive: z.boolean().optional(),
        beds: z.array(bedInput).min(1).optional(),
        amenityIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const { id, beds, amenityIds, ...data } = input;

      const room = await ctx.db.room.findUnique({
        where: { id },
        include: { hotel: { select: { slug: true } } },
      });
      assertFound(room);

      if (data.roomTypeId) {
        const rt = await ctx.db.roomType.findUnique({
          where: { id: data.roomTypeId },
          select: { id: true },
        });
        if (!rt)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Loại phòng không tồn tại",
          });
      }

      if (beds) await validateBeds(ctx.db, beds);

      await ctx.db.$transaction(async (tx) => {
        if (amenityIds !== undefined) {
          await tx.roomAmenity.deleteMany({ where: { roomId: id } });
          if (amenityIds.length)
            await tx.roomAmenity.createMany({
              data: amenityIds.map((amenityId) => ({ roomId: id, amenityId })),
            });
        }

        if (beds !== undefined) {
          await tx.roomBed.deleteMany({ where: { roomId: id } });
          if (beds.length)
            await tx.roomBed.createMany({
              data: beds.map((b) => ({ ...b, roomId: id })),
            });
        }

        const scalarData = Object.fromEntries(
          Object.entries(data).filter(([, v]) => v !== undefined),
        );
        if (Object.keys(scalarData).length)
          await tx.room.update({ where: { id }, data: scalarData });
      });

      return { success: true };
    }),

  addImages: adminProcedure
    .input(z.object({ roomId: z.string(), images: z.array(imageInput).min(1) }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const room = await ctx.db.room.findUnique({
        where: { id: input.roomId },
        include: { hotel: { select: { slug: true } } },
      });
      assertFound(room);

      if (input.images.some((img) => img.isPrimary))
        await ctx.db.roomImage.updateMany({
          where: { roomId: input.roomId },
          data: { isPrimary: false },
        });

      await ctx.db.roomImage.createMany({
        data: input.images.map((img) => ({ ...img, roomId: input.roomId })),
      });

      return { success: true };
    }),

  deleteImage: adminProcedure
    .input(z.object({ imageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const image = await ctx.db.roomImage.findUnique({
        where: { id: input.imageId },
        include: { room: { include: { hotel: { select: { slug: true } } } } },
      });
      assertFound(image);

      await ctx.db.roomImage.delete({ where: { id: input.imageId } });
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
        include: { hotel: { select: { slug: true } } },
      });
      assertFound(room);

      const activeBookings = await ctx.db.bookingItem.count({
        where: {
          roomId: input.id,
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        },
      });

      if (activeBookings)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Không thể xóa: phòng đang có ${activeBookings} đặt phòng hoạt động`,
        });

      await ctx.db.room.delete({ where: { id: input.id } });
      return { success: true };
    }),

  availability: adminProcedure
    .input(
      z.object({
        roomId: z.string(),
        from: z.coerce.date(),
        to: z.coerce.date(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.roomAvailability.findMany({
        where: {
          roomId: input.roomId,
          date: { gte: input.from, lte: input.to },
        },
        orderBy: { date: "asc" },
      }),
    ),

  setAvailability: adminProcedure
    .input(
      z.object({
        roomId: z.string(),
        dates: z.array(z.coerce.date()).min(1),
        status: z.enum(["AVAILABLE", "MAINTENANCE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkRateLimit(rateLimiters.adminMutation, ctx.user.id);

      const room = await ctx.db.room.findUnique({
        where: { id: input.roomId },
        select: { id: true },
      });
      assertFound(room);

      if (input.status === "AVAILABLE") {
        const booked = await ctx.db.roomAvailability.findMany({
          where: {
            roomId: input.roomId,
            date: { in: input.dates },
            status: "BOOKED",
          },
          select: { date: true },
        });
        if (booked.length)
          throw new TRPCError({
            code: "CONFLICT",
            message: `${booked.length} ngày đã có booking xác nhận, không thể thay đổi`,
          });
      }

      await ctx.db.$transaction(
        input.dates.map((date) =>
          ctx.db.roomAvailability.upsert({
            where: { roomId_date: { roomId: input.roomId, date } },
            create: { roomId: input.roomId, date, status: input.status },
            update: {
              status: input.status,
              lockToken: null,
              lockExpiresAt: null,
            },
          }),
        ),
      );

      return { success: true, updatedDates: input.dates.length };
    }),
});
