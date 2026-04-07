"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { AdminBookingParams } from "@/lib/search-params/admin-bookings";
import type { BookingCalendarParams } from "@/lib/search-params/admin-booking-calendar";

export function useAdminBookingList(
  params: AdminBookingParams & { hotelId?: string },
) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.booking.list.queryOptions({
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
      paymentStatus: params.paymentStatus || undefined,
      hotelId: params.hotelId || undefined,
      from: params.from ?? undefined,
      to: params.to ?? undefined,
    }),
  );
}

export function useAdminBookingCalendar(params: BookingCalendarParams) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.booking.events.queryOptions({
      status: params.status ?? undefined,
      paymentStatus: params.paymentStatus ?? undefined,
      from: params.from ?? undefined,
      to: params.to ?? undefined,
    }),
  );
}

export function useAdminBookingDetail(id: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.booking.detail.queryOptions({ id }, { enabled: !!id }),
  );
}

export function useUpdateBookingStatus(id: string) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.booking.updateStatus.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({
          queryKey: trpc.admin.booking.list.queryKey(),
        });
        void qc.invalidateQueries({
          queryKey: trpc.admin.booking.detail.queryKey({ id }),
        });
        toast.success("Cập nhật trạng thái thành công");
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật thất bại"),
    }),
  );
}
