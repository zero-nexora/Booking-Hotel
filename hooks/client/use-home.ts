"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useFeaturedHotels() {
  const trpc = useTRPC();
  return useQuery(trpc.client.hotel.featured.queryOptions());
}

export function usePopularDestinations() {
  const trpc = useTRPC();
  return useQuery(trpc.client.hotel.popularDestinations.queryOptions());
}

export function useTopAmenities() {
  const trpc = useTRPC();
  return useQuery(trpc.client.hotel.topAmenities.queryOptions());
}

export function useHighlightedReviews() {
  const trpc = useTRPC();
  return useQuery(trpc.client.hotel.highlightedReviews.queryOptions());
}
