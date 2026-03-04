"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import type { AdminHotelParams } from "@/lib/search-params/admin-hotels";

export function useAdminHotelList(params: AdminHotelParams) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.hotel.list.queryOptions({
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
      starRating: params.starRating || undefined,
      cityId: params.cityId || undefined,
      countryId: params.countryId || undefined,
    }),
  );
}

export function useAdminHotelDetail(id: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.hotel.detail.queryOptions({ id }, { enabled: !!id }),
  );
}

export function useCreateHotel() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation(
    trpc.admin.hotel.create.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.hotel.list.queryKey() });
        toast.success("Tạo khách sạn thành công");
        router.push(`/admin/hotels/${data.id}`);
      },
      onError: (err) => toast.error(err.message ?? "Tạo khách sạn thất bại"),
    }),
  );
}

export function useUpdateHotel(id: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.hotel.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.hotel.list.queryKey() });
        qc.invalidateQueries({
          queryKey: trpc.admin.hotel.detail.queryKey({ id }),
        });
        toast.success("Cập nhật khách sạn thành công");
      },
      onError: (err) =>
        toast.error(err.message ?? "Cập nhật khách sạn thất bại"),
    }),
  );
}

export function useDeleteHotel() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation(
    trpc.admin.hotel.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.hotel.list.queryKey() });
        toast.success("Đã xóa khách sạn");
        router.push("/admin/hotels");
      },
      onError: (err) => toast.error(err.message ?? "Xóa khách sạn thất bại"),
    }),
  );
}

export function useAddHotelImages(id: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.hotel.addImages.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: trpc.admin.hotel.detail.queryKey({ id }),
        });
        toast.success("Thêm ảnh thành công");
      },
      onError: (err) => toast.error(err.message ?? "Thêm ảnh thất bại"),
    }),
  );
}

export function useDeleteHotelImage(hotelId: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.hotel.deleteImage.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: trpc.admin.hotel.detail.queryKey({ id: hotelId }),
        });
        toast.success("Đã xóa ảnh");
      },
      onError: (err) => toast.error(err.message ?? "Xóa ảnh thất bại"),
    }),
  );
}
