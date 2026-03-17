import { BedTypeListClient } from "@/components/admin/bed-type/bed-type-list-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminBedTypesPage = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.admin.bedType.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BedTypeListClient />
    </HydrationBoundary>
  );
};

export default AdminBedTypesPage;
