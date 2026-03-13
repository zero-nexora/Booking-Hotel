"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  BedDouble,
  CalendarDays,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingDetail } from "@/hooks/client/use-booking";
import { StatusTimeline } from "./status-timeline";
import { PaymentHistory } from "./payment-history";
import { CancelSection } from "./cancel-section";
import { formatCurrencyUSD, formatDateShort } from "@/lib/utils";

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

interface BookingDetailClientProps {
  bookingRef: string;
}

export const BookingDetailClient = ({
  bookingRef,
}: BookingDetailClientProps) => {
  const { data: booking, isLoading } = useBookingDetail(bookingRef);

  if (isLoading) return <BookingDetailSkeleton />;
  if (!booking) return null;

  const item = booking.items[0];
  const status = STATUS_MAP[booking.status] ?? STATUS_MAP.PENDING;
  const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);
  const canReview = booking.status === "CHECKED_OUT" && !booking.review;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 h-8" asChild>
          <Link href="/account/bookings">
            <ArrowLeft className="w-3.5 h-3.5" />
            Đặt phòng của tôi
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold">Chi tiết đặt phòng</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            #{booking.bookingRef}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <StatusTimeline status={booking.status as never} />
      </div>

      <div className="rounded-2xl border bg-card divide-y">
        <div className="p-4 space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
            Khách sạn
          </p>
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">{booking.hotel.name}</p>
              <p className="text-xs text-muted-foreground">
                {booking.hotel.address.street},{" "}
                {booking.hotel.address.city.name},{" "}
                {booking.hotel.address.city.country.name}
              </p>
            </div>
          </div>
        </div>

        {item && (
          <div className="p-4 space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
              Phòng
            </p>
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{item.room.name}</span>
                <Badge variant="outline" className="text-xs">
                  {item.room.roomType.name}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">
              Nhận phòng
            </p>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {formatDateShort(booking.checkIn)}
              </span>
            </div>
            {booking.hotel.policy && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                Từ {booking.hotel.policy.checkInTime}
              </p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">
              Trả phòng
            </p>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {formatDateShort(booking.checkOut)}
              </span>
            </div>
            {booking.hotel.policy && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                Trước {booking.hotel.policy.checkOutTime}
              </p>
            )}
          </div>
          {item && (
            <div className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>
                {item.nights} đêm · {item.adults} người lớn
                {item.children > 0 ? `, ${item.children} trẻ em` : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          Thông tin khách
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span>{booking.guestName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{booking.guestEmail}</span>
          </div>
          {booking.guestPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                {booking.guestPhone}
              </span>
            </div>
          )}
          {booking.specialRequests && (
            <>
              <Separator />
              <div className="flex items-start gap-2 text-sm">
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  {booking.specialRequests}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {booking.payments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Lịch sử thanh toán</p>
          <PaymentHistory payments={booking.payments as never} />
          <div className="flex justify-between items-center px-1">
            <span className="text-sm text-muted-foreground">Tổng cộng</span>
            <span className="text-base font-bold">
              {formatCurrencyUSD(Number(booking.totalAmount))}{" "}
              {booking.currency}
            </span>
          </div>
        </div>
      )}

      {canReview && (
        <div className="rounded-2xl border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-medium">Chia sẻ trải nghiệm của bạn</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl shrink-0 gap-1.5"
            asChild
          >
            <Link href={`/account/bookings/${bookingRef}/review`}>
              <Star className="w-3.5 h-3.5" />
              Viết đánh giá
            </Link>
          </Button>
        </div>
      )}

      {canCancel && <CancelSection bookingRef={bookingRef} />}
    </div>
  );
};

const BookingDetailSkeleton = () => {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
};
