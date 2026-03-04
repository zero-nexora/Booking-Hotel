import { ReviewListClient } from "@/components/admin/review/review-list-client";
import { adminReviewCache } from "@/lib/search-params/admin-reviews";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";

interface AdminReviewsPageProps {
  searchParams: Promise<SearchParams>;
}

const AdminReviewsPage = async ({ searchParams }: AdminReviewsPageProps) => {
  const params = await adminReviewCache.parse(searchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.admin.review.list.queryOptions({
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
      hotelId: params.hotelId || undefined,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewListClient />
    </HydrationBoundary>
  );
};

export default AdminReviewsPage;
