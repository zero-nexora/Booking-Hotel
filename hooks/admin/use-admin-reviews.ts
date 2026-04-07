"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { AdminReviewParams } from "@/lib/search-params/admin-reviews";

export function useAdminReviewList(
  params: AdminReviewParams & { hotelId?: string },
) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.review.list.queryOptions({
      page: params.page,
      limit: params.limit,
      status: params.status || undefined,
      hotelId: params.hotelId || undefined,
      search: params.search || undefined,
    }),
  );
}

export function useUpdateReviewStatus() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.review.updateStatus.mutationOptions({
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: trpc.admin.review.list.queryKey() });
        qc.invalidateQueries({
          queryKey: trpc.admin.dashboard.stats.queryKey(),
        });
        toast.success(
          vars.status === "APPROVED"
            ? "Đã duyệt đánh giá"
            : "Đã từ chối đánh giá",
        );
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật thất bại"),
    }),
  );
}
