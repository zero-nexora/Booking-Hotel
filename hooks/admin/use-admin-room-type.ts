"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRoomTypeList() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.roomType.list.queryOptions());
}

export function useCreateRoomType() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.roomType.create.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.roomType.list.queryKey() });
        toast.success(`Đã tạo loại phòng "${data.name}"`);
      },
      onError: (err) => toast.error(err.message ?? "Tạo loại phòng thất bại"),
    }),
  );
}

export function useUpdateRoomType() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.roomType.update.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.roomType.list.queryKey() });
        toast.success(`Đã đổi tên thành "${data.name}"`);
      },
      onError: (err) =>
        toast.error(err.message ?? "Cập nhật loại phòng thất bại"),
    }),
  );
}

export function useDeleteRoomType() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.roomType.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.roomType.list.queryKey() });
        toast.success("Đã xóa loại phòng");
      },
      onError: (err) => toast.error(err.message ?? "Xóa loại phòng thất bại"),
    }),
  );
}
