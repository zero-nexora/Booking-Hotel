"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface LoadMoreTriggerProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const LoadMoreTrigger = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: LoadMoreTriggerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage)
        fetchNextPage();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div ref={ref} className="flex justify-center py-6">
      {isFetchingNextPage && (
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
