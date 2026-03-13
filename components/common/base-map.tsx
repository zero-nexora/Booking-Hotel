"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

interface BaseMapProps {
  center: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function BaseMap({
  center,
  zoom = 13,
  scrollWheelZoom = false,
  className = "w-full h-full",
  style,
  children,
}: BaseMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      scrollWheelZoom={scrollWheelZoom}
      style={style}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {children}
    </MapContainer>
  );
}

export function MapLoadingPlaceholder({
  label = "Đang tải bản đồ...",
}: {
  label?: string;
}) {
  return (
    <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
