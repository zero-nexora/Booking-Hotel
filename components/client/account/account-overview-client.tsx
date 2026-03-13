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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/client/use-user";
import { useQuickStats, useRecentBookings } from "@/hooks/client/use-booking";
import { formatDateShort } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const BOOKING_STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "Chờ xác nhận", variant: "secondary" },
  CONFIRMED: { label: "Đã xác nhận", variant: "default" },
  CHECKED_IN: { label: "Đã check-in", variant: "default" },
  CHECKED_OUT: { label: "Hoàn thành", variant: "outline" },
  CANCELLED: { label: "Đã huỷ", variant: "destructive" },
  NO_SHOW: { label: "Không đến", variant: "destructive" },
};

export const AccountOverviewClient = () => {
  const { data: user, isLoading: userLoading } = useMe();
  const { data: stats, isLoading: statsLoading } = useQuickStats();
  const { data: recent, isLoading: recentLoading } = useRecentBookings();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5">
        {userLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
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
                <p className="font-semibold text-base">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {user?.createdAt && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Thành viên từ {formatDateShort(user.createdAt)}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href="/account/profile">Chỉnh sửa hồ sơ</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={<BookOpen className="w-4 h-4 text-primary" />}
              label="Đặt phòng"
              value={stats?.bookingCount ?? 0}
            />
            <StatCard
              icon={<Star className="w-4 h-4 text-amber-500" />}
              label="Đánh giá"
              value={stats?.reviewCount ?? 0}
            />
            <StatCard
              icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
              label="Đã chi"
              value={`$${Number(stats?.totalSpent ?? 0).toLocaleString()}`}
            />
          </>
        )}
      </div>

      <Card className="rounded-2xl border bg-card">
        <div className="flex items-center justify-between px-5 pb-4 border-b">
          <h2 className="font-semibold text-sm">Đặt phòng gần đây</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary text-xs h-7"
            asChild
          >
            <Link href="/account/bookings">
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>

        {recentLoading ? (
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : !recent?.length ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Bạn chưa có đặt phòng nào.
            </p>
            <Button size="sm" className="mt-3 rounded-xl" asChild>
              <Link href="/hotels">Tìm khách sạn</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {recent.map((booking) => {
              const status =
                BOOKING_STATUS_MAP[booking.status] ??
                BOOKING_STATUS_MAP.PENDING;
              const item = booking.items[0];
              return (
                <Link
                  key={booking.id}
                  href={`/account/bookings/${booking.bookingRef}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
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
                  <Badge variant={status.variant} className="text-xs shrink-0">
                    {status.label}
                  </Badge>
                </Link>
              );
            })}
          </div>
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
}) => {
  return (
    <Card className="rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </Card>
  );
};
