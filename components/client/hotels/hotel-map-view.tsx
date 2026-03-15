"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { BaseMap } from "@/components/common/base-map";

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

const createPriceIcon = (price: string, highlighted = false) => {
  const bg = highlighted ? "#6b5040" : "#faf7f2";
  const color = highlighted ? "#faf7f2" : "#241a0f";
  const border = highlighted ? "#6b5040" : "#d4b896";
  const shadow = highlighted
    ? "0 4px 12px rgba(107,80,64,0.35)"
    : "0 2px 8px rgba(107,80,64,0.15)";

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;display:inline-flex;align-items:center;gap:3px;background:${bg};color:${color};padding:5px 9px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:${shadow};border:1.5px solid ${border};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:-0.01em;cursor:pointer;">
      ${price}
      <span style="position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid ${highlighted ? "#6b5040" : "#d4b896"};"></span>
    </div>`,
    iconAnchor: [28, 28],
    iconSize: [56, 28],
  });
};

const HotelsMapInner = ({ hotels }: { hotels: HotelMapItem[] }) => {
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
                      color: "#241a0f",
                    }}
                  >
                    {hotel.name}
                  </p>
                  {hotel.avgRating !== null && (
                    <span
                      style={{
                        background: "#6b5040",
                        color: "#faf7f2",
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
                  style={{ fontSize: 11, color: "#8c7a68", margin: "0 0 8px" }}
                >
                  <span style={{ color: "#b89a6f" }}>
                    {"★".repeat(hotel.starRating)}
                  </span>
                  {" · "}
                  {hotel.address.city.name}
                </p>
                {rawPrice && (
                  <p style={{ fontSize: 13, margin: "0 0 10px" }}>
                    <span style={{ fontWeight: 700, color: "#241a0f" }}>
                      ${rawPrice.toLocaleString()}
                    </span>
                    <span style={{ color: "#8c7a68", fontSize: 11 }}>
                      {" "}
                      / night
                    </span>
                  </p>
                )}
                <button
                  onClick={() => router.push(`/hotels/${hotel.slug}`)}
                  style={{
                    background: "#6b5040",
                    color: "#faf7f2",
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
};

const HotelsMapLazy = dynamic(() => Promise.resolve(HotelsMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center gap-2">
      <MapPin className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Đang tải bản đồ...</span>
    </div>
  ),
});

export const HotelsMapView = ({ hotels }: { hotels: HotelMapItem[] }) => {
  const withCoords = hotels.filter(
    (h) => h.address.latitude && h.address.longitude,
  );

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border z-0"
      style={{ height: "calc(100vh - 220px)", minHeight: 480 }}
    >
      <HotelsMapLazy hotels={hotels} />
      {withCoords.length < hotels.length && (
        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
          <p className="text-xs text-muted-foreground">
            Hiển thị {withCoords.length}/{hotels.length} khách sạn có tọa độ
          </p>
        </div>
      )}
    </div>
  );
};
