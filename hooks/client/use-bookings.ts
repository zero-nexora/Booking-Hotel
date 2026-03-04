"use client";

import { BookingStatus } from "@/generated/prisma/enums";
import { useTRPC } from "@/trpc/client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateBooking() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.client.booking.create.mutationOptions({
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: trpc.client.booking.list.queryKey() }),
      onError: (err) => toast.error(err.message ?? "Đặt phòng thất bại"),
    }),
  );
}

export function useBookingList(status?: BookingStatus) {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.client.booking.list.infiniteQueryOptions(
      { limit: 10, status },
      { getNextPageParam: (last) => last.nextCursor, initialCursor: null },
    ),
  );
}

export function useBookingDetail(bookingRef: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.client.booking.detail.queryOptions(
      { bookingRef },
      { enabled: !!bookingRef },
    ),
  );
}

export function useCancelBooking() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.client.booking.cancel.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.client.booking.list.queryKey() });
        // bookingId ≠ bookingRef nên invalidate tất cả booking detail
        qc.invalidateQueries({
          queryKey: trpc.client.booking.detail.queryKey() as any,
        });
        toast.success("Đã hủy đặt phòng");
      },
      onError: (err) => toast.error(err.message ?? "Hủy thất bại"),
    }),
  );
}
