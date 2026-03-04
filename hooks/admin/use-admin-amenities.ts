"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAmenityList() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.amenity.list.queryOptions());
}

export function useCreateAmenity() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.amenity.create.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.amenity.list.queryKey() });
        toast.success(`Đã tạo tiện nghi "${data.name}"`);
      },
      onError: (err) => toast.error(err.message ?? "Tạo tiện nghi thất bại"),
    }),
  );
}

export function useUpdateAmenity() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.amenity.update.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.amenity.list.queryKey() });
        toast.success(`Đã cập nhật tiện nghi "${data.name}"`);
      },
      onError: (err) =>
        toast.error(err.message ?? "Cập nhật tiện nghi thất bại"),
    }),
  );
}

export function useDeleteAmenity() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.amenity.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.amenity.list.queryKey() });
        toast.success("Đã xóa tiện nghi");
      },
      onError: (err) => toast.error(err.message ?? "Xóa tiện nghi thất bại"),
    }),
  );
}
