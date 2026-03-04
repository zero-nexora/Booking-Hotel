"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCountryList() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.location.listCountries.queryOptions());
}

export function useCreateCountry() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.location.createCountry.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.location.listCountries.queryKey() });
        toast.success("Thêm quốc gia thành công");
      },
      onError: (err) => toast.error(err.message ?? "Thêm quốc gia thất bại"),
    }),
  );
}

export function useUpdateCountry() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.location.updateCountry.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.location.listCountries.queryKey() });
        toast.success("Cập nhật quốc gia thành công");
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật quốc gia thất bại"),
    }),
  );
}

export function useDeleteCountry() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.location.deleteCountry.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.location.listCountries.queryKey() });
        toast.success("Đã xóa quốc gia");
      },
      onError: (err) => toast.error(err.message ?? "Xóa quốc gia thất bại"),
    }),
  );
}

export function useCityList(countryId?: string) {
  const trpc = useTRPC();
  return useQuery(trpc.admin.location.listCities.queryOptions({ countryId }));
}

export function useCreateCity() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.location.createCity.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.location.listCities.queryKey() });
        toast.success("Thêm thành phố thành công");
      },
      onError: (err) => toast.error(err.message ?? "Thêm thành phố thất bại"),
    }),
  );
}

export function useUpdateCity() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.location.updateCity.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.location.listCities.queryKey() });
        toast.success("Cập nhật thành phố thành công");
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật thành phố thất bại"),
    }),
  );
}

export function useDeleteCity() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.location.deleteCity.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.admin.location.listCities.queryKey() });
        toast.success("Đã xóa thành phố");
      },
      onError: (err) => toast.error(err.message ?? "Xóa thành phố thất bại"),
    }),
  );
}