import { ConfirmationClient } from "@/components/client/booking/confirmation-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface ConfirmationPageProps {
  params: Promise<{ bookingRef: string }>;
}

const ConfirmationPage = async ({ params }: ConfirmationPageProps) => {
  const { bookingRef } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      trpc.client.booking.getConfirmation.queryOptions({ bookingRef }),
    );
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConfirmationClient bookingRef={bookingRef} />
    </HydrationBoundary>
  );
};

export default ConfirmationPage;
