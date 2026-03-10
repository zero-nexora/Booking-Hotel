"use client";

import { useQueryStates } from "nuqs";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Search, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DEFAULT_PAGE } from "@/lib/constants";
import { hotelSearchParsers } from "@/lib/search-params/hotel-search";

export function HotelsSearchBar() {
  const [params, setParams] = useQueryStates(hotelSearchParsers);
  const [guestOpen, setGuestOpen] = useState(false);

  const checkIn = params.checkIn ?? undefined;
  const checkOut = params.checkOut ?? undefined;

  return (
    <div className="bg-background border rounded-xl p-1.5 flex flex-col sm:flex-row gap-1.5 shadow-sm">
      <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <Input
          placeholder="Điểm đến..."
          value={params.city}
          onChange={(e) =>
            setParams({ city: e.target.value, page: DEFAULT_PAGE })
          }
          className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="hidden sm:block w-px bg-border self-stretch my-1.5" />

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-left min-w-0">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span
              className={cn(
                "text-sm truncate",
                !checkIn && !checkOut && "text-muted-foreground",
              )}
            >
              {checkIn && checkOut
                ? `${format(checkIn, "dd/MM")} → ${format(checkOut, "dd/MM")}`
                : checkIn
                  ? `${format(checkIn, "dd/MM/yyyy")} → ...`
                  : "Chọn ngày"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarUI
            mode="range"
            selected={{ from: checkIn, to: checkOut }}
            onSelect={(range) =>
              setParams({
                checkIn: range?.from ?? null,
                checkOut: range?.to ?? null,
                page: DEFAULT_PAGE,
              })
            }
            disabled={(date) => date < new Date()}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="hidden sm:block w-px bg-border self-stretch my-1.5" />

      <Popover open={guestOpen} onOpenChange={setGuestOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-left">
            <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm whitespace-nowrap">
              {params.adults} NL
              {params.children > 0 ? `, ${params.children} TE` : ""}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4" align="start">
          <div className="space-y-3">
            {[
              { label: "Người lớn", key: "adults" as const, min: 1, max: 10 },
              { label: "Trẻ em", key: "children" as const, min: 0, max: 6 },
            ].map(({ label, key, min, max }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() =>
                      setParams({
                        [key]: Math.max(min, params[key] - 1),
                        page: DEFAULT_PAGE,
                      })
                    }
                    disabled={params[key] <= min}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-5 text-center text-sm font-medium">
                    {params[key]}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() =>
                      setParams({
                        [key]: Math.min(max, params[key] + 1),
                        page: DEFAULT_PAGE,
                      })
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
            className="w-full mt-3"
            onClick={() => setGuestOpen(false)}
          >
            Xác nhận
          </Button>
        </PopoverContent>
      </Popover>

      <Button size="sm" className="rounded-lg px-4 gap-1.5 shrink-0">
        <Search className="w-3.5 h-3.5" />
        Tìm
      </Button>
    </div>
  );
}
