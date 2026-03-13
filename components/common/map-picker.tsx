"use client";

import dynamic from "next/dynamic";
import { MapLoadingPlaceholder } from "./base-map";

const MapPickerInner = dynamic(() => import("./map-picker-inner"), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

interface Props {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
}

export function MapPicker({ lat, lng, onChange }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border h-64 relative">
      <MapPickerInner lat={lat} lng={lng} onChange={onChange} />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-1000 pointer-events-none">
        <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          Nhấn vào bản đồ để chọn vị trí
        </span>
      </div>
    </div>
  );
}