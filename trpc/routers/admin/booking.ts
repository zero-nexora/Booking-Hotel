import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["CHECKED_OUT"],
};

const bookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
]);

const paymentStatusEnum = z.enum([
  "UNPAID",
  "PENDING",
  "PAID",
  "REFUNDED",
  "FAILED",
]);

export const adminBookingRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        status: bookingStatusEnum.optional(),
        paymentStatus: paymentStatusEnum.optional(),
        hotelId: z.string().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status, paymentStatus, hotelId, from, to } =
        input;
      const skip = (page - 1) * limit;

      const where = {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(hotelId && { hotelId }),
        ...((from || to) && {
          checkIn: {
            ...(from && { gte: from }),
            ...(to && { lte: to }),
          },
        }),
        ...(search && {
          OR: [
            { bookingRef: { contains: search, mode: "insensitive" as const } },
            { guestName: { contains: search, mode: "insensitive" as const } },
            { guestEmail: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.booking.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            bookingRef: true,
            status: true,
            paymentStatus: true,
            guestName: true,
            guestEmail: true,
            guestPhone: true,
            checkIn: true,
            checkOut: true,
            totalAmount: true,
            currency: true,
            createdAt: true,
            hotel: { select: { name: true, slug: true } },
            items: {
              select: {
                nights: true,
                room: {
                  select: { name: true, roomType: { select: { name: true } } },
                },
              },
            },
          },
        }),
        ctx.db.booking.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  events: adminProcedure
    .input(
      z.object({
        status: bookingStatusEnum.optional(),
        paymentStatus: paymentStatusEnum.optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { status, paymentStatus, from, to } = input;

      return ctx.db.booking.findMany({
        where: {
          ...(status && { status }),
          ...(paymentStatus && { paymentStatus }),
          ...((from || to) && {
            checkIn: {
              ...(from && { gte: from }),
              ...(to && { lte: to }),
            },
          }),
        },
        orderBy: { checkIn: "asc" },
        select: {
          id: true,
          guestName: true,
          status: true,
          checkIn: true,
          checkOut: true,
          hotel: { select: { name: true } },
        },
      });
    }),

  detail: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          hotel: {
            select: {
              name: true,
              slug: true,
              address: { include: { city: { include: { country: true } } } },
            },
          },
          items: {
            include: {
              room: {
                select: {
                  name: true,
                  roomType: { select: { name: true } },
                  floor: true,
                },
              },
            },
          },
          payments: true,
          review: true,
        },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      return booking;
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "CONFIRMED",
          "CHECKED_IN",
          "CHECKED_OUT",
          "CANCELLED",
          "NO_SHOW",
        ]),
        cancelReason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });

      const allowed = VALID_TRANSITIONS[booking.status] ?? [];
      if (!allowed.includes(input.status))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Không thể chuyển từ ${booking.status} sang ${input.status}`,
        });

      const isCancelling =
        input.status === "CANCELLED" || input.status === "NO_SHOW";

      const itemStatusMap: Record<string, string> = {
        CONFIRMED: "CONFIRMED",
        CHECKED_IN: "CHECKED_IN",
        CHECKED_OUT: "CHECKED_OUT",
        CANCELLED: "CANCELLED",
        NO_SHOW: "CANCELLED",
      };

      await ctx.db.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: input.id },
          data: {
            status: input.status,
            ...(isCancelling && {
              cancelledAt: new Date(),
              cancelReason: input.cancelReason,
            }),
          },
        });

        await tx.bookingItem.updateMany({
          where: { bookingId: input.id },
          data: { status: itemStatusMap[input.status] as any },
        });

        if (isCancelling) {
          await tx.roomAvailability.updateMany({
            where: { bookingItemId: { in: booking.items.map((i) => i.id) } },
            data: {
              status: "AVAILABLE",
              bookingItemId: null,
              lockToken: null,
              lockExpiresAt: null,
            },
          });
        }
      });

      return { success: true };
    }),
});
