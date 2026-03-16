"use client";

import { useEffect, useRef } from "react";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateShort, formatCurrencyUSD } from "@/lib/utils";

const CONFETTI_COLORS = [
  "#b89a6f",
  "#c9a87c",
  "#8c7355",
  "#d4b896",
  "#6b563e",
  "#e0cdb0",
  "#a0845c",
  "#f0e0c8",
];

type ConfettiShape = "rect" | "circle" | "ribbon";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: ConfettiShape;
};

const spawnBurst = (canvas: HTMLCanvasElement, count: number): Particle[] =>
  Array.from({ length: count }, () => {
    const side = Math.random() < 0.5 ? canvas.width * 0.2 : canvas.width * 0.8;
    return {
      x: side,
      y: -10,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * 4 + 2,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      width: Math.random() * 8 + 4,
      height: Math.random() * 14 + 6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.22,
      opacity: 1,
      shape: (["rect", "circle", "ribbon"] as ConfettiShape[])[
        Math.floor(Math.random() * 3)
      ],
    };
  });

const useConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles: Particle[] = [];
    particles.push(...spawnBurst(canvas, 130));
    const t2 = setTimeout(() => particles.push(...spawnBurst(canvas, 90)), 350);
    const t3 = setTimeout(() => particles.push(...spawnBurst(canvas, 70)), 750);

    let rafId: number;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.opacity > 0);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.13;
        p.vx *= 0.992;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height * 0.55) p.opacity -= 0.022;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.beginPath();
          ctx.moveTo(-p.width / 2, -p.height / 2);
          ctx.quadraticCurveTo(p.width / 2, 0, -p.width / 2, p.height / 2);
          ctx.quadraticCurveTo(p.width / 2, 0, -p.width / 2, -p.height / 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }
        ctx.restore();
      }

      if (particles.length > 0) rafId = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return canvasRef;
};

interface ConfirmationClientProps {
  bookingRef: string;
}

export const ConfirmationClient = ({ bookingRef }: ConfirmationClientProps) => {
  const { data: booking, isLoading } = useBookingConfirmation(bookingRef);
  const canvasRef = useConfetti();

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
        <div className="text-center space-y-3 py-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Đặt phòng thành công!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Email xác nhận đã được gửi đến{" "}
              <span className="font-medium text-foreground">
                {booking.guestEmail}
              </span>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
            <span className="text-xs text-muted-foreground">Mã đặt phòng</span>
            <span className="font-mono font-bold tracking-wider text-sm text-foreground">
              {booking.bookingRef}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <StatusBadge status={booking.status} type="booking" />
          <StatusBadge status={booking.payments[0].status} type="payment" />
        </div>

        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
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
        </div>

        <div className="rounded-2xl bg-muted/40 border border-border p-4 space-y-3">
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
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
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
        </div>
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
