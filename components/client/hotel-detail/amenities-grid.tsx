import {
  Wifi,
  Car,
  Dumbbell,
  UtensilsCrossed,
  Waves,
  Wind,
  Coffee,
  Shield,
  Tv,
  Bath,
  PawPrint,
  Baby,
  Accessibility,
  Bike,
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
  tv: Tv,
  bath: Bath,
  pet: PawPrint,
  baby: Baby,
  accessible: Accessibility,
  bike: Bike,
};

interface AmenitiesGridProps {
  amenities: { amenity: { name: string; icon?: string | null } }[];
}

export const AmenitiesGrid = ({ amenities }: AmenitiesGridProps) => {
  if (!amenities.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {amenities.map(({ amenity }) => {
        const iconKey = amenity.icon?.toLowerCase() ?? "";
        const Icon = iconMap[iconKey] ?? Wifi;
        return (
          <div
            key={amenity.name}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {amenity.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
