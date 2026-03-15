"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center gap-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 text-sm">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <p className="font-medium">
          Phiên đặt phòng đã hết hạn. Vui lòng thử lại.
        </p>
      </div>
    );
  }

  return (
    <div
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
        <span
          className={cn(
            "font-bold tabular-nums",
            urgent ? "text-primary" : "text-foreground",
          )}
        >
          {mins}:{String(secs).padStart(2, "0")}
        </span>
        . Hoàn tất thanh toán trước khi hết giờ.
      </p>
    </div>
  );
};
