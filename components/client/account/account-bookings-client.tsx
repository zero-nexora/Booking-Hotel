"use client";

import Link from "next/link";
import { useQueryStates } from "nuqs";
import {
  CalendarDays,
  Building2,
  BedDouble,
  ChevronRight,
  Loader2,
  BookX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBookings } from "@/hooks/client/use-booking";
import { cn, formatCurrencyUSD, formatDateShort } from "@/lib/utils";
import { accountBookingParsers } from "@/lib/search-params/booking-search";
import { useInfiniteScroll } from "@/hooks/use-infinity-scroll";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

const TABS: { value: BookingStatus | null; label: string }[] = [
  { value: null, label: "Tất cả" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "CHECKED_IN", label: "Đang lưu trú" },
  { value: "CHECKED_OUT", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã huỷ" },
];

const STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "Chờ xác nhận", variant: "secondary" },
  CONFIRMED: { label: "Đã xác nhận", variant: "default" },
  CHECKED_IN: { label: "Đang lưu trú", variant: "default" },
  CHECKED_OUT: { label: "Hoàn thành", variant: "outline" },
  CANCELLED: { label: "Đã huỷ", variant: "destructive" },
  NO_SHOW: { label: "Không đến", variant: "destructive" },
};

const PAYMENT_MAP: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Đang xử lý",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
  FAILED: "Thanh toán lỗi",
};

export const AccountBookingsClient = () => {
  const [params, setParams] = useQueryStates(accountBookingParsers);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMyBookings(params);
  const { sentinelRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const bookings = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold">Đặt phòng của tôi</h1>

      <div className="flex gap-1.5 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setParams({ status: tab.value })}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              params.status === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border bg-card py-14 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <BookX className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">Không có đặt phòng nào</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {params.status
                ? "Thử xem danh mục khác"
                : "Bạn chưa đặt phòng nào"}
            </p>
          </div>
          {!params.status && (
            <Button size="sm" className="rounded-xl mt-1" asChild>
              <Link href="/hotels">Tìm khách sạn</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const status = STATUS_MAP[booking.status] ?? STATUS_MAP.PENDING;
            const item = booking.items[0];
            const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);
            const canReview =
              booking.status === "CHECKED_OUT" && booking._count.payments > 0;

            return (
              <div
                key={booking.id}
                className="rounded-2xl border bg-card hover:shadow-sm transition-shadow"
              >
                <Link
                  href={`/account/bookings/${booking.bookingRef}`}
                  className="flex items-start gap-4 p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm leading-tight truncate">
                        {booking.hotel.name}
                      </p>
                      <Badge
                        variant={status.variant}
                        className="text-xs shrink-0"
                      >
                        {status.label}
                      </Badge>
                    </div>

                    {item && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BedDouble className="w-3 h-3" />
                        <span className="truncate">{item.room.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="w-3 h-3" />
                      <span>
                        {formatDateShort(booking.checkIn)}
                        {" → "}
                        {formatDateShort(booking.checkOut)}
                        {item && ` · ${item.nights} đêm`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">
                          {formatCurrencyUSD(Number(booking.totalAmount))}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {PAYMENT_MAP[booking.paymentStatus]}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        #{booking.bookingRef.slice(-8)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </Link>

                {(canCancel || canReview) && (
                  <div className="flex gap-2 px-4 pb-3 pt-0">
                    {canReview && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs h-7 gap-1 hover:text-primary"
                        asChild
                      >
                        <Link
                          href={`/account/bookings/${booking.bookingRef}/review`}
                        >
                          Viết đánh giá
                        </Link>
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-lg text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        asChild
                      >
                        <Link
                          href={`/account/bookings/${booking.bookingRef}#cancel`}
                        >
                          Huỷ đặt phòng
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div ref={sentinelRef} className="h-2" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {!hasNextPage && bookings.length > 6 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          Đã hiển thị tất cả {bookings.length} đặt phòng
        </p>
      )}
    </div>
  );
};
