"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export function useMe() {
  const trpc = useTRPC();
  return useQuery(trpc.client.user.me.queryOptions());
}

export function useUpdateProfile() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.client.user.updateProfile.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.client.user.me.queryKey() });
        toast.success("Cập nhật hồ sơ thành công");
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật thất bại"),
    }),
  );
}

export function useConnectedAccounts() {
  const trpc = useTRPC();
  return useQuery(trpc.client.user.connectedAccounts.queryOptions());
}

export function useDeleteAccount() {
  const trpc = useTRPC();
  return useMutation(
    trpc.client.user.deleteAccount.mutationOptions({
      onSuccess: () => toast.success("Tài khoản đã được xoá"),
      onError: (err) => toast.error(err.message ?? "Xoá tài khoản thất bại"),
    }),
  );
}
