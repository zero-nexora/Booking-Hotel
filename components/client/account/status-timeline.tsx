"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

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

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

interface StatusTimelineProps {
  status: BookingStatus;
}

export const StatusTimeline = ({ status }: StatusTimelineProps) => {
  const currentOrder = STATUS_ORDER[status];
  const isCancelled = status === "CANCELLED" || status === "NO_SHOW";

  if (isCancelled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
      >
        <Circle className="w-4 h-4" />
        {status === "CANCELLED" ? "Đặt phòng đã bị huỷ" : "Không đến (No-show)"}
      </motion.div>
    );
  }

  return (
    <div className="flex items-start gap-0">
      {STEPS.map((step, i) => {
        const stepOrder = STATUS_ORDER[step.status];
        const done = currentOrder > stepOrder;
        const active = currentOrder === stepOrder;
        const isLast = i === STEPS.length - 1;
        const delay = i * 0.12;

        return (
          <div key={step.status} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {i !== 0 && (
                <div className="flex-1 h-0.5 bg-border overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full",
                      done || active ? "bg-primary" : "bg-transparent",
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: done || active ? "100%" : "0%" }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: delay - 0.06,
                    }}
                  />
                </div>
              )}
              {i === 0 && <div className="flex-1 invisible h-0.5" />}

              <motion.div
                variants={nodeVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay }}
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
              </motion.div>

              {!isLast ? (
                <div className="flex-1 h-0.5 bg-border overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full",
                      done ? "bg-primary" : "bg-transparent",
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: delay + 0.06,
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1 invisible h-0.5" />
              )}
            </div>

            <motion.div
              variants={labelVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: delay + 0.1 }}
              className="mt-2 text-center px-1"
            >
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
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
