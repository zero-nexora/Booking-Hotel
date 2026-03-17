import { HomeClient } from "@/components/client/home/home-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const HomePage = async () => {
  const queryClient = getQueryClient();

  void Promise.all([
    queryClient.prefetchQuery(trpc.client.hotel.featured.queryOptions()),
    queryClient.prefetchQuery(
      trpc.client.hotel.popularDestinations.queryOptions(),
    ),
    queryClient.prefetchQuery(trpc.client.hotel.topAmenities.queryOptions()),
    queryClient.prefetchQuery(
      trpc.client.hotel.highlightedReviews.queryOptions(),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
};

export default HomePage;
