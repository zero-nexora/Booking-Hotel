"use client";

import { Loader2 } from "lucide-react";
import {
  useInfiniteScroll,
  type UseInfiniteScrollOptions,
} from "@/hooks/use-infinity-scroll";

export const LoadMoreTrigger = (props: UseInfiniteScrollOptions) => {
  const { sentinelRef } = useInfiniteScroll(props);

  return (
    <div ref={sentinelRef} className="flex justify-center py-6">
      {props.isFetchingNextPage && (
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
