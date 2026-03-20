"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTopAmenities } from "@/hooks/client/use-home";
import { getAmenityIcon } from "@/lib/utils";

export const TopAmenities = () => {
  const { data: amenities, isLoading } = useTopAmenities();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {amenities?.map((amenity) => {
        const Icon = getAmenityIcon(amenity.icon);
        return (
          <div
            key={amenity.id}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground hover:border-primary hover:text-primary cursor-default"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{amenity.name}</span>
          </div>
        );
      })}
    </div>
  );
};
