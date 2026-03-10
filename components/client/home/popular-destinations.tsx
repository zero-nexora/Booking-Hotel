"use client";

import { useRouter } from "next/navigation";
import { MapPin, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularDestinations } from "@/hooks/client/use-home";

export function PopularDestinations() {
  const router = useRouter();
  const { data: destinations, isLoading } = usePopularDestinations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {destinations?.map((dest) => (
        <button
          key={dest.id}
          onClick={() =>
            router.push(`/hotels?city=${encodeURIComponent(dest.name)}`)
          }
          className="group flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center shrink-0 transition-colors">
            <MapPin className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{dest.name}</p>
            <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/70 flex items-center gap-0.5 transition-colors">
              <Building2 className="w-3 h-3" />
              {dest.hotelCount} khách sạn
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
