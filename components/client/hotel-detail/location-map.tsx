"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseMap, MapLoadingPlaceholder } from "@/components/common/base-map";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface LocationMapInnerProps {
  latitude: number;
  longitude: number;
  hotelName: string;
}

function LocationMapInner({
  latitude,
  longitude,
  hotelName,
}: LocationMapInnerProps) {
  return (
    <BaseMap center={[latitude, longitude]} zoom={15}>
      <Marker position={[latitude, longitude]} icon={markerIcon}>
        <Popup>{hotelName}</Popup>
      </Marker>
    </BaseMap>
  );
}

const LocationMapLazy = dynamic(() => Promise.resolve(LocationMapInner), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {address}
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-3 h-3" />
            Mở Google Maps
          </a>
        </Button>
      </div>
      <div className="rounded-2xl overflow-hidden border h-64">
        <LocationMapLazy
          latitude={latitude}
          longitude={longitude}
          hotelName={hotelName}
        />
      </div>
    </div>
  );
}
