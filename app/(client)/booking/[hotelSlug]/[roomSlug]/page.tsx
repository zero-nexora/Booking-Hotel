import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { BookingClient } from "@/components/client/booking/booking-client";
import { bookingCache } from "@/lib/search-params/booking-params";

interface BookingPageProps {
  params: Promise<{ hotelSlug: string; roomSlug: string }>;
  searchParams: Promise<SearchParams>;
}

const BookingPage = async ({ params, searchParams }: BookingPageProps) => {
  const { hotelSlug, roomSlug } = await params;
  const queryClient = getQueryClient();
  const { checkIn, checkOut, adults, children } =
    await bookingCache.parse(searchParams);

  void queryClient.prefetchQuery(
    trpc.client.hotel.detail.queryOptions({
      slug: hotelSlug,
      checkIn: checkIn ?? undefined,
      checkOut: checkOut ?? undefined,
      adults,
      children,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingClient hotelSlug={hotelSlug} roomSlug={roomSlug} />
    </HydrationBoundary>
  );
};

export default BookingPage;
