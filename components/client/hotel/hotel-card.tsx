import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    slug: string;
    starRating: number;
    address: {
      street?: string;
      city: { name: string; country: { name: string } };
    };
    images: { url: string; alt?: string | null }[];
    rooms: { basePrice: unknown }[];
    amenities?: {
      amenity: { id: string; name: string; icon?: string | null };
    }[];
    _count: { reviews: number };
  };
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const image = hotel.images[0];
  const minPrice = hotel.rooms[0] ? Number(hotel.rooms[0].basePrice) : null;
  const topAmenities = hotel.amenities?.slice(0, 4) ?? [];
  const extraCount = (hotel.amenities?.length ?? 0) - 4;

  return (
    <Link href={`/hotels/${hotel.slug}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative h-52 bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? hotel.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Chưa có ảnh</span>
            </div>
          )}
          <Badge className="absolute top-3 left-3 gap-1" variant="secondary">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {hotel.starRating} sao
          </Badge>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold truncate">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {hotel.address.city.name}, {hotel.address.city.country.name}
            </span>
          </div>
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
                  +{extraCount} khác
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            {minPrice !== null ? (
              <div className="text-sm">
                <span className="font-semibold text-base">
                  {minPrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-muted-foreground">/đêm</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Liên hệ</span>
            )}
            <span className="text-xs text-muted-foreground">
              {hotel._count.reviews} đánh giá
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
