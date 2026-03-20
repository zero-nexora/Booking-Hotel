"use client";

import { useQueryStates } from "nuqs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, RotateCcw } from "lucide-react";
import { useHotelFilterOptions } from "@/hooks/client/use-hotels";
import { hotelSearchParsers } from "@/lib/search-params/hotel-search";
import { formatCurrencyUSD } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";

const STAR_OPTIONS = [5, 4, 3, 2, 1];
const RATING_OPTIONS = [
  { label: "Tuyệt vời (4.5+)", value: 4.5 },
  { label: "Rất tốt (4.0+)", value: 4.0 },
  { label: "Tốt (3.5+)", value: 3.5 },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    overflow: "hidden",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const HotelsFilterSidebar = () => {
  const [params, setParams] = useQueryStates(hotelSearchParsers);
  const { data: options } = useHotelFilterOptions();

  const toggleArray = (
    key: "stars" | "amenities" | "bedTypes" | "roomTypes",
    value: string | number,
  ) => {
    const current = (params[key] as (string | number)[]) ?? [];
    const exists = current.includes(value as never);
    const next = exists
      ? current.filter((v) => v !== value)
      : [...current, value];
    setParams({ [key]: next.length ? next : null });
  };

  const hasFilters =
    (params.stars?.length ?? 0) > 0 ||
    (params.amenities?.length ?? 0) > 0 ||
    (params.bedTypes?.length ?? 0) > 0 ||
    (params.roomTypes?.length ?? 0) > 0 ||
    params.minPrice != null ||
    params.maxPrice != null ||
    params.minRating != null;

  const resetAll = () =>
    setParams({
      stars: null,
      amenities: null,
      bedTypes: null,
      roomTypes: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
    });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">Bộ lọc</h3>
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={resetAll}
              >
                <RotateCcw className="w-3 h-3" />
                Xoá lọc
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Giá / đêm
        </p>
        <div className="px-1">
          <Slider
            min={0}
            max={2000}
            step={50}
            value={[params.minPrice ?? 0, params.maxPrice ?? 2000]}
            onValueChange={([min, max]) =>
              setParams({
                minPrice: min > 0 ? min : null,
                maxPrice: max < 2000 ? max : null,
              })
            }
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatCurrencyUSD(params.minPrice ?? 0)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatCurrencyUSD(params.maxPrice ?? 2000)}
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Hạng sao
        </p>
        <div className="space-y-2">
          {STAR_OPTIONS.map((s) => (
            <div key={s} className="flex items-center gap-2.5">
              <Checkbox
                id={`star-${s}`}
                checked={(params.stars ?? []).includes(s)}
                onCheckedChange={() => toggleArray("stars", s)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`star-${s}`}
                className="flex items-center gap-1 cursor-pointer"
              >
                {Array.from({ length: s }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                ))}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Điểm đánh giá
        </p>
        <div className="space-y-2">
          {RATING_OPTIONS.map((r) => (
            <div key={r.value} className="flex items-center gap-2.5">
              <Checkbox
                id={`rating-${r.value}`}
                checked={params.minRating === r.value}
                onCheckedChange={() =>
                  setParams({
                    minRating: params.minRating === r.value ? null : r.value,
                  })
                }
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`rating-${r.value}`}
                className="text-sm cursor-pointer text-foreground"
              >
                {r.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {options?.amenities?.length ? (
          <motion.div
            key="amenities"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Separator className="bg-border mb-5" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Tiện nghi
              </p>
              <div className="space-y-2">
                {options.amenities.slice(0, 8).map((a) => (
                  <div key={a.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`amenity-${a.id}`}
                      checked={(params.amenities ?? []).includes(a.name)}
                      onCheckedChange={() => toggleArray("amenities", a.name)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`amenity-${a.id}`}
                      className="text-sm cursor-pointer text-foreground"
                    >
                      {a.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {options?.bedTypes?.length ? (
          <motion.div
            key="bedTypes"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Separator className="bg-border mb-5" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Loại giường
              </p>
              <div className="space-y-2">
                {options.bedTypes.map((b) => (
                  <div key={b.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`bed-${b.id}`}
                      checked={(params.bedTypes ?? []).includes(b.name)}
                      onCheckedChange={() => toggleArray("bedTypes", b.name)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`bed-${b.id}`}
                      className="text-sm cursor-pointer text-foreground"
                    >
                      {b.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {options?.roomTypes?.length ? (
          <motion.div
            key="roomTypes"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Separator className="bg-border mb-5" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Loại phòng
              </p>
              <div className="space-y-2">
                {options.roomTypes.map((r) => (
                  <div key={r.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`rt-${r.id}`}
                      checked={(params.roomTypes ?? []).includes(r.name)}
                      onCheckedChange={() => toggleArray("roomTypes", r.name)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`rt-${r.id}`}
                      className="text-sm cursor-pointer text-foreground"
                    >
                      {r.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
