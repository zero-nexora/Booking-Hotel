"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Hotel = {
  id: string;
  name: string;
  slug: string;
  starRating: number;
  avgRating: number | null;
  reviewCount: number;
  minPrice: { toString(): string } | null;
  images: { url: string; alt?: string | null }[];
  address: { city: { name: string; country: { name: string } } };
  amenities: { amenity: { name: string; icon?: string | null } }[];
  checkIn?: Date;
  checkOut?: Date;
};

interface HotelCardProps {
  hotel: Hotel;
  view: "list" | "grid";
  nights?: number;
}

export function HotelCard({ hotel, view, nights = 1 }: HotelCardProps) {
  const href = `/hotels/${hotel.slug}`;
  const price = hotel.minPrice ? Number(hotel.minPrice.toString()) : null;

  if (view === "grid") {
    return (
      <Link href={href} className="group flex">
        <div className="flex flex-col w-full rounded-2xl overflow-hidden border bg-card hover:shadow-md transition-shadow">
          <div className="relative h-44 bg-muted overflow-hidden shrink-0">
            {hotel.images[0] ? (
              <Image
                src={hotel.images[0].url}
                alt={hotel.images[0].alt ?? hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 backdrop-blur-sm bg-background/80 text-xs gap-0.5"
            >
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
                />
              ))}
            </Badge>
          </div>
          <div className="flex flex-col flex-1 p-3.5">
            <h3 className="font-semibold text-sm line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {hotel.address.city.name}, {hotel.address.city.country.name}
              </span>
            </div>
            <div className="mt-auto pt-3">
              <div className="border-t pt-3 flex items-center justify-between gap-2">
                <div>
                  {hotel.avgRating !== null ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">
                        {hotel.avgRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({hotel.reviewCount})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Chưa có đánh giá
                    </span>
                  )}
                </div>
                {price && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">${price}</p>
                    <p className="text-xs text-muted-foreground">/đêm</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border bg-card hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex">
        <div className="relative w-52 shrink-0 bg-muted">
          {hotel.images[0] ? (
            <Image
              src={hotel.images[0].url}
              alt={hotel.images[0].alt ?? hotel.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 backdrop-blur-sm bg-background/80 text-xs gap-0.5"
          >
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star
                key={i}
                className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
              />
            ))}
          </Badge>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
          <div>
            <h3 className="font-semibold text-sm leading-tight">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">
                {hotel.address.city.name}, {hotel.address.city.country.name}
              </span>
            </div>
          </div>

          {hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hotel.amenities.slice(0, 4).map((a) => (
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

          <div className="flex items-center justify-between mt-auto pt-2 border-t">
            <div>
              {hotel.avgRating !== null ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 bg-primary/10 text-primary px-2 py-0.5 rounded-lg">
                    <Star className="w-3 h-3 fill-primary" />
                    <span className="text-xs font-bold">
                      {hotel.avgRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {hotel.reviewCount} đánh giá
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Chưa có đánh giá
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {price && (
                <div className="text-right">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold">${price}</span>
                    <span className="text-xs text-muted-foreground">/đêm</span>
                  </div>
                  {nights > 1 && (
                    <p className="text-xs text-muted-foreground">
                      ≈ ${price * nights} tổng cộng
                    </p>
                  )}
                </div>
              )}
              <Button size="sm" asChild className="rounded-xl">
                <Link href={href}>Xem chi tiết</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
