"use client";

import { useQueryStates } from "nuqs";
import { HotelsSearchBar } from "./hotels-search-bar";
import { HotelsFilterSidebar } from "./hotels-filter-sidebar";
import { HotelsSortBar } from "./hotels-sort-bar";
import { HotelsList } from "./hotels-list";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { useHotelSearch } from "@/hooks/client/use-hotels";
import { hotelSearchParsers } from "@/lib/search-params/hotel-search";

export const HotelsClient = () => {
  const [params] = useQueryStates(hotelSearchParsers);
  const { data } = useHotelSearch(params);

  const totalCount = data?.pages[0]
    ? data.pages.flatMap((p) => p.items).length
    : undefined;

  return (
    <div className="min-h-screen">
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <HotelsSearchBar />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="box-hidden w-56 shrink-0">
            <div className="sticky top-36">
              <HotelsFilterSidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center gap-3">
              <MobileFilterDrawer />
              <div className="flex-1">
                <HotelsSortBar total={totalCount} />
              </div>
            </div>

            <HotelsList />
          </div>
        </div>
      </div>
    </div>
  );
};
