"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

const STEPS: { status: BookingStatus; label: string; sublabel: string }[] = [
  {
    status: "PENDING",
    label: "Đặt phòng",
    sublabel: "Chờ xác nhận thanh toán",
  },
  { status: "CONFIRMED", label: "Xác nhận", sublabel: "Thanh toán thành công" },
  { status: "CHECKED_IN", label: "Check-in", sublabel: "Đang lưu trú" },
  {
    status: "CHECKED_OUT",
    label: "Check-out",
    sublabel: "Hoàn thành chuyến đi",
  },
];

const STATUS_ORDER: Record<BookingStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  CHECKED_IN: 2,
  CHECKED_OUT: 3,
  CANCELLED: -1,
  NO_SHOW: -1,
};

interface StatusTimelineProps {
  status: BookingStatus;
}

export const StatusTimeline = ({ status }: StatusTimelineProps) => {
  const currentOrder = STATUS_ORDER[status];
  const isCancelled = status === "CANCELLED" || status === "NO_SHOW";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
        <Circle className="w-4 h-4" />
        {status === "CANCELLED" ? "Đặt phòng đã bị huỷ" : "Không đến (No-show)"}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-0">
      {STEPS.map((step, i) => {
        const stepOrder = STATUS_ORDER[step.status];
        const done = currentOrder > stepOrder;
        const active = currentOrder === stepOrder;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.status} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div
                className={cn(
                  "flex-1 h-0.5",
                  i === 0
                    ? "invisible"
                    : done || active
                      ? "bg-primary"
                      : "bg-border",
                )}
              />

              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2",
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                      ? "bg-background border-primary text-primary"
                      : "bg-background border-border text-muted-foreground",
                )}
              >
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : active ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                )}
              </div>

              <div
                className={cn(
                  "flex-1 h-0.5",
                  isLast ? "invisible" : done ? "bg-primary" : "bg-border",
                )}
              />
            </div>

            <div className="mt-2 text-center px-1">
              <p
                className={cn(
                  "text-xs font-medium",
                  active
                    ? "text-primary"
                    : done
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {active && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {step.sublabel}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
