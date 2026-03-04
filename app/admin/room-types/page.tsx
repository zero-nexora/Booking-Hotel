import { RoomTypeListClient } from "@/components/admin/room-type/room-type-list-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminRoomTypesPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trpc.admin.roomType.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomTypeListClient />
    </HydrationBoundary>
  );
};

export default AdminRoomTypesPage;
