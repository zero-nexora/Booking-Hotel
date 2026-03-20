"use client";

import { useRouter } from "next/navigation";
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
import { StatusBadge } from "@/components/common/status-badge";
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
import { formatDatetime, formatCurrencyUSD, formatDateFull } from "@/lib/utils";
import { CountUp } from "@/components/common/count-up";
import { motion, Variants } from "framer-motion";

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--destructive)",
];

const CHART_TOOLTIP_STYLE: React.CSSProperties = {
  fontSize: 12,
  borderRadius: 8,
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  color: "var(--foreground)",
};

const statsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const GrowthBadge = ({ value }: { value: number | null }) => {
  if (value === null) return null;
  const isPositive = value >= 0;
  const Icon = value === 0 ? Minus : isPositive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${isPositive ? "text-primary" : "text-destructive"}`}
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
}

const StatCard = ({ title, value, sub, icon: Icon }: StatCardProps) => (
  <motion.div variants={statCardVariants}>
    <Card className="bg-card border-border shadow-none">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
          </div>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const StatCardSkeleton = () => (
  <Card className="bg-card border-border shadow-none">
    <CardContent className="pt-6 space-y-3">
      <Skeleton className="h-4 w-28 bg-muted" />
      <Skeleton className="h-8 w-24 bg-muted" />
      <Skeleton className="h-3 w-36 bg-muted" />
    </CardContent>
  </Card>
);

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
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={statsContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <StatCard
        title="Doanh thu tháng này"
        value={
          <CountUp
            to={data.revenueMonth}
            prefix="$"
            decimals={2}
            separator=","
            triggerOnView
          />
        }
        sub={<GrowthBadge value={data.revenueGrowth} />}
        icon={TrendingUp}
      />
      <StatCard
        title="Booking tháng này"
        value={
          <CountUp to={data.totalBookingsMonth} separator="," triggerOnView />
        }
        sub={<GrowthBadge value={data.bookingGrowth} />}
        icon={CalendarCheck}
      />
      <StatCard
        title="Booking hôm nay"
        value={<CountUp to={data.bookingsToday} triggerOnView />}
        sub={`${data.pendingBookings} đang chờ xác nhận`}
        icon={Clock}
      />
      <StatCard
        title="Đang check-in"
        value={<CountUp to={data.checkedInToday} triggerOnView />}
        sub="phòng đang có khách"
        icon={DoorOpen}
      />
      <StatCard
        title="Khách sạn"
        value={<CountUp to={data.totalHotels} triggerOnView />}
        sub={`${data.activeHotels} đang hoạt động`}
        icon={Hotel}
      />
      <StatCard
        title="Người dùng"
        value={<CountUp to={data.totalUsers} separator="," triggerOnView />}
        sub={`+${data.newUsersThisMonth} tháng này`}
        icon={Users}
      />
      <StatCard
        title="Đánh giá chờ duyệt"
        value={<CountUp to={data.pendingReviews} triggerOnView />}
        sub={data.pendingReviews > 0 ? "cần xem xét" : "Đã xử lý hết"}
        icon={Star}
      />
      <StatCard
        title="Booking chờ xác nhận"
        value={<CountUp to={data.pendingBookings} triggerOnView />}
        sub={data.pendingBookings > 0 ? "cần xử lý" : "Đã xử lý hết"}
        icon={CalendarCheck}
      />
    </motion.div>
  );
};

const RevenueChartSection = () => {
  const { data, isLoading } = useDashboardRevenueChart();

  return (
    <Card className="bg-card border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          Doanh thu 30 ngày qua
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full bg-muted" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
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
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
                  }}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(v?: number) => [
                    formatCurrencyUSD(v ?? 0),
                    "Doanh thu",
                  ]}
                  labelFormatter={(l) => {
                    const d = new Date(l);
                    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                  }}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--chart-1)", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

const BookingStatusChartSection = () => {
  const { data, isLoading } = useDashboardBookingStatusChart();

  return (
    <Card className="bg-card border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          Booking theo trạng thái (tháng này)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full bg-muted" />
        ) : !data?.length ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
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
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(v) => (
                    <span
                      style={{ fontSize: 11, color: "var(--muted-foreground)" }}
                    >
                      {v}
                    </span>
                  )}
                  iconSize={8}
                  iconType="circle"
                />
                <Tooltip
                  formatter={(v, name) => [v, name]}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

const TopHotelsSection = () => {
  const { data, isLoading } = useDashboardTopHotels();
  const router = useRouter();

  return (
    <Card className="bg-card border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          Top khách sạn (tháng này)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                #
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Khách sạn
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Booking
              </TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">
                Doanh thu
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 bg-muted" />
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
                  className="border-border hover:bg-muted/40 cursor-pointer"
                  onClick={() => router.push(`/admin/hotels/${hotel.hotelId}`)}
                >
                  <TableCell className="text-muted-foreground text-sm w-8">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm text-foreground">
                    {hotel.name}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {hotel.bookings}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {formatCurrencyUSD(hotel.revenue)}
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
    <Card className="bg-card border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          Booking gần đây
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Mã
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Khách
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Khách sạn
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Ngày tạo
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Trạng thái
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Thanh toán
              </TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">
                Tổng tiền
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 bg-muted" />
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
                  className="border-border hover:bg-muted/40 cursor-pointer"
                  onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {booking.bookingRef.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">
                      {booking.guestName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.guestEmail}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {booking.hotel.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDatetime(booking.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} type="booking" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={booking.paymentStatus}
                      type="payment"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-right font-medium text-foreground">
                    {formatCurrencyUSD(Number(booking.totalAmount))}
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

export const DashboardClient = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="text-sm text-muted-foreground">
        {formatDateFull(new Date())}
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
