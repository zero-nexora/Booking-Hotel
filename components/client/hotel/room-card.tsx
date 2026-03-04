"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Maximize, Building2 } from "lucide-react";

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    roomType: { name: string };
    capacity: number;
    sizeM2?: number | null;
    floor?: number | null;
    basePrice: unknown;
    images: { url: string; alt?: string | null; isPrimary: boolean }[];
    beds: { id: string; quantity: number; bedType: { name: string } }[];
    amenities: {
      amenity: { id: string; name: string; icon?: string | null };
    }[];
  };
  hotelId: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  nights?: number;
  isAvailable?: boolean;
}

export const RoomCard = ({
  room,
  hotelId,
  checkIn,
  checkOut,
  adults = 1,
  children = 0,
  nights,
  isAvailable = true,
}: RoomCardProps) => {
  const router = useRouter();
  const image = room.images.find((i) => i.isPrimary) ?? room.images[0];
  const basePrice = Number(room.basePrice);
  const total = nights ? basePrice * nights : null;
  const topAmenities = room.amenities.slice(0, 5);
  const extraCount = room.amenities.length - 5;

  const handleBook = () => {
    if (!checkIn || !checkOut) return;
    const params = new URLSearchParams({
      roomId: room.id,
      hotelId,
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/booking/new?${params.toString()}`);
  };

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
      <div className="relative w-full md:w-52 h-48 md:h-auto shrink-0 bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? room.name}
            fill
            className="object-cover"
            sizes="208px"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            Chưa có ảnh
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{room.name}</h3>
              <Badge variant="secondary" className="mt-1 text-xs">
                {room.roomType.name}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {room.capacity} khách
            </span>
            {room.sizeM2 && (
              <span className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" />
                {room.sizeM2} m²
              </span>
            )}
            {room.floor && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Tầng {room.floor}
              </span>
            )}
          </div>

          {room.beds.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              {room.beds.map((bed) => (
                <span key={bed.id} className="text-muted-foreground">
                  {bed.quantity} × {bed.bedType.name}
                </span>
              ))}
            </div>
          )}

          {topAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {topAmenities.map(({ amenity }) => (
                <Badge key={amenity.id} variant="outline" className="text-xs">
                  {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                  {amenity.name}
                </Badge>
              ))}
              {extraCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{extraCount}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-4 pt-2 border-t">
          <div>
            <div className="text-xl font-bold">
              {basePrice.toLocaleString("vi-VN")}đ
              <span className="text-sm font-normal text-muted-foreground">
                /đêm
              </span>
            </div>
            {total && (
              <div className="text-sm text-muted-foreground">
                Tổng {total.toLocaleString("vi-VN")}đ ({nights} đêm)
              </div>
            )}
          </div>
          <Button
            onClick={handleBook}
            disabled={!isAvailable || !checkIn || !checkOut}
            className="shrink-0"
          >
            {!isAvailable ? "Hết phòng" : !checkIn ? "Chọn ngày" : "Đặt ngay"}
          </Button>
        </div>
      </div>
    </div>
  );
};
