import { UserListClient } from "@/components/admin/user/user-list-client";
import { adminUserCache } from "@/lib/search-params/admin-users";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";

interface AdminUsersPageProps {
  searchParams: Promise<SearchParams>;
}

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
  const queryClient = getQueryClient();
  const { limit, page, search, role } =
    await adminUserCache.parse(searchParams);

  await queryClient.prefetchQuery(
    trpc.admin.user.list.queryOptions({
      limit,
      page,
      search,
      role: role || undefined,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserListClient />
    </HydrationBoundary>
  );
};

export default AdminUsersPage;
