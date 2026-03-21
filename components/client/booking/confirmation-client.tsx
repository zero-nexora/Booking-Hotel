"use client";

import Link from "next/link";
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
  User,
  Mail,
  Phone,
  BedDouble,
  Home,
  BookOpen,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingConfirmation } from "@/hooks/client/use-booking";
import { BookingPrint } from "./booking-print";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDateShort, formatCurrencyUSD } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";
import { motion, Variants } from "framer-motion";

interface ConfirmationClientProps {
  bookingRef: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const ConfirmationClient = ({ bookingRef }: ConfirmationClientProps) => {
  const { data: booking, isLoading } = useBookingConfirmation(bookingRef);
  const enable = !isLoading && booking?.payments[0].status === "PAID";
  const canvasRef = useConfetti(enable);

  if (isLoading) return <ConfirmationSkeleton />;
  if (!booking) return null;

  const item = booking.items[0];
  const nights = item?.nights ?? 0;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <motion.div
          className="text-center space-y-3 py-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: 0.05,
            }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-primary" />
            </div>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Đặt phòng thành công!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Email xác nhận đã được gửi đến{" "}
              <span className="font-medium text-foreground">
                {booking.guestEmail}
              </span>
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            className="inline-flex items-center gap-2 bg-muted rounded-xl px-4 py-2"
          >
            <span className="text-xs text-muted-foreground">Mã đặt phòng</span>
            <span className="font-mono font-bold tracking-wider text-sm text-foreground">
              {booking.bookingRef}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-2 flex-wrap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
        >
          <StatusBadge status={booking.status} type="booking" />
          <StatusBadge status={booking.payments[0].status} type="payment" />
        </motion.div>

        <motion.div
          className="rounded-2xl border border-border bg-card divide-y divide-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.55 }}
        >
          <div className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Khách sạn
            </p>
            <p className="font-semibold text-foreground">
              {booking.hotel.name}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>
                {booking.hotel.address.street},{" "}
                {booking.hotel.address.city.name},{" "}
                {booking.hotel.address.city.country.name}
              </span>
            </div>
          </div>

          {item && (
            <div className="p-4 space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Phòng
              </p>
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">
                  {item.room.name}
                </span>
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground"
                >
                  {item.room.roomType.name}
                </Badge>
              </div>
            </div>
          )}

          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Nhận phòng
              </p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {formatDateShort(booking.checkIn)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Trả phòng
              </p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {formatDateShort(booking.checkOut)}
                </span>
              </div>
            </div>
            <div className="col-span-2 text-xs text-muted-foreground">
              {nights} đêm · {item?.adults} người lớn
              {(item?.children ?? 0) > 0 ? `, ${item.children} trẻ em` : ""}
            </div>
          </div>

          <div className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Khách lưu trú
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-foreground">{booking.guestName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {booking.guestEmail}
                </span>
              </div>
              {booking.guestPhone && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {booking.guestPhone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {booking.specialRequests && (
            <div className="p-4 space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Yêu cầu đặc biệt
              </p>
              <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p>{booking.specialRequests}</p>
              </div>
            </div>
          )}

          <div className="p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Tổng thanh toán
            </p>
            <p className="text-lg font-bold text-primary">
              {formatCurrencyUSD(Number(booking.totalAmount))}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-muted/40 border border-border p-4 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
        >
          <p className="text-sm font-semibold text-foreground">
            Bước tiếp theo
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
              <p>Email xác nhận đã được gửi — kiểm tra hộp thư của bạn.</p>
            </div>
            {booking.hotel.policy && (
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                <p>
                  Check-in từ{" "}
                  <span className="font-medium text-foreground">
                    {booking.hotel.policy.checkInTime}
                  </span>
                  , check-out trước{" "}
                  <span className="font-medium text-foreground">
                    {booking.hotel.policy.checkOutTime}
                  </span>
                  .
                </p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
              <p>
                Mang theo mã đặt phòng{" "}
                <span className="font-mono font-bold text-foreground">
                  {booking.bookingRef}
                </span>{" "}
                khi đến check-in.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.85 }}
        >
          <Button
            className="flex-1 rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/account/bookings">
              <BookOpen className="w-4 h-4" />
              Xem đặt phòng của tôi
            </Link>
          </Button>
          <BookingPrint booking={booking} />
          <Button
            variant="ghost"
            className="rounded-xl gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
            asChild
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

const ConfirmationSkeleton = () => (
  <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
    <div className="flex flex-col items-center gap-3">
      <Skeleton className="w-16 h-16 rounded-full bg-muted" />
      <Skeleton className="h-8 w-64 bg-muted" />
      <Skeleton className="h-4 w-48 bg-muted" />
      <Skeleton className="h-10 w-40 rounded-xl bg-muted" />
    </div>
    <Skeleton className="h-64 rounded-2xl bg-muted" />
    <Skeleton className="h-32 rounded-2xl bg-muted" />
    <div className="flex gap-3">
      <Skeleton className="h-11 flex-1 rounded-xl bg-muted" />
      <Skeleton className="h-11 w-32 rounded-xl bg-muted" />
      <Skeleton className="h-11 w-32 rounded-xl bg-muted" />
    </div>
  </div>
);
