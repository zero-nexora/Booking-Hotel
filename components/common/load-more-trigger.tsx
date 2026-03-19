"use client";

import { Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface LoadMoreTriggerProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  rootMargin?: string;
  threshold?: number;
}

export const LoadMoreTrigger = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = "200px",
  threshold = 0,
}: LoadMoreTriggerProps) => {
  const { ref } = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: false,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  return (
    <div ref={ref} className="flex justify-center py-6">
      {isFetchingNextPage && (
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
