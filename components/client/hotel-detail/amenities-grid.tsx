import { getAmenityIcon } from "@/lib/utils";

interface AmenitiesGridProps {
  amenities: { amenity: { name: string; icon?: string | null } }[];
}

export const AmenitiesGrid = ({ amenities }: AmenitiesGridProps) => {
  if (!amenities.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {amenities.map(({ amenity }) => {
        const Icon = getAmenityIcon(amenity.icon);
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
