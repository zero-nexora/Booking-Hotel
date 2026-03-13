"use client";

import L from "leaflet";
import { Marker, useMapEvents } from "react-leaflet";
import { BaseMap } from "./base-map";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onChange(e.latlng.lat, e.latlng.lng) });
  return null;
}

interface Props {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPickerInner({ lat, lng, onChange }: Props) {
  return (
    <BaseMap center={[lat ?? 21.0278, lng ?? 105.8342]} zoom={13} style={{ cursor: "crosshair" }}>
      <ClickHandler onChange={onChange} />
      {lat && lng && <Marker position={[lat, lng]} icon={markerIcon} />}
    </BaseMap>
  );
}