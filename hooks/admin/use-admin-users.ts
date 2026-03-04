"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { AdminUserParams } from "@/lib/search-params/admin-users";

export function useAdminUserList(params: AdminUserParams) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.user.list.queryOptions({
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      role: params.role || undefined,
    }),
  );
}

export function useSetUserRole() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  return useMutation(
    trpc.admin.user.setRole.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: trpc.admin.user.list.queryKey() });
        toast.success(
          `Đã đổi role thành ${data.role === "ADMIN" ? "Admin" : "Customer"}`,
        );
      },
      onError: (err) => toast.error(err.message ?? "Đổi role thất bại"),
    }),
  );
}
