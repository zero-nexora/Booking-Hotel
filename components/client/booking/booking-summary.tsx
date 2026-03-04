"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingSummaryProps {
  hotel: {
    name: string;
    address: { city: { name: string; country: { name: string } } };
    images: { url: string }[];
  };
  room: {
    name: string;
    roomType: { name: string };
    basePrice: unknown;
    beds: { quantity: number; bedType: { name: string } }[];
  };
  checkIn: Date;
  checkOut: Date;
  expiresAt?: Date | null;
  hotelSlug?: string;
}

const Countdown = ({
  expiresAt,
  hotelSlug,
}: {
  expiresAt: Date;
  hotelSlug?: string;
}) => {
  const router = useRouter();
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(
        0,
        Math.floor((expiresAt.getTime() - Date.now()) / 1000),
      );
      setRemaining(diff);
      if (diff === 0 && hotelSlug) {
        router.push(`/hotels/${hotelSlug}`);
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiresAt, hotelSlug, router]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isWarning = remaining < 300;
  const isDanger = remaining < 120;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        isDanger
          ? "text-destructive"
          : isWarning
            ? "text-orange-500"
            : "text-muted-foreground",
      )}
    >
      <Clock className="w-4 h-4" />
      Hết hạn sau {mins}:{String(secs).padStart(2, "0")}
    </div>
  );
};

export const BookingSummary = ({
  hotel,
  room,
  checkIn,
  checkOut,
  expiresAt,
  hotelSlug,
}: BookingSummaryProps) => {
  const nights = differenceInDays(checkOut, checkIn);
  const basePrice = Number(room.basePrice);
  const total = basePrice * nights;

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Tóm tắt đặt phòng</CardTitle>
        {expiresAt && <Countdown expiresAt={expiresAt} hotelSlug={hotelSlug} />}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium text-sm">{hotel.name}</p>
          <p className="text-xs text-muted-foreground">
            {hotel.address.city.name}, {hotel.address.city.country.name}
          </p>
        </div>

        <div className="text-sm space-y-1">
          <p className="font-medium">
            {room.name}{" "}
            <span className="text-muted-foreground font-normal">
              · {room.roomType.name}
            </span>
          </p>
          {room.beds.map((bed, i) => (
            <p key={i} className="text-muted-foreground text-xs">
              {bed.quantity} × {bed.bedType.name}
            </p>
          ))}
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span>{format(checkIn, "dd/MM/yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span>{format(checkOut, "dd/MM/yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số đêm</span>
            <span>{nights}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {basePrice.toLocaleString("vi-VN")}đ × {nights} đêm
            </span>
            <span>{(basePrice * nights).toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Tổng</span>
            <span>{total.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
