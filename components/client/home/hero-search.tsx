"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function HeroSearch() {
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
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    params.set("adults", String(adults));
    params.set("children", String(children));
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto">
      <div className="bg-background/95 backdrop-blur-sm border rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-xl">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl hover:bg-muted transition-colors">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <Input
            placeholder="Điểm đến..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 text-sm font-medium placeholder:text-muted-foreground"
          />
        </div>

        <div className="hidden md:block w-px bg-border self-stretch my-2" />

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-left">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Nhận phòng</p>
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    !checkIn && "text-muted-foreground",
                  )}
                >
                  {checkIn ? format(checkIn, "dd/MM/yyyy") : "Chọn ngày"}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarUI
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px bg-border self-stretch my-2" />

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-left">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Trả phòng</p>
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    !checkOut && "text-muted-foreground",
                  )}
                >
                  {checkOut ? format(checkOut, "dd/MM/yyyy") : "Chọn ngày"}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarUI
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date < (checkIn ?? new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px bg-border self-stretch my-2" />

        <Popover open={guestOpen} onOpenChange={setGuestOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-left">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Khách</p>
                <p className="text-sm font-medium">
                  {adults} người lớn{children > 0 ? `, ${children} trẻ em` : ""}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-4">
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
                sublabel="0–12 tuổi"
                value={children}
                min={0}
                max={6}
                onChange={setChildren}
              />
            </div>
            <Button
              size="sm"
              className="w-full mt-4"
              onClick={() => setGuestOpen(false)}
            >
              Xác nhận
            </Button>
          </PopoverContent>
        </Popover>

        <Button
          size="lg"
          className="rounded-xl px-6 gap-2 shrink-0"
          onClick={handleSearch}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Tìm kiếm</span>
        </Button>
      </div>
    </div>
  );
}

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
        <span className="w-6 text-center text-sm font-medium">{value}</span>
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
