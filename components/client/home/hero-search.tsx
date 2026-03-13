"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Search, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn, formatDateFull, toDateStr } from "@/lib/utils";

export const HeroSearch = () => {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestOpen, setGuestOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", toDateStr(checkIn));
    if (checkOut) params.set("checkOut", toDateStr(checkOut));
    params.set("adults", String(adults));
    params.set("children", String(children));
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Main row */}
        <div className="flex flex-col sm:flex-row">
          {/* City */}
          <div className="flex items-center gap-3 flex-1 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-border/60">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                Điểm đến
              </p>
              <Input
                placeholder="Thành phố, khách sạn..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 text-sm font-medium placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Check-in */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-border/60 hover:bg-muted/50 transition-colors text-left min-w-[140px]">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    Nhận phòng
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      !checkIn && "text-muted-foreground/60",
                    )}
                  >
                    {checkIn ? formatDateFull(checkIn) : "Chọn ngày"}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarUI
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(d) => d < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Check-out */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-border/60 hover:bg-muted/50 transition-colors text-left min-w-[140px]">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    Trả phòng
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      !checkOut && "text-muted-foreground/60",
                    )}
                  >
                    {checkOut ? formatDateFull(checkOut) : "Chọn ngày"}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarUI
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(d) => d < (checkIn ?? new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Guests */}
          <Popover open={guestOpen} onOpenChange={setGuestOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 px-4 py-3.5 border-b sm:border-b-0 hover:bg-muted/50 transition-colors text-left min-w-[130px]">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    Khách
                  </p>
                  <p className="text-sm font-medium">
                    {adults} NL{children > 0 ? `, ${children} TE` : ""}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4" align="end">
              <div className="space-y-3">
                <GuestCounter
                  label="Người lớn"
                  sublabel="Từ 13 tuổi"
                  value={adults}
                  min={1}
                  max={10}
                  onChange={setAdults}
                />
                <GuestCounter
                  label="Trẻ em"
                  sublabel="0-12 tuổi"
                  value={children}
                  min={0}
                  max={6}
                  onChange={setChildren}
                />
              </div>
              <Button
                size="sm"
                className="w-full mt-4 rounded-lg"
                onClick={() => setGuestOpen(false)}
              >
                Xác nhận
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="p-2 bg-muted/30 border-t border-border/60">
          <Button
            className="w-full rounded-xl h-10 gap-2 font-semibold text-sm"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
            Tìm kiếm khách sạn
          </Button>
        </div>
      </div>
    </div>
  );
};

function GuestCounter({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-5 text-center text-sm font-semibold">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
