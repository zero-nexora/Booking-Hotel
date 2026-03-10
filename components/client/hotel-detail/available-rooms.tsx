"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Users,
  Maximize2,
  Building2,
  ChevronRight,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { calcNights } from "@/lib/utils";

type Room = {
  id: string;
  name: string;
  slug: string;
  description: string;
  capacity: number;
  sizeM2?: number | null;
  floor?: number | null;
  basePrice: { toString(): string };
  roomType: { name: string };
  images: { url: string; alt?: string | null }[];
  beds: { quantity: number; bedType: { name: string } }[];
  amenities: { amenity: { name: string; icon?: string | null } }[];
  totalPrice?: number;
  nights?: number;
};

interface AvailableRoomsProps {
  rooms: Room[];
  hotelSlug: string;
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  childCount: number;
}

export function AvailableRooms({
  rooms,
  hotelSlug,
  checkIn,
  checkOut,
  adults,
  childCount,
}: AvailableRoomsProps) {
  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : null;

  if (!rooms.length) {
    return (
      <div className="rounded-2xl border bg-muted/40 p-8 text-center">
        <p className="font-medium text-sm">Không có phòng trống</p>
        <p className="text-sm text-muted-foreground mt-1">
          {checkIn && checkOut
            ? `Không còn phòng trống từ ${format(checkIn, "dd/MM")} đến ${format(checkOut, "dd/MM/yyyy")}`
            : "Vui lòng chọn ngày để xem phòng trống"}
        </p>
      </div>
    );
  }

  const buildBookingUrl = (room: Room) => {
    const base = `/booking/${hotelSlug}/${room.slug}`;
    const p = new URLSearchParams();
    if (checkIn) p.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) p.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    p.set("adults", String(adults));
    p.set("children", String(childCount));
    return `${base}?${p.toString()}`;
  };

  return (
    <div className="space-y-4">
      {rooms.map((room) => {
        const price = Number(room.basePrice.toString());
        const total = nights ? price * nights : null;

        return (
          <div
            key={room.id}
            className="rounded-2xl border bg-card overflow-hidden hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-52 h-44 sm:h-auto bg-muted shrink-0">
                {room.images[0] ? (
                  <Image
                    src={room.images[0].url}
                    alt={room.images[0].alt ?? room.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BedDouble className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 text-xs bg-background/80 backdrop-blur-sm"
                >
                  {room.roomType.name}
                </Badge>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 gap-3 min-w-0">
                <div>
                  <h3 className="font-semibold text-sm">{room.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {room.beds.map((b) => (
                      <div
                        key={b.bedType.name}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
                      >
                        <BedDouble className="w-3 h-3" />
                        {b.quantity} {b.bedType.name}
                      </div>
                    ))}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {room.capacity} khách
                    </div>
                    {room.sizeM2 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Maximize2 className="w-3 h-3" />
                        {room.sizeM2} m²
                      </div>
                    )}
                    {room.floor && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        Tầng {room.floor}
                      </div>
                    )}
                  </div>
                </div>

                {room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.slice(0, 5).map((a) => (
                      <span
                        key={a.amenity.name}
                        className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
                      >
                        <Wifi className="w-2.5 h-2.5" />
                        {a.amenity.name}
                      </span>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between gap-3 mt-auto">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">${price}</span>
                      <span className="text-xs text-muted-foreground">
                        /đêm
                      </span>
                    </div>
                    {total && nights && (
                      <p className="text-xs text-muted-foreground">
                        ${total} · {nights} đêm
                      </p>
                    )}
                  </div>
                  <Button asChild className="rounded-xl gap-1">
                    <Link href={buildBookingUrl(room)}>
                      Chọn phòng
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
