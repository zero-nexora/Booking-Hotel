"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useBedTypeList() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.bedType.list.queryOptions());
}

export function useCreateBedType() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.bedType.create.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.bedType.list.queryKey() });
        toast.success(`Đã tạo loại giường "${data.name}"`);
      },
      onError: (err) => toast.error(err.message ?? "Tạo loại giường thất bại"),
    }),
  );
}

export function useUpdateBedType() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.bedType.update.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.bedType.list.queryKey() });
        toast.success(`Đã đổi tên thành "${data.name}"`);
      },
      onError: (err) =>
        toast.error(err.message ?? "Cập nhật loại giường thất bại"),
    }),
  );
}

export function useDeleteBedType() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.bedType.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.bedType.list.queryKey() });
        toast.success("Đã xóa loại giường");
      },
      onError: (err) => toast.error(err.message ?? "Xóa loại giường thất bại"),
    }),
  );
}
