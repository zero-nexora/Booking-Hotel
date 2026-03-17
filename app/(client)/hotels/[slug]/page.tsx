import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { hotelSearchCache } from "@/lib/search-params/hotel-search";
import { HotelDetailClient } from "@/components/client/hotel-detail/hotel-detail-client";

interface HotelDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const HotelDetailPage = async ({
  params,
  searchParams,
}: HotelDetailPageProps) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  const { checkIn, checkOut, adults, children } =
    await hotelSearchCache.parse(searchParams);

  await Promise.all([
    queryClient.prefetchQuery(
      trpc.client.hotel.detail.queryOptions({
        slug,
        checkIn: checkIn ?? undefined,
        checkOut: checkOut ?? undefined,
        adults,
        children,
      }),
    ),
    queryClient.prefetchInfiniteQuery(
      trpc.client.hotel.reviews.infiniteQueryOptions(
        { hotelId: slug, limit: 10 },
        {
          getNextPageParam: (last: { nextCursor: any }) =>
            last.nextCursor ?? undefined,
          initialCursor: undefined,
        },
      ),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HotelDetailClient slug={slug} />
    </HydrationBoundary>
  );
};

export default HotelDetailPage;
