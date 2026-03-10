import { RoomDetailClient } from "@/components/admin/room/room-detail-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface AdminRoomDetailPageProps {
  params: Promise<{ id: string; roomId: string }>;
}

const AdminRoomDetailPage = async ({ params }: AdminRoomDetailPageProps) => {
  const { id, roomId } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.admin.room.detail.queryOptions({ id: roomId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomDetailClient roomId={roomId} hotelId={id} />
    </HydrationBoundary>
  );
};

export default AdminRoomDetailPage;
