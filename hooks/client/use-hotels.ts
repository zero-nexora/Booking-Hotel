"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { HotelSearchParams } from "@/lib/search-params/hotel-search";
import { useTRPC } from "@/trpc/client";

export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
) {
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

  return ref;
}

/* ── Featured hotels (trang chủ) ── */
export function useFeaturedHotels() {
  const trpc = useTRPC();
  return useQuery(trpc.client.hotel.featured.queryOptions());
}

/* ── Danh sách infinite scroll ── */
export function useHotelList(params: Partial<HotelSearchParams> = {}) {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.client.hotel.list.infiniteQueryOptions(
      {
        limit: 12,
        cityId: params.cityId ?? undefined,
        countryId: params.countryId ?? undefined,
        cityName: params.cityName ?? undefined,
        checkIn: params.checkIn ?? undefined,
        checkOut: params.checkOut ?? undefined,
        guests: params.guests ?? undefined,
        minPrice: params.minPrice ?? undefined,
        maxPrice: params.maxPrice ?? undefined,
        amenityIds: params.amenityIds ?? undefined,
        starRating: params.starRating ?? undefined,
      },
      { getNextPageParam: (last) => last.nextCursor, initialCursor: null },
    ),
  );
}

/* ── Chi tiết khách sạn ── */
export function useHotelDetail(slug: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.client.hotel.detail.queryOptions({ slug }, { enabled: !!slug }),
  );
}

/* ── Đánh giá infinite scroll ── */
export function useHotelReviews(hotelId: string) {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.client.hotel.reviews.infiniteQueryOptions(
      { hotelId, limit: 10 },
      {
        getNextPageParam: (last) => last.nextCursor,
        initialCursor: null,
        enabled: !!hotelId,
      },
    ),
  );
}

/* ── Địa điểm cho search bar ── */
export function useLocations() {
  const trpc = useTRPC();
  return useQuery(trpc.client.hotel.locations.queryOptions());
}
