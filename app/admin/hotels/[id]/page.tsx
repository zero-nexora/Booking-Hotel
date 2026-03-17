import { HotelDetailClient } from "@/components/admin/hotel/hotel-detail-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface AdminHotelDetailPageProps {
  params: Promise<{ id: string }>;
}

const AdminHotelDetailPage = async ({ params }: AdminHotelDetailPageProps) => {
  const queryClient = getQueryClient();
  const { id } = await params;

  void queryClient.prefetchQuery(trpc.admin.hotel.detail.queryOptions({ id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HotelDetailClient hotelId={id} />
    </HydrationBoundary>
  );
};

export default AdminHotelDetailPage;
