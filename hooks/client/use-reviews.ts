"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export function useCreateReview(bookingRef: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.client.review.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: trpc.client.booking.bookingDetail.queryKey({ bookingRef }),
        });
        qc.invalidateQueries({
          queryKey: trpc.client.review.myReviews.queryKey(),
        });
        toast.success("Đánh giá của bạn đã được gửi, chờ kiểm duyệt");
      },
      onError: (err) => toast.error(err.message ?? "Gửi đánh giá thất bại"),
    }),
  );
}

export function useMyReviews() {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.client.review.myReviews.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (last) => last.nextCursor ?? undefined,
        initialCursor: undefined,
      },
    ),
  );
}

export function useReviewForBooking(bookingRef: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.client.review.getForBooking.queryOptions(
      { bookingRef },
      { enabled: !!bookingRef },
    ),
  );
}
