import { ConfirmationClient } from "@/components/client/booking/confirmation-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ConfirmationPageProps {
  params: Promise<{ bookingRef: string }>;
}

const ConfirmationPage = async ({ params }: ConfirmationPageProps) => {
  const { bookingRef } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.client.booking.getConfirmation.queryOptions({ bookingRef }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConfirmationClient bookingRef={bookingRef} />
    </HydrationBoundary>
  );
};

export default ConfirmationPage;
