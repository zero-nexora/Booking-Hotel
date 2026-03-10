import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { notFound } from "next/navigation";
import { hotelSearchCache } from "@/lib/search-params/hotel-search";
import { BookingClient } from "@/components/client/booking/booking-client";

interface BookingPageProps {
  params: Promise<{ hotelSlug: string; roomSlug: string }>;
  searchParams: Promise<SearchParams>;
}

const BookingPage = async ({ params, searchParams }: BookingPageProps) => {
  const { hotelSlug, roomSlug } = await params;
  const queryClient = getQueryClient();
  const { checkIn, checkOut, adults, children } =
    await hotelSearchCache.parse(searchParams);

  try {
    await queryClient.prefetchQuery(
      trpc.client.hotel.detail.queryOptions({
        slug: hotelSlug,
        checkIn: checkIn ?? undefined,
        checkOut: checkOut ?? undefined,
      }),
    );
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingClient
        hotelSlug={hotelSlug}
        roomSlug={roomSlug}
        checkIn={checkIn ?? undefined}
        checkOut={checkOut ?? undefined}
        adults={adults}
        childCount={children}
      />
    </HydrationBoundary>
  );
};

export default BookingPage;
