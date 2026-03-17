import { HotelsClient } from "@/components/client/hotels/hotel-client";
import { hotelSearchCache } from "@/lib/search-params/hotel-search";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

interface HotelsPageProps {
  searchParams: Promise<SearchParams>;
}

const HotelsPage = async ({ searchParams }: HotelsPageProps) => {
  const queryClient = getQueryClient();
  const params = await hotelSearchCache.parse(searchParams);

  void Promise.all([
    queryClient.prefetchInfiniteQuery(
      trpc.client.hotel.search.infiniteQueryOptions(
        {
          search: params.search || undefined,
          checkIn: params.checkIn ?? undefined,
          checkOut: params.checkOut ?? undefined,
          adults: params.adults,
          children: params.children,
          minPrice: params.minPrice ?? undefined,
          maxPrice: params.maxPrice ?? undefined,
          stars: params.stars?.length ? params.stars : undefined,
          amenities: params.amenities?.length ? params.amenities : undefined,
          bedTypes: params.bedTypes?.length ? params.bedTypes : undefined,
          roomTypes: params.roomTypes?.length ? params.roomTypes : undefined,
          minRating: params.minRating ?? undefined,
          sort:
            (params.sort as "price_asc" | "price_desc" | "rating" | "stars") ??
            "price_asc",
          limit: params.limit,
        },
        {
          getNextPageParam: (last: { nextCursor: any }) =>
            last.nextCursor ?? null,
          initialCursor: null,
        },
      ),
    ),
    queryClient.prefetchQuery(trpc.client.hotel.filterOptions.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HotelsClient />
    </HydrationBoundary>
  );
};

export default HotelsPage;
