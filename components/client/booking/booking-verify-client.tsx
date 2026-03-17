"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  BedDouble,
  CalendarDays,
  Users,
  BadgeCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort, formatCurrencyUSD } from "@/lib/utils";
import { useBookingVerify } from "@/hooks/client/use-booking";

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
    iconClassName: string;
  }
> = {
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: CheckCircle2,
    className: "bg-primary/10 border-primary/30",
    iconClassName: "text-primary",
  },
  CHECKED_IN: {
    label: "Đang lưu trú",
    icon: BadgeCheck,
    className: "bg-accent border-border",
    iconClassName: "text-accent-foreground",
  },
  CHECKED_OUT: {
    label: "Đã trả phòng",
    icon: CheckCircle2,
    className: "bg-muted border-border",
    iconClassName: "text-muted-foreground",
  },
  PENDING: {
    label: "Chờ thanh toán",
    icon: Clock,
    className: "bg-secondary border-border",
    iconClassName: "text-secondary-foreground",
  },
  CANCELLED: {
    label: "Đã huỷ",
    icon: XCircle,
    className: "bg-destructive/10 border-destructive/30",
    iconClassName: "text-destructive",
  },
  NO_SHOW: {
    label: "Không đến",
    icon: XCircle,
    className: "bg-destructive/10 border-destructive/30",
    iconClassName: "text-destructive",
  },
};

interface Props {
  bookingRef: string;
}

export const BookingVerifyClient = ({ bookingRef }: Props) => {
  const { data: booking, isLoading, isError } = useBookingVerify(bookingRef);

  if (isLoading) return <VerifySkeleton />;

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center bg-background">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="w-9 h-9 text-destructive" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Không tìm thấy đặt phòng
          </h1>
          <p className="text-sm text-muted-foreground">
            Mã đặt phòng{" "}
            <span className="font-mono font-semibold text-foreground">
              {bookingRef}
            </span>{" "}
            không tồn tại hoặc đã bị xoá.
          </p>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = cfg.icon;
  const item = booking.items[0];
  const isValid = ["CONFIRMED", "CHECKED_IN"].includes(booking.status);

  return (
    <div className="min-h-screen bg-muted/20 flex items-start justify-center pt-12 pb-20 px-4">
      <div className="w-full max-w-md space-y-4">
        <div
          className={`rounded-2xl border-2 p-6 text-center space-y-3 ${cfg.className}`}
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-sm border border-border">
              <StatusIcon className={`w-9 h-9 ${cfg.iconClassName}`} />
            </div>
          </div>
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-widest mb-1 ${cfg.iconClassName}`}
            >
              {isValid ? "Xác minh thành công" : "Trạng thái đặt phòng"}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {cfg.label}
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 bg-card/80 rounded-xl px-4 py-2 border border-border">
            <span className="text-xs text-muted-foreground">Mã đặt phòng</span>
            <span className="font-mono font-bold tracking-wider text-sm text-foreground">
              {booking.bookingRef}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-none divide-y divide-border">
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Khách sạn
            </p>
            <p className="font-semibold text-foreground">
              {booking.hotel.name}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {booking.hotel.address.street}, {booking.hotel.address.city.name}
            </div>
          </div>

          {item && (
            <div className="p-4 space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Phòng
              </p>
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">
                  {item.room.name}
                </span>
              </div>
            </div>
          )}

          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Nhận phòng
              </p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {formatDateShort(booking.checkIn)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Trả phòng
              </p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {formatDateShort(booking.checkOut)}
                </span>
              </div>
            </div>
            {item && (
              <div className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                {item.nights} đêm · {item.adults} người lớn
                {item.children > 0 ? `, ${item.children} trẻ em` : ""}
              </div>
            )}
          </div>

          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Khách
            </p>
            <p className="font-medium text-sm text-foreground">
              {booking.guestName}
            </p>
          </div>

          <div className="p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Tổng thanh toán
            </p>
            <p className="text-lg font-bold text-primary">
              {formatCurrencyUSD(Number(booking.totalAmount))}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Xác minh tại {formatDateShort(new Date())}
        </p>
      </div>
    </div>
  );
};

const VerifySkeleton = () => (
  <div className="min-h-screen bg-muted/20 flex items-start justify-center pt-12 px-4">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-52 rounded-2xl bg-muted" />
      <Skeleton className="h-64 rounded-2xl bg-muted" />
    </div>
  </div>
);
