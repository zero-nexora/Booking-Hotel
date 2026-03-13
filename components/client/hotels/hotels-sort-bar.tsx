"use client";

import { useQueryStates } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE } from "@/lib/constants";
import { hotelSearchParsers } from "@/lib/search-params/hotel-search";

const sortOptions = [
  { value: "price_asc", label: "Giá thấp → cao" },
  { value: "price_desc", label: "Giá cao → thấp" },
  { value: "rating", label: "Đánh giá tốt nhất" },
  { value: "stars", label: "Hạng sao cao nhất" },
];

interface HotelsSortBarProps {
  total?: number;
}

export function HotelsSortBar({ total }: HotelsSortBarProps) {
  const [params, setParams] = useQueryStates(hotelSearchParsers);

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        {total !== undefined ? (
          <>
            <span className="font-medium text-foreground">{total}</span> khách
            sạn
          </>
        ) : null}
      </p>

      <div className="flex items-center gap-2">
        <Select
          value={params.sort}
          onValueChange={(v) => setParams({ sort: v as never })}
        >
          <SelectTrigger className="h-8 text-xs w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex rounded-lg border overflow-hidden">
          {(
            [
              { value: "list", icon: List },
              { value: "grid", icon: LayoutGrid },
              { value: "map", icon: Map },
            ] as const
          ).map(({ value, icon: Icon }, i) => (
            <Button
              key={value}
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none border-0",
                i > 0 && "border-l",
                params.view === value && "bg-muted",
              )}
              onClick={() => setParams({ view: value })}
            >
              <Icon className="w-3.5 h-3.5" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
