"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDashboardStats,
  useDashboardRevenueChart,
  useDashboardBookingStatusChart,
  useDashboardTopHotels,
  useDashboardRecentBookings,
} from "@/hooks/admin/use-admin-dashboard";
import {
  Hotel,
  Users,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Star,
  DoorOpen,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const BOOKING_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CHECKED_IN: "default",
  CHECKED_OUT: "outline",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

const BOOKING_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  CHECKED_OUT: "Đã check-out",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến",
};

const PAYMENT_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  UNPAID: "secondary",
  PENDING: "secondary",
  PAID: "default",
  REFUNDED: "outline",
  FAILED: "destructive",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa TT",
  PENDING: "Đang xử lý",
  PAID: "Đã TT",
  REFUNDED: "Hoàn tiền",
  FAILED: "Thất bại",
};

const PIE_COLORS = [
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#6b7280",
  "#ef4444",
  "#8b5cf6",
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Sub-components ───────────────────────────────────────────────────────────

interface GrowthBadgeProps {
  value: number | null;
}

const GrowthBadge = ({ value }: GrowthBadgeProps) => {
  if (value === null) return null;
  const positive = value >= 0;
  const Icon = value === 0 ? Minus : positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        positive ? "text-emerald-600" : "text-destructive"
      }`}
    >
      <Icon className="w-3 h-3" />
      {Math.abs(value).toFixed(1)}% so với tháng trước
    </span>
  );
};

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: React.ElementType;
  iconClass?: string;
}

const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  iconClass = "text-muted-foreground",
}: StatCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        </div>
        <div className={`p-2 rounded-lg bg-muted ${iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatCardSkeleton = () => (
  <Card>
    <CardContent className="pt-6 space-y-3">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-36" />
    </CardContent>
  </Card>
);

// ─── Sections ─────────────────────────────────────────────────────────────────

const StatsSection = () => {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Doanh thu tháng này"
        value={fmt(data.revenueMonth)}
        sub={<GrowthBadge value={data.revenueGrowth} />}
        icon={TrendingUp}
        iconClass="text-emerald-600"
      />
      <StatCard
        title="Booking tháng này"
        value={data.totalBookingsMonth.toLocaleString()}
        sub={<GrowthBadge value={data.bookingGrowth} />}
        icon={CalendarCheck}
        iconClass="text-blue-600"
      />
      <StatCard
        title="Booking hôm nay"
        value={data.bookingsToday}
        sub={`${data.pendingBookings} đang chờ xác nhận`}
        icon={Clock}
        iconClass="text-amber-600"
      />
      <StatCard
        title="Đang check-in"
        value={data.checkedInToday}
        sub="phòng đang có khách"
        icon={DoorOpen}
        iconClass="text-violet-600"
      />
      <StatCard
        title="Khách sạn"
        value={data.totalHotels}
        sub={`${data.activeHotels} đang hoạt động`}
        icon={Hotel}
        iconClass="text-indigo-600"
      />
      <StatCard
        title="Người dùng"
        value={data.totalUsers.toLocaleString()}
        sub={`+${data.newUsersThisMonth} tháng này`}
        icon={Users}
        iconClass="text-rose-600"
      />
      <StatCard
        title="Đánh giá chờ duyệt"
        value={data.pendingReviews}
        sub={data.pendingReviews > 0 ? "cần xem xét" : "Đã xử lý hết"}
        icon={Star}
        iconClass="text-amber-500"
      />
      <StatCard
        title="Booking chờ xác nhận"
        value={data.pendingBookings}
        sub={data.pendingBookings > 0 ? "cần xử lý" : "Đã xử lý hết"}
        icon={CalendarCheck}
        iconClass="text-orange-500"
      />
    </div>
  );
};

const RevenueChartSection = () => {
  const { data, isLoading } = useDashboardRevenueChart();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Doanh thu 30 ngày qua</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) =>
                  format(new Date(v), "dd/MM", { locale: vi })
                }
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                formatter={(v?: number) => [fmt(v ?? 0), "Doanh thu"]}
                labelFormatter={(l) =>
                  format(new Date(l), "dd/MM/yyyy", { locale: vi })
                }
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

const BookingStatusChartSection = () => {
  const { data, isLoading } = useDashboardBookingStatusChart();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Booking theo trạng thái (tháng này)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : !data?.length ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={(v) => <span className="text-xs">{v}</span>}
                iconSize={10}
              />
              <Tooltip
                formatter={(v, name) => [v, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

const TopHotelsSection = () => {
  const { data, isLoading } = useDashboardTopHotels();
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top khách sạn (tháng này)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Khách sạn</TableHead>
              <TableHead className="text-center">Booking</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data?.length ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8 text-sm"
                >
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((hotel, i) => (
                <TableRow
                  key={hotel.hotelId}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/hotels/${hotel.hotelId}`)}
                >
                  <TableCell className="text-muted-foreground text-sm w-8">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {hotel.name}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {hotel.bookings}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {fmt(hotel.revenue)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const RecentBookingsSection = () => {
  const { data, isLoading } = useDashboardRecentBookings();
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Booking gần đây</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Khách</TableHead>
              <TableHead>Khách sạn</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data?.length ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8 text-sm"
                >
                  Chưa có booking nào
                </TableCell>
              </TableRow>
            ) : (
              data.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                >
                  <TableCell className="font-mono text-xs">
                    {booking.bookingRef.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{booking.guestName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.guestEmail}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {booking.hotel.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(booking.createdAt), "dd/MM HH:mm", {
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={BOOKING_STATUS_VARIANT[booking.status]}>
                      {BOOKING_STATUS_LABEL[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={PAYMENT_STATUS_VARIANT[booking.paymentStatus]}
                    >
                      {PAYMENT_STATUS_LABEL[booking.paymentStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-right font-medium">
                    {fmt(Number(booking.totalAmount))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const DashboardClient = () => {
  const now = new Date();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {format(now, "EEEE, dd MMMM yyyy", { locale: vi })}
        </p>
      </div>

      <StatsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChartSection />
        </div>
        <BookingStatusChartSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopHotelsSection />
        <div className="lg:col-span-2">
          <RecentBookingsSection />
        </div>
      </div>
    </div>
  );
};
