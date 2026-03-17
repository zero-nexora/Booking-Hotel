import { AccountBookingsClient } from "@/components/client/account/account-bookings-client";
import { accountBookingCache } from "@/lib/search-params/booking-search";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

interface AccountBookingsPageProps {
  searchParams: Promise<SearchParams>;
}

const AccountBookingsPage = async ({
  searchParams,
}: AccountBookingsPageProps) => {
  const queryClient = getQueryClient();
  const params = await accountBookingCache.parse(searchParams);

  void queryClient.prefetchInfiniteQuery(
    trpc.client.booking.myBookings.infiniteQueryOptions(
      { status: params.status ?? undefined, limit: 10 },
      {
        getNextPageParam: (last: { nextCursor: any }) =>
          last.nextCursor ?? undefined,
        initialCursor: undefined,
      },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountBookingsClient />
    </HydrationBoundary>
  );
};

export default AccountBookingsPage;
