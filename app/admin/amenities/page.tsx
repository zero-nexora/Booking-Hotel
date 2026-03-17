import { AmenityListClient } from "@/components/admin/amenity/amenity-list-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminAmenitiesPage = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.admin.amenity.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AmenityListClient />
    </HydrationBoundary>
  );
};

export default AdminAmenitiesPage;
