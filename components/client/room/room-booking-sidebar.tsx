"use client";

import Link from "next/link";
import { CalendarDays, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateShort, formatCurrencyUSD } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RoomBookingSidebarProps {
  price: number;
  nights: number | null;
  hasDates: boolean;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  childrenCount: number;
  isAvailable: boolean;
  bookingUrl: string | null;
  hotelSlug: string;
}

export const RoomBookingSidebar = ({
  price,
  nights,
  hasDates,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  isAvailable,
  bookingUrl,
  hotelSlug,
}: RoomBookingSidebarProps) => (
  <TooltipProvider>
    <div className="sticky top-24">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
      >
        <Card className="rounded-2xl border border-border shadow-none p-5">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrencyUSD(price)}
              </span>
              <span className="text-sm text-muted-foreground">/đêm</span>
            </div>
            {nights && nights > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                ≈ {formatCurrencyUSD(price * nights)} · {nights} đêm
              </p>
            )}
          </div>

          {hasDates && checkIn && checkOut && (
            <div className="rounded-xl border border-border divide-y divide-border text-sm">
              <div className="flex items-center gap-2 px-3 py-2.5">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Nhận phòng</p>
                  <p className="font-medium text-foreground">
                    {formatDateShort(checkIn)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Trả phòng</p>
                  <p className="font-medium text-foreground">
                    {formatDateShort(checkOut)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Khách</p>
                  <p className="font-medium text-foreground">
                    {adults} người lớn
                    {childrenCount > 0 ? `, ${childrenCount} trẻ em` : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator className="bg-border" />

          <AnimatePresence mode="wait">
            {bookingUrl && isAvailable ? (
              <motion.div
                key="available"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Button
                  className="w-full rounded-xl gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <Link href={bookingUrl}>
                    Đặt phòng ngay <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            ) : bookingUrl && !isAvailable ? (
              <motion.div
                key="unavailable"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Button className="w-full rounded-xl" disabled>
                  Hết phòng trong thời gian này
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="no-dates"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block w-full">
                      <Button
                        className="w-full rounded-xl pointer-events-none"
                        disabled
                      >
                        <CalendarDays className="w-4 h-4 mr-1.5" />
                        Chọn ngày để đặt phòng
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card border-border text-foreground">
                    Vui lòng chọn ngày check-in và check-out
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-border text-foreground hover:bg-muted hover:text-foreground"
                  asChild
                >
                  <Link href={`/hotels/${hotelSlug}`}>
                    Chọn ngày tại trang khách sạn
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground text-center">
            Miễn phí huỷ trong 24h sau khi đặt
          </p>
        </Card>
      </motion.div>
    </div>
  </TooltipProvider>
);
