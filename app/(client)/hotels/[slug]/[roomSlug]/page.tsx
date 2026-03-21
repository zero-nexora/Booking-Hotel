import { RoomDetailClient } from "@/components/client/room/room-detail-client";
import { roomDetailCache } from "@/lib/search-params/room-params";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

interface RoomDetailPageProps {
  params: Promise<{ slug: string; roomSlug: string }>;
  searchParams: Promise<SearchParams>;
}

const RoomDetailPage = async ({
  params,
  searchParams,
}: RoomDetailPageProps) => {
  const { roomSlug, slug } = await params;
  const queryClient = getQueryClient();
  const { checkIn, checkOut, adults, children } =
    await roomDetailCache.parse(searchParams);

  void queryClient.prefetchQuery(
    trpc.client.hotel.roomDetail.queryOptions({ hotelSlug: slug, roomSlug }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomDetailClient
        hotelSlug={slug}
        roomSlug={roomSlug}
        checkIn={checkIn}
        checkOut={checkOut}
        adults={adults}
        childrenCount={children}
      />
    </HydrationBoundary>
  );
};

export default RoomDetailPage;
