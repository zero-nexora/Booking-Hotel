import { HotelListClient } from "@/components/admin/hotel/hotel-list-client";
import { adminHotelCache } from "@/lib/search-params/admin-hotels";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";

interface AdminHotelsPageProps {
  searchParams: Promise<SearchParams>;
}

const AdminHotelsPage = async ({ searchParams }: AdminHotelsPageProps) => {
  const queryClient = getQueryClient();
  const { limit, page, search, status, starRating, cityId, countryId } =
    await adminHotelCache.parse(searchParams);

  void queryClient.prefetchQuery(
    trpc.admin.hotel.list.queryOptions({
      limit,
      page,
      search,
      status: status || undefined,
      starRating: starRating || undefined,
      cityId,
      countryId,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HotelListClient />
    </HydrationBoundary>
  );
};

export default AdminHotelsPage;
