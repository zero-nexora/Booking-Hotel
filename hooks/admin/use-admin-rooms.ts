"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { AdminRoomParams } from "@/lib/search-params/admin-rooms";

export function useAdminRoomList(hotelId: string, params: AdminRoomParams) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.room.list.queryOptions(
      {
        hotelId,
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        isActive: params.isActive ?? undefined,
        roomTypeId: params.roomTypeId || undefined,
      },
      { enabled: !!hotelId },
    ),
  );
}

export function useAdminRoomDetail(id: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.room.detail.queryOptions({ id }, { enabled: !!id }),
  );
}

export function useCreateRoom() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.room.create.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.room.list.queryKey() });
        qc.invalidateQueries({ queryKey: trpc.admin.hotel.detail.queryKey() });
        toast.success(`Đã tạo phòng "${data.name}"`);
      },
      onError: (err) => toast.error(err.message ?? "Tạo phòng thất bại"),
    }),
  );
}

export function useUpdateRoom() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.room.update.mutationOptions({
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: trpc.admin.room.list.queryKey() });
        qc.invalidateQueries({
          queryKey: trpc.admin.room.detail.queryKey({ id: vars.id }),
        });
        toast.success("Cập nhật phòng thành công");
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật phòng thất bại"),
    }),
  );
}

export function useToggleRoomActive() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.room.update.mutationOptions({
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: trpc.admin.room.list.queryKey() });
        toast.success(
          vars.isActive ? "Phòng đã được kích hoạt" : "Phòng đã bị vô hiệu hóa",
        );
      },
      onError: (err) =>
        toast.error(err.message ?? "Thay đổi trạng thái thất bại"),
    }),
  );
}

export function useDeleteRoom() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.room.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.room.list.queryKey() });
        qc.invalidateQueries({ queryKey: trpc.admin.hotel.detail.queryKey() });
        toast.success("Đã xóa phòng");
      },
      onError: (err) => toast.error(err.message ?? "Xóa phòng thất bại"),
    }),
  );
}

export function useAddRoomImages(roomId: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.room.addImages.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: trpc.admin.room.detail.queryKey({ id: roomId }),
        });
        toast.success("Thêm ảnh thành công");
      },
      onError: (err) => toast.error(err.message ?? "Thêm ảnh thất bại"),
    }),
  );
}

export function useDeleteRoomImage(roomId: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.room.deleteImage.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: trpc.admin.room.detail.queryKey({ id: roomId }),
        });
        toast.success("Đã xóa ảnh");
      },
      onError: (err) => toast.error(err.message ?? "Xóa ảnh thất bại"),
    }),
  );
}

export function useRoomAvailability(roomId: string, from: Date, to: Date) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.room.availability.queryOptions(
      { roomId, from, to },
      { enabled: !!roomId },
    ),
  );
}

export function useSetRoomAvailability(roomId: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.room.setAvailability.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({
          queryKey: trpc.admin.room.availability.queryKey({ roomId }),
        });
        toast.success(`Đã cập nhật ${data.updatedDates} ngày`);
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật lịch thất bại"),
    }),
  );
}
