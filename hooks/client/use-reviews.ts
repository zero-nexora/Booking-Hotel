"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

export function useCreateReview(bookingRef: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.client.review.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: trpc.client.booking.detail.queryOptions({ bookingRef })
            .queryKey,
        });
        toast.success("Đánh giá đã gửi, đang chờ duyệt");
        router.push(`/account/bookings/${bookingRef}`);
      },
      onError: (err) => toast.error(err.message ?? "Gửi đánh giá thất bại"),
    }),
  );
}
