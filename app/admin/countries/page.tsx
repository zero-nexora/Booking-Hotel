import { CountryListClient } from "@/components/admin/country/country-list-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminCountriesPage = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.admin.location.listCountries.queryOptions(),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CountryListClient />
    </HydrationBoundary>
  );
};

export default AdminCountriesPage;
