"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { calcNights, cn } from "@/lib/utils";

interface BookingSidebarProps {
  minPrice: number | null;
  hotelSlug: string;
  defaultCheckIn?: Date;
  defaultCheckOut?: Date;
  defaultAdults?: number;
  defaultChildren?: number;
}

export function BookingSidebar({
  minPrice,
  hotelSlug,
  defaultCheckIn,
  defaultCheckOut,
  defaultAdults = 2,
  defaultChildren = 0,
}: BookingSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkIn, setCheckIn] = useState<Date | undefined>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(defaultCheckOut);
  const [adults, setAdults] = useState(defaultAdults);
  const [children, setChildren] = useState(defaultChildren);
  const [guestOpen, setGuestOpen] = useState(false);

  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : null;
  const totalPrice = minPrice && nights ? minPrice * nights : null;

  const updateUrlDates = (cin?: Date, cout?: Date) => {
    const params = new URLSearchParams(window.location.search);
    if (cin) params.set("checkIn", format(cin, "yyyy-MM-dd"));
    else params.delete("checkIn");
    if (cout) params.set("checkOut", format(cout, "yyyy-MM-dd"));
    else params.delete("checkOut");
    params.set("adults", String(adults));
    params.set("children", String(children));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const scrollToRooms = () => {
    const el = document.getElementById("available-rooms");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm">
      {minPrice && (
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">${minPrice}</span>
            <span className="text-sm text-muted-foreground">/đêm</span>
          </div>
          <p className="text-xs text-muted-foreground">Giá từ</p>
        </div>
      )}

      <Separator />

      {/* Date range */}
      <div className="rounded-xl border overflow-hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted transition-colors text-left border-b">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Nhận phòng
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
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
              onSelect={(d) => {
                setCheckIn(d);
                if (d && checkOut && d >= checkOut) setCheckOut(undefined);
                updateUrlDates(d, checkOut);
              }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted transition-colors text-left">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Trả phòng
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
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
              onSelect={(d) => {
                setCheckOut(d);
                updateUrlDates(checkIn, d);
              }}
              disabled={(date) => date < (checkIn ?? new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Guests */}
      <Popover open={guestOpen} onOpenChange={setGuestOpen}>
        <PopoverTrigger asChild>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border hover:bg-muted transition-colors text-left">
            <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                Khách
              </p>
              <p className="text-sm font-medium">
                {adults} người lớn{children > 0 ? `, ${children} trẻ em` : ""}
              </p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-3">
            {[
              {
                label: "Người lớn",
                key: "adults" as const,
                min: 1,
                max: 10,
                value: adults,
                set: setAdults,
              },
              {
                label: "Trẻ em",
                key: "children" as const,
                min: 0,
                max: 6,
                value: children,
                set: setChildren,
              },
            ].map(({ label, min, max, value, set }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => set(Math.max(min, value - 1))}
                    disabled={value <= min}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-5 text-center text-sm font-medium">
                    {value}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => set(Math.min(max, value + 1))}
                    disabled={value >= max}
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

      {/* Price summary */}
      {totalPrice && nights && (
        <div className="rounded-xl bg-muted/50 p-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              ${minPrice} × {nights} đêm
            </span>
            <span>${totalPrice}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <Button className="w-full rounded-xl" size="lg" onClick={scrollToRooms}>
        Xem phòng trống
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Bạn chưa bị tính phí cho đến khi xác nhận
      </p>
    </div>
  );
}
