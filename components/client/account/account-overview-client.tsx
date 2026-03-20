"use client";

import Link from "next/link";
import {
  BookOpen,
  Star,
  DollarSign,
  CalendarDays,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/client/use-user";
import { useQuickStats, useRecentBookings } from "@/hooks/client/use-booking";
import { formatDateShort, formatCurrencyUSD } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { motion, Variants } from "framer-motion";

const statsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const recentContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const recentItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const AccountOverviewClient = () => {
  const { data: user, isLoading: userLoading } = useMe();
  const { data: stats, isLoading: statsLoading } = useQuickStats();
  const { data: recent, isLoading: recentLoading } = useRecentBookings();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-none">
        {userLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full bg-muted" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 bg-muted" />
              <Skeleton className="h-4 w-48 bg-muted" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {user?.name?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-base text-foreground">
                  {user?.name}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {user?.createdAt && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Thành viên từ {formatDateShort(user.createdAt)}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-border text-foreground hover:bg-muted hover:text-foreground"
              asChild
            >
              <Link href="/account/profile">Chỉnh sửa hồ sơ</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl bg-muted" />
          ))
        ) : (
          <motion.div
            className="contents"
            variants={statsContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard
              icon={<BookOpen className="w-4 h-4 text-primary" />}
              label="Đặt phòng"
              value={stats?.bookingCount ?? 0}
            />
            <StatCard
              icon={<Star className="w-4 h-4 text-primary" />}
              label="Đánh giá"
              value={stats?.reviewCount ?? 0}
            />
            <StatCard
              icon={<DollarSign className="w-4 h-4 text-primary" />}
              label="Đã chi"
              value={formatCurrencyUSD(Number(stats?.totalSpent ?? 0))}
            />
          </motion.div>
        )}
      </div>

      <Card className="rounded-2xl border border-border bg-card shadow-none overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">
            Đặt phòng gần đây
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary text-xs h-7 hover:text-primary hover:bg-primary/10"
            asChild
          >
            <Link href="/account/bookings">
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>

        {recentLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40 bg-muted" />
                  <Skeleton className="h-3 w-28 bg-muted" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : !recent?.length ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Bạn chưa có đặt phòng nào.
            </p>
            <Button
              size="sm"
              className="mt-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link href="/hotels">Tìm khách sạn</Link>
            </Button>
          </div>
        ) : (
          <motion.div
            className="divide-y divide-border"
            variants={recentContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {recent.map((booking) => {
              const item = booking.items[0];
              return (
                <motion.div key={booking.id} variants={recentItemVariants}>
                  <Link
                    href={`/account/bookings/${booking.bookingRef}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">
                        {booking.hotel.name}
                      </p>
                      {item && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <CalendarDays className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDateShort(booking.checkIn)} →{" "}
                            {formatDateShort(booking.checkOut)}
                          </span>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={booking.status} type="booking" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </Card>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <motion.div variants={statCardVariants}>
    <Card className="rounded-2xl border border-border bg-card shadow-none p-4 flex flex-col gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold leading-none text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </Card>
  </motion.div>
);
