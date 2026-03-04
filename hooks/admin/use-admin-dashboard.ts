"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useDashboardStats() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.dashboard.stats.queryOptions());
}

export function useDashboardRevenueChart() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.dashboard.revenueChart.queryOptions());
}

export function useDashboardBookingStatusChart() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.dashboard.bookingStatusChart.queryOptions());
}

export function useDashboardTopHotels() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.dashboard.topHotels.queryOptions());
}

export function useDashboardRecentBookings() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.dashboard.recentBookings.queryOptions());
}
