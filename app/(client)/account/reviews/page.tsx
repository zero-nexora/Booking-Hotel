import { MyReviewsClient } from "@/components/client/account/my-reviews-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const MyReviewsPage = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.client.review.myReviews.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (last: { nextCursor: any }) =>
          last.nextCursor ?? undefined,
        initialCursor: undefined,
      },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyReviewsClient />
    </HydrationBoundary>
  );
};

export default MyReviewsPage;
