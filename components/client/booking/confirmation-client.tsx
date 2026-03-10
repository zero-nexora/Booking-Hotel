"use client";

import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
  User,
  Mail,
  Phone,
  BedDouble,
  Home,
  BookOpen,
  Printer,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingConfirmation } from "@/hooks/client/use-booking";

const STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "Đang chờ", variant: "secondary" },
  CONFIRMED: { label: "Đã xác nhận", variant: "default" },
  CHECKED_IN: { label: "Đã check-in", variant: "default" },
  CHECKED_OUT: { label: "Đã check-out", variant: "outline" },
  CANCELLED: { label: "Đã huỷ", variant: "destructive" },
  NO_SHOW: { label: "Không đến", variant: "destructive" },
};

const PAYMENT_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  UNPAID: { label: "Chưa thanh toán", variant: "destructive" },
  PENDING: { label: "Đang xử lý", variant: "secondary" },
  PAID: { label: "Đã thanh toán", variant: "default" },
  REFUNDED: { label: "Đã hoàn tiền", variant: "outline" },
  FAILED: { label: "Thất bại", variant: "destructive" },
};

interface ConfirmationClientProps {
  bookingRef: string;
}

export function ConfirmationClient({ bookingRef }: ConfirmationClientProps) {
  const { data: booking, isLoading } = useBookingConfirmation(bookingRef);

  if (isLoading) return <ConfirmationSkeleton />;
  if (!booking) return null;

  const item = booking.items[0];
  const nights = item?.nights ?? 0;
  const statusInfo = STATUS_MAP[booking.status] ?? STATUS_MAP.PENDING;
  const paymentInfo = PAYMENT_MAP[booking.paymentStatus] ?? PAYMENT_MAP.UNPAID;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Success banner */}
      <div className="text-center space-y-3 py-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Đặt phòng thành công!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Email xác nhận đã được gửi đến{" "}
            <span className="font-medium text-foreground">
              {booking.guestEmail}
            </span>
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
          <span className="text-xs text-muted-foreground">Mã đặt phòng</span>
          <span className="font-mono font-bold tracking-wider text-sm">
            {booking.bookingRef}
          </span>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Badge variant={statusInfo.variant} className="gap-1.5">
          {statusInfo.label}
        </Badge>
        <Badge variant={paymentInfo.variant} className="gap-1.5">
          {paymentInfo.label}
        </Badge>
      </div>

      {/* Main details card */}
      <div className="rounded-2xl border bg-card divide-y">
        {/* Hotel + room */}
        <div className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Khách sạn
          </p>
          <p className="font-semibold">{booking.hotel.name}</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>
              {booking.hotel.address.street}, {booking.hotel.address.city.name},{" "}
              {booking.hotel.address.city.country.name}
            </span>
          </div>
        </div>

        {/* Room */}
        {item && (
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Phòng
            </p>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium text-sm">{item.room.name}</span>
              <Badge variant="outline" className="text-xs">
                {item.room.roomType.name}
              </Badge>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              Nhận phòng
            </p>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {format(new Date(booking.checkIn), "dd/MM/yyyy", {
                  locale: vi,
                })}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              Trả phòng
            </p>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {format(new Date(booking.checkOut), "dd/MM/yyyy", {
                  locale: vi,
                })}
              </span>
            </div>
          </div>
          <div className="col-span-2 text-xs text-muted-foreground">
            {nights} đêm · {item?.adults} người lớn
            {(item?.children ?? 0) > 0 ? `, ${item.children} trẻ em` : ""}
          </div>
        </div>

        {/* Guest */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Khách lưu trú
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{booking.guestName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {booking.guestEmail}
              </span>
            </div>
            {booking.guestPhone && (
              <div className="flex items-center gap-1.5 text-sm">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {booking.guestPhone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Special requests */}
        {booking.specialRequests && (
          <div className="p-4 space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Yêu cầu đặc biệt
            </p>
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>{booking.specialRequests}</p>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="p-4 flex items-center justify-between">
          <p className="text-sm font-medium">Tổng thanh toán</p>
          <p className="text-lg font-bold text-primary">
            ${Number(booking.totalAmount)} {booking.currency}
          </p>
        </div>
      </div>

      {/* What's next */}
      <div className="rounded-2xl bg-muted/40 border p-4 space-y-3">
        <p className="text-sm font-semibold">Bước tiếp theo</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            <p>Email xác nhận đã được gửi — kiểm tra hộp thư của bạn.</p>
          </div>
          {booking.hotel.policy && (
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
              <p>
                Check-in từ{" "}
                <span className="font-medium text-foreground">
                  {booking.hotel.policy.checkInTime}
                </span>
                , check-out trước{" "}
                <span className="font-medium text-foreground">
                  {booking.hotel.policy.checkOutTime}
                </span>
                .
              </p>
            </div>
          )}
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            <p>
              Mang theo mã đặt phòng{" "}
              <span className="font-mono font-bold text-foreground">
                {booking.bookingRef}
              </span>{" "}
              khi đến check-in.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 rounded-xl gap-2" asChild>
          <Link href="/account/bookings">
            <BookOpen className="w-4 h-4" />
            Xem đặt phòng của tôi
          </Link>
        </Button>
        <Button
          variant="outline"
          className="rounded-xl gap-2"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4" />
          In xác nhận
        </Button>
        <Button variant="ghost" className="rounded-xl gap-2" asChild>
          <Link href="/">
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <div className="flex gap-3">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  );
}
