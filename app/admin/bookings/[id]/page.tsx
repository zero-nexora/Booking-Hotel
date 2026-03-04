import { BookingDetailClient } from "@/components/admin/booking/booking-detail-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface AdminBookingDetailPageProps {
  params: Promise<{ id: string }>;
}

const AdminBookingDetailPage = async ({
  params,
}: AdminBookingDetailPageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.admin.booking.detail.queryOptions({ id }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingDetailClient bookingId={id} />
    </HydrationBoundary>
  );
};

export default AdminBookingDetailPage;
