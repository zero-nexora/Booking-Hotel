"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: "xs" | "sm" | "md";
  max?: number;
}

const SIZE_MAP = { xs: "w-3 h-3", sm: "w-4 h-4", md: "w-5 h-5" };

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "sm",
  max = 5,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value;
        return (
          <Star
            key={i}
            className={cn(
              SIZE_MAP[size],
              filled
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/30",
              !readonly &&
                "cursor-pointer hover:text-amber-400 transition-colors",
            )}
            onClick={() => !readonly && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
