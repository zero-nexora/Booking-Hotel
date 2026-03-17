import { BookingListClient } from "@/components/admin/booking/booking-list-client";
import { adminBookingCalendarCache } from "@/lib/search-params/admin-booking-calendar";
import { adminBookingCache } from "@/lib/search-params/admin-bookings";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";

interface AdminBookingsPageProps {
  searchParams: Promise<SearchParams>;
}

const AdminBookingsPage = async ({ searchParams }: AdminBookingsPageProps) => {
  const listParams = await adminBookingCache.parse(searchParams);
  const calendarParams = await adminBookingCalendarCache.parse(searchParams);

  const queryClient = getQueryClient();

  void Promise.all([
    queryClient.prefetchQuery(
      trpc.admin.booking.list.queryOptions({
        page: listParams.page,
        limit: listParams.limit,
        search: listParams.search || undefined,
        status: listParams.status || undefined,
        paymentStatus: listParams.paymentStatus || undefined,
        hotelId: listParams.hotelId || undefined,
        from: listParams.from ?? undefined,
        to: listParams.to ?? undefined,
      }),
    ),
    queryClient.prefetchQuery(
      trpc.admin.booking.events.queryOptions({
        status: calendarParams.status || undefined,
        paymentStatus: calendarParams.paymentStatus || undefined,
        from: calendarParams.from ?? undefined,
        to: calendarParams.to ?? undefined,
      }),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingListClient />
    </HydrationBoundary>
  );
};

export default AdminBookingsPage;
