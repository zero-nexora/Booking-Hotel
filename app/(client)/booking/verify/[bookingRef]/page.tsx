import { BookingVerifyClient } from "@/components/client/booking/booking-verify-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface BookingVerifyPageProps {
  params: Promise<{ bookingRef: string }>;
}

const BookingVerifyPage = async ({ params }: BookingVerifyPageProps) => {
  const { bookingRef } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.client.booking.getVerification.queryOptions({ bookingRef }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingVerifyClient bookingRef={bookingRef} />
    </HydrationBoundary>
  );
};

export default BookingVerifyPage;
