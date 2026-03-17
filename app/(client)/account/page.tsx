import { AccountOverviewClient } from "@/components/client/account/account-overview-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const AccountPage = async () => {
  const queryClient = getQueryClient();

  void Promise.all([
    queryClient.prefetchQuery(trpc.client.user.me.queryOptions()),
    queryClient.prefetchQuery(trpc.client.booking.quickStats.queryOptions()),
    queryClient.prefetchQuery(trpc.client.booking.recentBookings.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountOverviewClient />
    </HydrationBoundary>
  );
};

export default AccountPage;