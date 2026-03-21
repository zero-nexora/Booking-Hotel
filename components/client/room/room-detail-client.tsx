"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  Users,
  Maximize2,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { calcNights, getAmenityIcon, toDateParam } from "@/lib/utils";
import { useRoomDetail } from "@/hooks/client/use-hotels";
import { RoomImageGallery } from "./room-image-gallery";
import { RoomBookingSidebar } from "./room-booking-sidebar";

interface RoomDetailClientProps {
  hotelSlug: string;
  roomSlug: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  childrenCount: number;
}

export const RoomDetailClient = ({
  hotelSlug,
  roomSlug,
  checkIn,
  checkOut,
  adults,
  childrenCount,
}: RoomDetailClientProps) => {
  const { data: room, isLoading } = useRoomDetail(roomSlug, hotelSlug, {
    checkIn,
    checkOut,
    adults,
    children: childrenCount,
  });

  if (isLoading) return <RoomDetailSkeleton />;
  if (!room) return notFound();

  const hasDates = !!checkIn && !!checkOut;
  const nights = hasDates ? calcNights(checkIn!, checkOut!) : null;
  const price = Number(room.basePrice.toString());

  const hotelUrl = hasDates
    ? `/hotels/${hotelSlug}?checkIn=${toDateParam(checkIn)}&checkOut=${toDateParam(checkOut)}&adults=${adults}&children=${childrenCount}`
    : `/hotels/${hotelSlug}`;

  const bookingUrl = hasDates
    ? `/booking/${hotelSlug}/${roomSlug}?checkIn=${toDateParam(checkIn)}&checkOut=${toDateParam(checkOut)}&adults=${adults}&children=${childrenCount}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Link
        href={hotelUrl}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {room.hotel.name}
      </Link>

      <RoomImageGallery images={room.images} roomName={room.name} />

      <div className="md:hidden">
        <RoomBookingSidebar
          price={price}
          nights={nights}
          hasDates={hasDates}
          checkIn={checkIn}
          checkOut={checkOut}
          adults={adults}
          childrenCount={childrenCount}
          isAvailable={room.isAvailable}
          bookingUrl={bookingUrl}
          hotelSlug={hotelSlug}
        />
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground"
                >
                  {room.roomType.name}
                </Badge>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {room.name}
                </h1>
              </div>
              {hasDates && (
                <div
                  className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${
                    room.isAvailable
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {room.isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Còn phòng
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Hết phòng
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {room.beds.map((b) => (
                <div
                  key={b.bedType.name}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <BedDouble className="w-3.5 h-3.5" />
                  {b.quantity} {b.bedType.name}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                Tối đa {room.capacity} khách
              </div>
              {room.sizeM2 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Maximize2 className="w-3.5 h-3.5" />
                  {room.sizeM2} m²
                </div>
              )}
              {room.floor && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5" />
                  Tầng {room.floor}
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          {room.description && (
            <>
              <section>
                <h2 className="text-sm font-semibold mb-2 text-foreground">
                  Mô tả
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {room.description}
                </p>
              </section>
              <Separator className="bg-border" />
            </>
          )}

          {room.amenities.length > 0 && (
            <>
              <section>
                <h2 className="text-sm font-semibold mb-3 text-foreground">
                  Tiện nghi phòng
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.amenities.map((a) => {
                    const Icon = getAmenityIcon(a.amenity.icon);
                    return (
                      <div
                        key={a.amenity.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-muted-foreground"
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 text-primary" />
                        {a.amenity.name}
                      </div>
                    );
                  })}
                </div>
              </section>
              <Separator className="bg-border" />
            </>
          )}

          {room.hotel.policy && (
            <section>
              <h2 className="text-sm font-semibold mb-3 text-foreground">
                Chính sách khách sạn
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-border bg-card shadow-none">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Nhận phòng
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Từ {room.hotel.policy.checkInTime}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-border bg-card shadow-none">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Trả phòng
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Trước {room.hotel.policy.checkOutTime}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="box-block lg:w-80 shrink-0">
          <RoomBookingSidebar
            price={price}
            nights={nights}
            hasDates={hasDates}
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            childrenCount={childrenCount}
            isAvailable={room.isAvailable}
            bookingUrl={bookingUrl}
            hotelSlug={hotelSlug}
          />
        </aside>
      </div>
    </div>
  );
};

const RoomDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
    <Skeleton className="h-4 w-32 bg-muted" />
    <Skeleton className="h-72 rounded-2xl bg-muted" />
    <div className="flex gap-8">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-7 w-48 bg-muted" />
        <Skeleton className="h-8 w-2/3 bg-muted" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-5/6 bg-muted" />
        <Skeleton className="h-32 w-full rounded-xl bg-muted" />
      </div>
      <div className="hidden lg:block w-72 shrink-0">
        <Skeleton className="h-72 rounded-2xl bg-muted" />
      </div>
    </div>
  </div>
);
