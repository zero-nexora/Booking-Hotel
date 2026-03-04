import { CityListClient } from "@/components/admin/city/city-list-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminAmenitiesPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(trpc.admin.location.listCities.queryOptions({})),
    queryClient.prefetchQuery(trpc.admin.location.listCities.queryFilter()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CityListClient />
    </HydrationBoundary>
  );
};

export default AdminAmenitiesPage;
