"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLocations } from "@/hooks/client/use-hotels";
import { useQueryStates, parseAsString, parseAsInteger, parseAsArrayOf } from "nuqs";
import { Star } from "lucide-react";

const AMENITY_LIST = [
  { id: "wifi", name: "Wifi miễn phí" },
  { id: "parking", name: "Bãi đậu xe" },
  { id: "pool", name: "Hồ bơi" },
  { id: "gym", name: "Phòng gym" },
  { id: "spa", name: "Spa" },
  { id: "restaurant", name: "Nhà hàng" },
];

export const HotelFilters = () => {
  const { data: locations = [] } = useLocations();
  const [params, setParams] = useQueryStates({
    countryId: parseAsString.withDefault(""),
    cityId: parseAsString.withDefault(""),
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    starRating: parseAsInteger,
    amenityIds: parseAsArrayOf(parseAsString).withDefault([]),
  });

  const [priceRange, setPriceRange] = useState([params.minPrice ?? 0, params.maxPrice ?? 10000000]);

  const selectedCountry = locations.find((c) => c.id === params.countryId);
  const cities = selectedCountry?.cities ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      void setParams({ minPrice: priceRange[0] || null, maxPrice: priceRange[1] === 10000000 ? null : priceRange[1] });
    }, 500);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const handleReset = () => {
    void setParams({ countryId: "", cityId: "", minPrice: null, maxPrice: null, starRating: null, amenityIds: [] });
    setPriceRange([0, 10000000]);
  };

  const toggleAmenity = (id: string) => {
    const current = params.amenityIds;
    const next = current.includes(id) ? current.filter((a) => a !== id) : [...current, id];
    void setParams({ amenityIds: next });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Bộ lọc</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-7">
          Đặt lại tất cả
        </Button>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">Điểm đến</p>
        <Select value={params.countryId || "all"} onValueChange={(v) => void setParams({ countryId: v === "all" ? "" : v, cityId: "" })}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Quốc gia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả quốc gia</SelectItem>
            {locations.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {cities.length > 0 && (
          <Select value={params.cityId || "all"} onValueChange={(v) => void setParams({ cityId: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Thành phố" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thành phố</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">Khoảng giá (VND/đêm)</p>
        <Slider
          min={0}
          max={10000000}
          step={100000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
          <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">Hạng sao</p>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <label key={star} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="starRating"
                checked={params.starRating === star}
                onChange={() => void setParams({ starRating: params.starRating === star ? null : star })}
                className="w-4 h-4"
              />
              <span className="flex gap-0.5">
                {Array.from({ length: star }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">Tiện nghi</p>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {AMENITY_LIST.map((amenity) => (
            <div key={amenity.id} className="flex items-center gap-2">
              <Checkbox
                id={`amenity-${amenity.id}`}
                checked={params.amenityIds.includes(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
              <Label htmlFor={`amenity-${amenity.id}`} className="text-sm cursor-pointer">
                {amenity.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};