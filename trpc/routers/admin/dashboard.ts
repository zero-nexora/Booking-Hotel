import { createTRPCRouter } from "@/trpc/init";
import { adminProcedure } from "@/trpc/init";
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

export const adminDashboardRouter = createTRPCRouter({
  stats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const prevMonthStart = startOfMonth(subDays(monthStart, 1));
    const prevMonthEnd = endOfMonth(subDays(monthStart, 1));

    const [
      totalBookingsMonth,
      totalBookingsPrevMonth,
      revenueMonth,
      revenuePrevMonth,
      bookingsToday,
      pendingBookings,
      pendingReviews,
      totalHotels,
      activeHotels,
      totalUsers,
      newUsersThisMonth,
      checkedInToday,
    ] = await Promise.all([
      ctx.db.booking.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
      ctx.db.booking.count({
        where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd } },
      }),
      ctx.db.booking.aggregate({
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        _sum: { totalAmount: true },
      }),
      ctx.db.booking.aggregate({
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { totalAmount: true },
      }),
      ctx.db.booking.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      ctx.db.booking.count({ where: { status: "PENDING" } }),
      ctx.db.review.count({ where: { status: "PENDING" } }),
      ctx.db.hotel.count(),
      ctx.db.hotel.count({ where: { status: "ACTIVE" } }),
      ctx.db.user.count(),
      ctx.db.user.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
      ctx.db.bookingItem.count({
        where: { status: "CHECKED_IN" },
      }),
    ]);

    const revenueMonthValue = Number(revenueMonth._sum.totalAmount ?? 0);
    const revenuePrevMonthValue = Number(revenuePrevMonth._sum.totalAmount ?? 0);
    const revenueGrowth =
      revenuePrevMonthValue > 0
        ? ((revenueMonthValue - revenuePrevMonthValue) / revenuePrevMonthValue) * 100
        : null;

    const bookingGrowth =
      totalBookingsPrevMonth > 0
        ? ((totalBookingsMonth - totalBookingsPrevMonth) / totalBookingsPrevMonth) * 100
        : null;

    return {
      bookingsToday,
      totalBookingsMonth,
      bookingGrowth,
      revenueMonth: revenueMonthValue,
      revenueGrowth,
      pendingBookings,
      pendingReviews,
      totalHotels,
      activeHotels,
      totalUsers,
      newUsersThisMonth,
      checkedInToday,
    };
  }),

  revenueChart: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    // Last 30 days — one entry per day
    const days = Array.from({ length: 30 }, (_, i) => subDays(now, 29 - i));

    const bookings = await ctx.db.booking.findMany({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: startOfDay(days[0]) },
      },
      select: { createdAt: true, totalAmount: true },
    });

    return days.map((day) => {
      const dayStr = day.toISOString().slice(0, 10);
      const revenue = bookings
        .filter((b) => b.createdAt.toISOString().slice(0, 10) === dayStr)
        .reduce((sum, b) => sum + Number(b.totalAmount), 0);
      return { date: dayStr, revenue };
    });
  }),

  bookingStatusChart: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    const results = await ctx.db.booking.groupBy({
      by: ["status"],
      where: { createdAt: { gte: monthStart } },
      _count: { status: true },
    });

    const STATUS_LABEL: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      CHECKED_IN: "Đã check-in",
      CHECKED_OUT: "Đã check-out",
      CANCELLED: "Đã hủy",
      NO_SHOW: "Không đến",
    };

    return results.map((r) => ({
      status: r.status,
      label: STATUS_LABEL[r.status] ?? r.status,
      count: r._count.status,
    }));
  }),

  topHotels: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    const results = await ctx.db.booking.groupBy({
      by: ["hotelId"],
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: monthStart },
      },
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: "desc" } },
      take: 5,
    });

    const hotelIds = results.map((r) => r.hotelId);
    const hotels = await ctx.db.hotel.findMany({
      where: { id: { in: hotelIds } },
      select: { id: true, name: true, slug: true },
    });

    const hotelMap = Object.fromEntries(hotels.map((h) => [h.id, h]));

    return results.map((r) => ({
      hotelId: r.hotelId,
      name: hotelMap[r.hotelId]?.name ?? "—",
      revenue: Number(r._sum.totalAmount ?? 0),
      bookings: r._count.id,
    }));
  }),

  recentBookings: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.booking.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        bookingRef: true,
        guestName: true,
        guestEmail: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        createdAt: true,
        hotel: { select: { name: true } },
      },
    });
  }),
});