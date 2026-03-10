"use client";

import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Building2, Users, CalendarDays, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BookingSummaryProps {
  hotelName: string;
  hotelImage?: string;
  roomName: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  childCount: number;
  pricePerNight: number;
  currency?: string;
  checkInTime?: string;
  checkOutTime?: string;
  expiresAt?: Date;
}

export function BookingSummary({
  hotelName,
  hotelImage,
  roomName,
  roomType,
  checkIn,
  checkOut,
  adults,
  childCount,
  pricePerNight,
  currency = "USD",
  checkInTime,
  checkOutTime,
  expiresAt,
}: BookingSummaryProps) {
  const nights = differenceInDays(checkOut, checkIn);
  const total = pricePerNight * nights;

  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
      {/* Hotel image + names */}
      <div className="relative h-36 bg-muted">
        {hotelImage ? (
          <Image
            src={hotelImage}
            alt={hotelName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-semibold text-sm leading-tight line-clamp-1">
            {hotelName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge
              variant="secondary"
              className="text-xs bg-white/20 text-white border-0 backdrop-blur-sm"
            >
              {roomType}
            </Badge>
            <span className="text-white/80 text-xs line-clamp-1">
              {roomName}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
              Nhận phòng
            </p>
            <p className="text-sm font-semibold">
              {format(checkIn, "dd/MM/yyyy")}
            </p>
            {checkInTime && (
              <p className="text-xs text-muted-foreground">{checkInTime}</p>
            )}
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
              Trả phòng
            </p>
            <p className="text-sm font-semibold">
              {format(checkOut, "dd/MM/yyyy")}
            </p>
            {checkOutTime && (
              <p className="text-xs text-muted-foreground">{checkOutTime}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Số đêm</span>
            </div>
            <span className="font-medium text-foreground">{nights} đêm</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Khách</span>
            </div>
            <span className="font-medium text-foreground">
              {adults} NL{childCount > 0 ? `, ${childCount} TE` : ""}
            </span>
          </div>
        </div>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              ${pricePerNight} × {nights} đêm
            </span>
            <span>${total}</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Tổng cộng</span>
            <span className="text-primary">
              ${total} {currency}
            </span>
          </div>
        </div>

        {/* Expiry warning */}
        {expiresAt && (
          <>
            <Separator />
            <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 rounded-xl p-3">
              <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>
                Phòng được giữ đến{" "}
                <span className="font-semibold">
                  {format(expiresAt, "HH:mm", { locale: vi })}
                </span>
                . Vui lòng hoàn tất trong thời gian này.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
