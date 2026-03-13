"use client";

import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useHotelDetail } from "@/hooks/client/use-hotels";
import { ImageGallery } from "./image-gallery";
import { HotelOverview } from "./hotel-overview";
import { AmenitiesGrid } from "./amenities-grid";
import { AvailableRooms } from "./available-rooms";
import { ReviewsSection } from "./reviews-section";
import { BookingSidebar } from "./booking-sidebar";
import { LocationMap } from "./location-map";

interface HotelDetailClientProps {
  slug: string;
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  childCount: number;
}

export const HotelDetailClient = ({
  slug,
  checkIn,
  checkOut,
  adults,
  childCount,
}: HotelDetailClientProps) => {
  const { data: hotel, isLoading } = useHotelDetail(slug, checkIn, checkOut);

  if (isLoading) return <HotelDetailSkeleton />;
  if (!hotel) return notFound();

  const minPrice = hotel.rooms.length
    ? Math.min(...hotel.rooms.map((r) => Number(r.basePrice.toString())))
    : null;

  const fullAddress = [
    hotel.address.street,
    hotel.address.city.name,
    hotel.address.city.country.name,
  ].join(", ");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <ImageGallery images={hotel.images} hotelName={hotel.name} />

      <div className="flex wapper gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          <HotelOverview
            name={hotel.name}
            starRating={hotel.starRating}
            address={hotel.address}
            phone={hotel.phone}
            email={hotel.email}
            avgRating={hotel.avgRating}
            reviewCount={hotel.reviewCount}
            policy={hotel.policy}
          />

          <Separator />

          {hotel.description && (
            <>
              <section>
                <h2 className="text-base font-semibold mb-3">Giới thiệu</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {hotel.description}
                </p>
              </section>
              <Separator />
            </>
          )}

          {hotel.amenities.length > 0 && (
            <>
              <section>
                <h2 className="text-base font-semibold mb-4">Tiện nghi</h2>
                <AmenitiesGrid amenities={hotel.amenities} />
              </section>
              <Separator />
            </>
          )}

          <section id="available-rooms">
            <h2 className="text-base font-semibold mb-4">
              Phòng trống
              {checkIn && checkOut && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  · {hotel.rooms.length} phòng
                </span>
              )}
            </h2>
            <AvailableRooms
              rooms={hotel.rooms as never}
              hotelSlug={slug}
              checkIn={checkIn}
              checkOut={checkOut}
              adults={adults}
              childCount={childCount}
            />
          </section>

          <Separator />

          <section>
            <h2 className="text-base font-semibold mb-4">Vị trí</h2>
            <LocationMap
              latitude={hotel.address.latitude}
              longitude={hotel.address.longitude}
              address={fullAddress}
              hotelName={hotel.name}
            />
          </section>

          <Separator />

          <section>
            <h2 className="text-base font-semibold mb-5">
              Đánh giá
              {hotel.reviewCount > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  · {hotel.reviewCount} đánh giá
                </span>
              )}
            </h2>
            <ReviewsSection
              hotelId={hotel.id}
              avgRating={hotel.avgRating}
              reviewCount={hotel.reviewCount}
            />
          </section>
        </div>

        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24">
            <BookingSidebar
              minPrice={minPrice}
              hotelSlug={slug}
              defaultCheckIn={checkIn}
              defaultCheckOut={checkOut}
              defaultAdults={adults}
              defaultChildren={childCount}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

const HotelDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <Skeleton className="h-105 rounded-2xl" />
      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="w-80 shrink-0">
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
