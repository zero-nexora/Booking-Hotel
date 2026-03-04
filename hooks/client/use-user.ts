"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMe() {
  const trpc = useTRPC();
  return useQuery(trpc.client.user.me.queryOptions());
}

export function useUpdateProfile() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.client.user.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.client.user.me.queryKey() });
        toast.success("Cập nhật hồ sơ thành công");
      },
      onError: (err) => toast.error(err.message ?? "Cập nhật thất bại"),
    }),
  );
}
