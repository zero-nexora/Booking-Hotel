import { BookingDetailClient } from "@/components/client/account/booking-detail-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface BookingDetailPageProps {
  params: Promise<{ bookingRef: string }>;
}

const BookingDetailPage = async ({ params }: BookingDetailPageProps) => {
  const { bookingRef } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.client.booking.bookingDetail.queryOptions({ bookingRef }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingDetailClient bookingRef={bookingRef} />
    </HydrationBoundary>
  );
};

export default BookingDetailPage;
