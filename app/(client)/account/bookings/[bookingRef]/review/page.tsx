import { WriteReviewClient } from "@/components/client/account/write-review-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface WriteReviewPageProps {
  params: Promise<{ bookingRef: string }>;
}

const WriteReviewPage = async ({ params }: WriteReviewPageProps) => {
  const { bookingRef } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      trpc.client.review.getForBooking.queryOptions({ bookingRef }),
    );
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WriteReviewClient bookingRef={bookingRef} />
    </HydrationBoundary>
  );
};

export default WriteReviewPage;
