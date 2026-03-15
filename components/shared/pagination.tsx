"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-border">
      <div className="text-sm text-muted-foreground">
        {from}-{to} / {total} kết quả
      </div>
      <div className="flex items-center gap-4">
        {onLimitChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hidden sm:inline">
              Hiển thị
            </span>
            <Select
              value={String(limit)}
              onValueChange={(v) => onLimitChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-20 border-border bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {[10, 20, 50, 100].map((v) => (
                  <SelectItem
                    key={v}
                    value={String(v)}
                    className="text-foreground hover:bg-muted"
                  >
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className={
                    p === page
                      ? "h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                      : "h-8 w-8 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
