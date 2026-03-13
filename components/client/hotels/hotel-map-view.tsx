"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { BaseMap, MapLoadingPlaceholder } from "@/components/common/base-map";

export type HotelMapItem = {
  id: string;
  name: string;
  slug: string;
  starRating: number;
  avgRating: number | null;
  minPrice: { toString(): string } | null;
  address: {
    latitude?: number | null;
    longitude?: number | null;
    city: { name: string };
  };
};

function createPriceIcon(price: string, highlighted = false) {
  const bg = highlighted ? "#1a1a2e" : "#ffffff";
  const color = highlighted ? "#ffffff" : "#0f172a";
  const border = highlighted ? "#1a1a2e" : "#e2e8f0";
  const shadow = highlighted
    ? "0 4px 12px rgba(0,0,0,0.35)"
    : "0 2px 8px rgba(0,0,0,0.15)";

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;display:inline-flex;align-items:center;gap:3px;background:${bg};color:${color};padding:5px 9px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:${shadow};border:1.5px solid ${border};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:-0.01em;cursor:pointer;">
      ${price}
      <span style="position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid ${highlighted ? "#1a1a2e" : "#e2e8f0"};"></span>
    </div>`,
    iconAnchor: [28, 28],
    iconSize: [56, 28],
  });
}

function HotelsMapInner({ hotels }: { hotels: HotelMapItem[] }) {
  const router = useRouter();
  const withCoords = hotels.filter(
    (h) => h.address.latitude && h.address.longitude,
  );
  const center: [number, number] =
    withCoords.length > 0
      ? [withCoords[0].address.latitude!, withCoords[0].address.longitude!]
      : [16.0544, 108.2022];

  return (
    <BaseMap center={center} zoom={6} scrollWheelZoom>
      {withCoords.map((hotel) => {
        const rawPrice = hotel.minPrice
          ? Number(hotel.minPrice.toString())
          : null;
        const priceLabel = rawPrice ? `$${rawPrice.toLocaleString()}` : "—";

        return (
          <Marker
            key={hotel.id}
            position={[hotel.address.latitude!, hotel.address.longitude!]}
            icon={createPriceIcon(priceLabel)}
          >
            <Popup maxWidth={220} minWidth={180}>
              <div
                style={{
                  fontFamily:
                    "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
                  padding: "2px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      margin: 0,
                      lineHeight: 1.3,
                      flex: 1,
                      paddingRight: 8,
                    }}
                  >
                    {hotel.name}
                  </p>
                  {hotel.avgRating !== null && (
                    <span
                      style={{
                        background: "#0f172a",
                        color: "white",
                        borderRadius: 6,
                        padding: "2px 6px",
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {hotel.avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
                <p
                  style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 8px" }}
                >
                  <span style={{ color: "#f59e0b" }}>
                    {"★".repeat(hotel.starRating)}
                  </span>
                  {" · "}
                  {hotel.address.city.name}
                </p>
                {rawPrice && (
                  <p style={{ fontSize: 13, margin: "0 0 10px" }}>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>
                      ${rawPrice.toLocaleString()}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 11 }}>
                      {" "}
                      / night
                    </span>
                  </p>
                )}
                <button
                  onClick={() => router.push(`/hotels/${hotel.slug}`)}
                  style={{
                    background: "#0f172a",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 0",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                    letterSpacing: "0.01em",
                  }}
                >
                  View hotel →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </BaseMap>
  );
}

const HotelsMapLazy = dynamic(() => Promise.resolve(HotelsMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center gap-2">
      <MapPin className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Đang tải bản đồ...</span>
    </div>
  ),
});

export function HotelsMapView({ hotels }: { hotels: HotelMapItem[] }) {
  const withCoords = hotels.filter(
    (h) => h.address.latitude && h.address.longitude,
  );

  return (
    <div
      className="relative rounded-2xl overflow-hidden border z-0"
      style={{ height: "calc(100vh - 220px)", minHeight: 480 }}
    >
      <HotelsMapLazy hotels={hotels} />
      {withCoords.length < hotels.length && (
        <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-1.5">
          <p className="text-xs text-muted-foreground">
            Hiển thị {withCoords.length}/{hotels.length} khách sạn có tọa độ
          </p>
        </div>
      )}
    </div>
  );
}

function ClickHandler({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({ click: (e) => onChange(e.latlng.lat, e.latlng.lng) });
  return null;
}

const defaultMarkerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerInnerProps {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
}

function MapPickerInner({ lat, lng, onChange }: MapPickerInnerProps) {
  return (
    <BaseMap
      center={[lat ?? 21.0278, lng ?? 105.8342]}
      zoom={13}
      style={{ cursor: "crosshair" }}
    >
      <ClickHandler onChange={onChange} />
      {lat && lng && <Marker position={[lat, lng]} icon={defaultMarkerIcon} />}
    </BaseMap>
  );
}

const MapPickerLazy = dynamic(() => Promise.resolve(MapPickerInner), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

export function MapPicker({ lat, lng, onChange }: MapPickerInnerProps) {
  return (
    <div className="rounded-xl overflow-hidden border h-64 relative">
      <MapPickerLazy lat={lat} lng={lng} onChange={onChange} />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-1000 pointer-events-none">
        <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          Nhấn vào bản đồ để chọn vị trí
        </span>
      </div>
    </div>
  );
}
