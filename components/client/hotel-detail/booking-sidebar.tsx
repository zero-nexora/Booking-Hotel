"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  calcNights,
  cn,
  formatCurrencyUSD,
  formatDateShort,
  toDateParam,
} from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface BookingSidebarProps {
  minPrice: number | null;
  defaultCheckIn?: Date;
  defaultCheckOut?: Date;
  defaultAdults?: number;
  defaultChildren?: number;
}

export const BookingSidebar = ({
  minPrice,
  defaultCheckIn,
  defaultCheckOut,
  defaultAdults = 2,
  defaultChildren = 0,
}: BookingSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [checkIn, setCheckIn] = useState<Date | undefined>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(defaultCheckOut);
  const [adults, setAdults] = useState(defaultAdults);
  const [children, setChildren] = useState(defaultChildren);
  const [guestOpen, setGuestOpen] = useState(false);

  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : null;
  const totalPrice = minPrice && nights ? minPrice * nights : null;

  const updateUrlDates = useCallback(
    (cin?: Date, cout?: Date) => {
      const params = new URLSearchParams(window.location.search);
      if (cin) params.set("checkIn", toDateParam(cin));
      else params.delete("checkIn");
      if (cout) params.set("checkOut", toDateParam(cout));
      else params.delete("checkOut");
      params.set("adults", String(adults));
      params.set("children", String(children));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [adults, children, pathname, router],
  );

  const scrollToRooms = () => {
    const el = document.getElementById("available-rooms");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
    >
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-none">
        {minPrice && (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrencyUSD(minPrice)}
              </span>
              <span className="text-sm text-muted-foreground">/đêm</span>
            </div>
            <p className="text-xs text-muted-foreground">Giá từ</p>
          </div>
        )}

        <Separator className="bg-border" />

        <div className="rounded-xl border border-border overflow-hidden">
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted text-left border-b border-border">
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
                    {checkIn ? formatDateShort(checkIn) : "Chọn ngày"}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-card border-border"
              align="start"
            >
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
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted text-left">
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
                    {checkOut ? formatDateShort(checkOut) : "Chọn ngày"}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-card border-border"
              align="start"
            >
              <CalendarUI
                mode="single"
                selected={checkOut}
                onSelect={(d) => {
                  setCheckOut(d);
                  updateUrlDates(checkIn, d);
                }}
                disabled={(date) => date <= (checkIn ?? new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Popover open={guestOpen} onOpenChange={setGuestOpen}>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border hover:bg-muted text-left">
              <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Khách
                </p>
                <p className="text-sm font-medium text-foreground">
                  {adults} người lớn{children > 0 ? `, ${children} trẻ em` : ""}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-4 bg-card border-border"
            align="start"
          >
            <div className="space-y-3">
              {[
                {
                  label: "Người lớn",
                  min: 1,
                  max: 10,
                  value: adults,
                  set: setAdults,
                },
                {
                  label: "Trẻ em",
                  min: 0,
                  max: 6,
                  value: children,
                  set: setChildren,
                },
              ].map(({ label, min, max, value, set }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full border-border text-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => set(Math.max(min, value - 1))}
                      disabled={value <= min}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-5 text-center text-sm font-medium text-foreground">
                      {value}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full border-border text-foreground hover:bg-muted hover:text-foreground"
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
              className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setGuestOpen(false)}
            >
              Xác nhận
            </Button>
          </PopoverContent>
        </Popover>

        <AnimatePresence mode="wait">
          {totalPrice && nights && (
            <motion.div
              key={`${nights}-${totalPrice}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-xl bg-muted/40 border border-border p-3 space-y-1.5 text-sm"
            >
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {formatCurrencyUSD(minPrice || 0)} x {nights} đêm
                </span>
                <span>{formatCurrencyUSD(totalPrice)}</span>
              </div>
              <Separator className="bg-border" />
              <div className="flex justify-between font-semibold text-foreground">
                <span>Tổng cộng</span>
                <span>{formatCurrencyUSD(totalPrice)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
          onClick={scrollToRooms}
        >
          Xem phòng trống
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Bạn chưa bị tính phí cho đến khi xác nhận
        </p>
      </Card>
    </motion.div>
  );
};
