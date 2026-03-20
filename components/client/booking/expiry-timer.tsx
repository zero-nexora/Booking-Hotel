"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ExpiryTimerProps {
  expiresAt: Date;
  onExpire?: () => void;
}

export const ExpiryTimer = ({ expiresAt, onExpire }: ExpiryTimerProps) => {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)),
  );

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          onExpire?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining < 120;
  const expired = remaining === 0;

  if (expired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 text-sm"
      >
        <AlertCircle className="w-4 h-4 shrink-0" />
        <p className="font-medium">
          Phiên đặt phòng đã hết hạn. Vui lòng thử lại.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-2 rounded-xl px-4 py-3 text-sm border",
        urgent
          ? "bg-secondary border-border text-secondary-foreground"
          : "bg-muted border-border text-muted-foreground",
      )}
    >
      <Clock className={cn("w-4 h-4 shrink-0", urgent && "text-primary")} />
      <p>
        Phòng được giữ trong{" "}
        <AnimatePresence mode="wait">
          <motion.span
            key={`${mins}-${secs}`}
            initial={urgent ? { opacity: 0.4, scale: 0.95 } : { opacity: 1 }}
            animate={
              urgent
                ? {
                    opacity: [0.4, 1, 0.4],
                    scale: [0.95, 1.05, 0.95],
                  }
                : { opacity: 1, scale: 1 }
            }
            transition={
              urgent
                ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
            className={cn(
              "font-bold tabular-nums inline-block",
              urgent ? "text-primary" : "text-foreground",
            )}
          >
            {mins}:{String(secs).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        . Hoàn tất thanh toán trước khi hết giờ.
      </p>
    </motion.div>
  );
};
