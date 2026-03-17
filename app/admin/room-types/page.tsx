import { RoomTypeListClient } from "@/components/admin/room-type/room-type-list-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const AdminRoomTypesPage = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.admin.roomType.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomTypeListClient />
    </HydrationBoundary>
  );
};

export default AdminRoomTypesPage;
