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
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  calcNights,
  formatDateShort,
  formatCurrencyUSD,
  toDateParam,
} from "@/lib/utils";
import { motion, Variants } from "framer-motion";

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
};

interface AvailableRoomsProps {
  rooms: Room[];
  hotelSlug: string;
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  childCount: number;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const roomCardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export const AvailableRooms = ({
  rooms,
  hotelSlug,
  checkIn,
  checkOut,
  adults,
  childCount,
}: AvailableRoomsProps) => {
  const hasDates = !!checkIn && !!checkOut;
  const nights = hasDates ? calcNights(checkIn!, checkOut!) : null;

  const buildBookingUrl = (room: Room) => {
    const p = new URLSearchParams({
      checkIn: toDateParam(checkIn!),
      checkOut: toDateParam(checkOut!),
      adults: String(adults),
      children: String(childCount),
    });
    return `/hotels/${hotelSlug}/${room.slug}?${p.toString()}`;
  };

  if (!rooms.length) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-8 text-center">
        <p className="font-medium text-sm text-foreground">
          Không có phòng trống
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {hasDates
            ? `Không còn phòng trống từ ${formatDateShort(checkIn!)} đến ${formatDateShort(checkOut!)}`
            : "Vui lòng chọn ngày để xem phòng trống"}
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-1 md:space-y-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {rooms.map((room, index) => {
          const price = Number(room.basePrice.toString());
          const image = room.images[0];

          return (
            <motion.div
              key={room.id}
              variants={roomCardVariants}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full h-48 shrink-0 bg-muted md:w-52 md:h-auto">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt ?? room.name}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, 208px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BedDouble className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <Badge
                    variant="outline"
                    className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border-border text-foreground text-xs"
                  >
                    {room.roomType.name}
                  </Badge>
                </div>

                <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
                  <div>
                    <h3 className="font-semibold text-sm leading-tight text-foreground">
                      {room.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
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
                      {room.amenities.slice(0, 4).map((a) => (
                        <span
                          key={a.amenity.name}
                          className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border"
                        >
                          <Wifi className="w-2.5 h-2.5" />
                          {a.amenity.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                    <div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-lg font-bold text-foreground">
                          {formatCurrencyUSD(price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /đêm
                        </span>
                      </div>
                      {nights && nights > 1 && (
                        <p className="text-xs text-muted-foreground">
                          ≈ {formatCurrencyUSD(price * nights)} · {nights} đêm
                        </p>
                      )}
                    </div>

                    {hasDates ? (
                      <Button
                        size="sm"
                        asChild
                        className="rounded-xl gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link href={buildBookingUrl(room)}>
                          Chọn phòng
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span tabIndex={0}>
                            <Button
                              size="sm"
                              disabled
                              className="rounded-xl gap-1 pointer-events-none"
                            >
                              <CalendarDays className="w-3.5 h-3.5" />
                              Chọn phòng
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-card border-border text-foreground"
                        >
                          Vui lòng chọn ngày nhận và trả phòng
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </TooltipProvider>
  );
};
