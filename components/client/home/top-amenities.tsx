"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTopAmenities } from "@/hooks/client/use-home";
import {
  Wifi,
  Car,
  Dumbbell,
  UtensilsCrossed,
  Waves,
  Wind,
  Coffee,
  Shield,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  restaurant: UtensilsCrossed,
  pool: Waves,
  ac: Wind,
  coffee: Coffee,
  security: Shield,
};

export function TopAmenities() {
  const { data: amenities, isLoading } = useTopAmenities();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {amenities?.map((amenity) => {
        const iconKey = amenity.icon?.toLowerCase() ?? "";
        const Icon = iconMap[iconKey] ?? Wifi;
        return (
          <div
            key={amenity.id}
            className="flex items-center gap-2 px-4 py-2 rounded-full border bg-card text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-default"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{amenity.name}</span>
          </div>
        );
      })}
    </div>
  );
}
