"use client";

import { useQueryStates } from "nuqs";
import { SearchX } from "lucide-react";
import { useHotelSearch } from "@/hooks/client/use-hotels";
import { HotelCard } from "./hotel-card";
import { Skeleton } from "@/components/ui/skeleton";
import { calcNights, cn } from "@/lib/utils";
import { hotelSearchParsers } from "@/lib/search-params/hotel-search";
import { HotelsMapView } from "./hotel-map-view";
import { LoadMoreTrigger } from "@/components/shared/load-more-trigger";

export const HotelsList = () => {
  const [params] = useQueryStates(hotelSearchParsers);

  const nights =
    params.checkIn && params.checkOut
      ? calcNights(params.checkIn, params.checkOut)
      : 1;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useHotelSearch(params);

  const hotels = data?.pages.flatMap((p) => p.items) ?? [];
  const view = (params.view ?? "list") as "list" | "grid" | "map";

  if (isLoading) {
    if (view === "map") {
      return (
        <Skeleton
          className="rounded-2xl bg-muted"
          style={{ height: "calc(100vh - 220px)", minHeight: 480 }}
        />
      );
    }
    return (
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            : "space-y-3"
        }
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "bg-muted",
              view === "grid" ? "h-72 rounded-2xl" : "h-36 rounded-2xl",
            )}
          />
        ))}
      </div>
    );
  }

  if (!hotels.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <SearchX className="w-10 h-10 text-muted-foreground" />
        <p className="font-medium text-foreground">
          Không tìm thấy khách sạn phù hợp
        </p>
        <p className="text-sm text-muted-foreground">
          Thử điều chỉnh bộ lọc hoặc thay đổi điểm đến
        </p>
      </div>
    );
  }

  if (view === "map") {
    return <HotelsMapView hotels={hotels as never} />;
  }

  return (
    <div>
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            : "space-y-3"
        }
      >
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel as never}
            view={view}
            nights={nights}
          />
        ))}
      </div>

      <LoadMoreTrigger
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      {!hasNextPage && hotels.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          Đã hiển thị tất cả {hotels.length} khách sạn
        </p>
      )}
    </div>
  );
};
