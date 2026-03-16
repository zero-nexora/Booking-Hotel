"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryStates } from "nuqs";
import { Calendar, MapPin, Users, Search, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn, formatDateShort } from "@/lib/utils";
import { hotelSearchParsers } from "@/lib/search-params/hotel-search";
import { useDebounce } from "@/hooks/use-debounce";

export const HotelsSearchBar = () => {
  const [params, setParams] = useQueryStates(hotelSearchParsers);

  const [local, setLocal] = useState(params.search);
  const debounced = useDebounce(local);
  const [guestOpen, setGuestOpen] = useState(false);

  useEffect(() => {
    setParams({ search: debounced });
  }, [debounced, setParams]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocal(e.target.value);
    },
    [setLocal],
  );

  const checkIn = params.checkIn ?? undefined;
  const checkOut = params.checkOut ?? undefined;

  return (
    <div className="flex gap-0 bg-background border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 flex-1 px-3 py-2 border-r border-border hover:bg-muted/40 min-w-0">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <Input
          placeholder="Điểm đến..."
          value={local ?? ""}
          onChange={handleSearchChange}
          className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-2 border-r border-border hover:bg-muted/40 text-left whitespace-nowrap shrink-0",
              !checkIn && !checkOut
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm">
              {checkIn && checkOut
                ? `${formatDateShort(checkIn)} - ${formatDateShort(checkOut)}`
                : checkIn
                  ? `${formatDateShort(checkIn)} - ?`
                  : "Ngày"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-card border-border"
          align="start"
        >
          <CalendarUI
            mode="range"
            selected={{ from: checkIn, to: checkOut }}
            onSelect={(r) =>
              setParams({ checkIn: r?.from ?? null, checkOut: r?.to ?? null })
            }
            disabled={(d) => d < new Date()}
            numberOfMonths={1}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover open={guestOpen} onOpenChange={setGuestOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 border-r border-border hover:bg-muted/40 whitespace-nowrap shrink-0 text-foreground">
            <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm">
              {params.adults} NL
              {params.children > 0 ? `, ${params.children} TE` : ""}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 p-4 bg-card border-border"
          align="start"
        >
          <div className="space-y-3">
            {(
              [
                { label: "Người lớn", key: "adults" as const, min: 1, max: 10 },
                { label: "Trẻ em", key: "children" as const, min: 0, max: 6 },
              ] as const
            ).map(({ label, key, min, max }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full border-border text-foreground hover:bg-muted hover:text-foreground"
                    onClick={() =>
                      setParams({ [key]: Math.max(min, params[key] - 1) })
                    }
                    disabled={params[key] <= min}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-5 text-center text-sm font-semibold text-foreground">
                    {params[key]}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full border-border text-foreground hover:bg-muted hover:text-foreground"
                    onClick={() =>
                      setParams({ [key]: Math.min(max, params[key] + 1) })
                    }
                    disabled={params[key] >= max}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            className="w-full mt-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setGuestOpen(false)}
          >
            Xác nhận
          </Button>
        </PopoverContent>
      </Popover>

      <Button
        size="sm"
        className="rounded-none rounded-r-xl px-4 h-auto gap-1.5 shrink-0 w-16 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Tìm</span>
      </Button>
    </div>
  );
};
