import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { DashboardClient } from "@/components/admin/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

const AdminDashboardPage = async () => {
  const queryClient = getQueryClient();

  void Promise.all([
    queryClient.prefetchQuery(trpc.admin.dashboard.stats.queryOptions()),
    queryClient.prefetchQuery(trpc.admin.dashboard.revenueChart.queryOptions()),
    queryClient.prefetchQuery(
      trpc.admin.dashboard.bookingStatusChart.queryOptions(),
    ),
    queryClient.prefetchQuery(trpc.admin.dashboard.topHotels.queryOptions()),
    queryClient.prefetchQuery(
      trpc.admin.dashboard.recentBookings.queryOptions(),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
};

export default AdminDashboardPage;
