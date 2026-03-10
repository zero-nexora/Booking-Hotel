"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { HotelSearchParams } from "@/lib/search-params/hotel-search";

export function useHotelSearch(params: HotelSearchParams) {
  const trpc = useTRPC();

  return useInfiniteQuery(
    trpc.client.hotel.search.infiniteQueryOptions(
      {
        city: params.city || undefined,
        country: params.country || undefined,
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
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialCursor: undefined,
      },
    ),
  );
}

export function useHotelDetail(slug: string, checkIn?: Date, checkOut?: Date) {
  const trpc = useTRPC();
  return useQuery(
    trpc.client.hotel.detail.queryOptions(
      { slug, checkIn, checkOut },
      { enabled: !!slug },
    ),
  );
}

export function useHotelReviews(hotelId: string) {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.client.hotel.reviews.infiniteQueryOptions(
      { hotelId, limit: 10 },
      {
        getNextPageParam: (last) => last.nextCursor ?? null,
        initialCursor: null,
        enabled: !!hotelId,
      },
    ),
  );
}

export function useHotelFilterOptions() {
  const trpc = useTRPC();
  return useQuery(trpc.client.hotel.filterOptions.queryOptions());
}
