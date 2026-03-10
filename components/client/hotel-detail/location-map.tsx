"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address: string;
  hotelName: string;
}

export function LocationMap({
  latitude,
  longitude,
  address,
  hotelName,
}: LocationMapProps) {
  if (!latitude || !longitude) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          {address}
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3" />
            Mở bản đồ
          </a>
        </Button>
      </div>
      <div className="rounded-2xl overflow-hidden border h-64">
        <iframe
          src={embedUrl}
          title={`Vị trí ${hotelName}`}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
