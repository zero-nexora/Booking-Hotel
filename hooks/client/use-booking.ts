"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { AccountBookingParams } from "@/lib/search-params/booking-search";

export function useCreateBookingIntent() {
  const trpc = useTRPC();
  return useMutation(
    trpc.client.booking.createIntent.mutationOptions({
      onError: (err) => toast.error(err.message ?? "Không thể tạo đặt phòng"),
    }),
  );
}

export function useConfirmPayment() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.client.booking.confirmPayment.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["booking"] });
      },
      onError: (err) =>
        toast.error(err.message ?? "Xác nhận thanh toán thất bại"),
    }),
  );
}

export function useBookingConfirmation(bookingRef: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.client.booking.getConfirmation.queryOptions(
      { bookingRef },
      { enabled: !!bookingRef },
    ),
  );
}

export function useMyBookings(params: AccountBookingParams) {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.client.booking.myBookings.infiniteQueryOptions(
      {
        status: params.status ?? undefined,
        limit: 10,
      },
      {
        getNextPageParam: (last) => last.nextCursor ?? undefined,
        initialCursor: undefined,
      },
    ),
  );
}

export function useBookingDetail(bookingRef: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.client.booking.bookingDetail.queryOptions(
      { bookingRef },
      { enabled: !!bookingRef },
    ),
  );
}

export function useCancelBooking(bookingRef: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.client.booking.cancel.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: trpc.client.booking.myBookings.queryKey(),
        });
        qc.invalidateQueries({
          queryKey: trpc.client.booking.bookingDetail.queryKey({ bookingRef }),
        });
        toast.success("Huỷ đặt phòng thành công");
      },
      onError: (err) => toast.error(err.message ?? "Huỷ thất bại"),
    }),
  );
}

export function useQuickStats() {
  const trpc = useTRPC();
  return useQuery(trpc.client.booking.quickStats.queryOptions());
}

export function useRecentBookings() {
  const trpc = useTRPC();
  return useQuery(trpc.client.booking.recentBookings.queryOptions());
}
