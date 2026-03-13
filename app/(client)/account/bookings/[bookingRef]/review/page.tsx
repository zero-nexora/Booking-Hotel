import { WriteReviewClient } from "@/components/client/account/write-review-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface WriteReviewPageProps {
  params: Promise<{ bookingRef: string }>;
}

const WriteReviewPage = async ({ params }: WriteReviewPageProps) => {
  const { bookingRef } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.client.review.getForBooking.queryOptions({ bookingRef }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WriteReviewClient bookingRef={bookingRef} />
    </HydrationBoundary>
  );
};

export default WriteReviewPage;
