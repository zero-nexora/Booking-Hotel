import { ProfileClient } from "@/components/client/account/profile-client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ProfilePage = async () => {
  const queryClient = getQueryClient();

  void Promise.all([
    queryClient.prefetchQuery(trpc.client.user.me.queryOptions()),
    queryClient.prefetchQuery(trpc.client.user.connectedAccounts.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClient />
    </HydrationBoundary>
  );
};

export default ProfilePage;
