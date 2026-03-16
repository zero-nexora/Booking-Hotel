"use client";

import { useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useAdminBookingList,
  useAdminBookingCalendar,
} from "@/hooks/admin/use-admin-bookings";
import { Calendar, List } from "lucide-react";
import { RouterOutput } from "@/trpc/client";
import { adminBookingParsers } from "@/lib/search-params/admin-bookings";
import { useQueryStates } from "nuqs";
import { BookingStatus, PaymentStatus } from "@/generated/prisma/enums";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { formatDateShort, formatCurrencyUSD } from "@/lib/utils";

type Booking = RouterOutput["admin"]["booking"]["list"]["items"][number];

const BOOKING_STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "CHECKED_IN", label: "Đã check-in" },
  { value: "CHECKED_OUT", label: "Đã check-out" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "NO_SHOW", label: "Không đến" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PENDING", label: "Đang xử lý" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
  { value: "FAILED", label: "Thất bại" },
];

const BOOKING_STATUS_COLOR: Record<string, string> = {
  PENDING: "#d97706",
  CONFIRMED: "#059669",
  CHECKED_IN: "#2563eb",
  CHECKED_OUT: "#6b7280",
  CANCELLED: "#dc2626",
  NO_SHOW: "#dc2626",
};

const BookingRow = ({
  booking,
  onClick,
}: {
  booking: Booking;
  onClick: (id: string) => void;
}) => (
  <TableRow
    className="border-border hover:bg-muted/40 cursor-pointer"
    onClick={() => onClick(booking.id)}
  >
    <TableCell>
      <span className="font-mono text-[11px] tracking-wide text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
        {booking.bookingRef.slice(0, 8).toUpperCase()}
      </span>
    </TableCell>
    <TableCell>
      <p className="text-sm font-medium text-foreground leading-tight">
        {booking.guestName}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {booking.guestEmail}
      </p>
    </TableCell>
    <TableCell>
      <p className="text-sm text-foreground leading-tight">
        {booking.hotel.name}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {booking.items.map((i) => i.room.name).join(", ")}
      </p>
    </TableCell>
    <TableCell>
      <span className="text-xs tabular-nums text-muted-foreground">
        {formatDateShort(booking.checkIn)} → {formatDateShort(booking.checkOut)}
      </span>
    </TableCell>
    <TableCell>
      <StatusBadge status={booking.status} type="booking" />
    </TableCell>
    <TableCell>
      <StatusBadge status={booking.paymentStatus} type="payment" />
    </TableCell>
    <TableCell className="text-right">
      <span className="text-sm font-medium tabular-nums text-foreground">
        {formatCurrencyUSD(Number(booking.totalAmount))}
      </span>
    </TableCell>
  </TableRow>
);

export const BookingListClient = () => {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [params, setParams] = useQueryStates(adminBookingParsers);

  const currentView = params.view ?? "list";

  const { data, isLoading } = useAdminBookingList(params);
  const { data: calendarData } = useAdminBookingCalendar({
    status: params.status,
    paymentStatus: params.paymentStatus,
    from: params.from,
    to: params.to,
  });

  const calendarEvents = (calendarData ?? []).map((b) => ({
    id: b.id,
    title: `${b.guestName} · ${b.hotel.name}`,
    start: b.checkIn,
    end: b.checkOut,
    backgroundColor: BOOKING_STATUS_COLOR[b.status],
    borderColor: BOOKING_STATUS_COLOR[b.status],
    extendedProps: { bookingId: b.id },
  }));

  const handleEventClick = useCallback(
    (arg: EventClickArg) =>
      router.push(`/admin/bookings/${arg.event.extendedProps.bookingId}`),
    [router],
  );

  const handleRowClick = useCallback(
    (id: string) => router.push(`/admin/bookings/${id}`),
    [router],
  );

  const handleSearchChange = useCallback(
    (v: string) => setParams({ search: v, page: 1 }),
    [setParams],
  );

  const handleStatusChange = useCallback(
    (v: string) =>
      setParams({ status: v === "all" ? null : (v as BookingStatus), page: 1 }),
    [setParams],
  );

  const handlePaymentStatusChange = useCallback(
    (v: string) =>
      setParams({
        paymentStatus: v === "all" ? null : (v as PaymentStatus),
        page: 1,
      }),
    [setParams],
  );

  const handlePageChange = useCallback(
    (p: number) => setParams({ page: p }),
    [setParams],
  );

  const handleLimitChange = useCallback(
    (l: number) => setParams({ limit: l, page: 1 }),
    [setParams],
  );

  return (
    <div className="space-y-4">
      <ListHeader title="Booking" count={data?.total} countLabel="booking">
        <div className="flex gap-2 items-center flex-wrap">
          <SearchInput
            value={params.search}
            onChange={handleSearchChange}
            placeholder="Tìm mã, tên, email..."
            className="w-64"
          />
          <Select
            value={params.status ?? "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-44 border-border bg-background text-foreground">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
                Tất cả trạng thái
              </SelectItem>
              {BOOKING_STATUS_OPTIONS.map((o) => (
                <SelectItem
                  key={o.value}
                  value={o.value}
                  className="text-foreground hover:bg-muted"
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.paymentStatus ?? "all"}
            onValueChange={handlePaymentStatusChange}
          >
            <SelectTrigger className="w-44 border-border bg-background text-foreground">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
                Tất cả TT
              </SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((o) => (
                <SelectItem
                  key={o.value}
                  value={o.value}
                  className="text-foreground hover:bg-muted"
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex gap-0.5 border border-border rounded-lg p-0.5 bg-muted/40">
            <Button
              variant={currentView === "list" ? "default" : "ghost"}
              size="sm"
              className={
                currentView === "list"
                  ? "h-7 px-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  : "h-7 px-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              }
              onClick={() => setParams({ ...params, view: "list" } as never)}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={currentView === "calendar" ? "default" : "ghost"}
              size="sm"
              className={
                currentView === "calendar"
                  ? "h-7 px-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  : "h-7 px-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              }
              onClick={() =>
                setParams({ ...params, view: "calendar" } as never)
              }
            >
              <Calendar className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </ListHeader>

      {currentView === "list" ? (
        <Card className="bg-card border-border shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent bg-muted/30">
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28">
                  Mã
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Khách
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Khách sạn / Phòng
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Thời gian
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Trạng thái
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Thanh toán
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                  Tổng tiền
                </TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <TableSkeleton cols={7} />
            ) : (
              <TableBody>
                {data?.items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-16 text-sm"
                    >
                      Không có booking nào
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.items.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      onClick={handleRowClick}
                    />
                  ))
                )}
              </TableBody>
            )}
          </Table>
          {data && data.totalPages > 1 && (
            <Pagination
              page={params.page}
              totalPages={data.totalPages}
              total={data.total}
              limit={params.limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </Card>
      ) : (
        <Card className="bg-card border-border shadow-none p-5">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="vi"
            firstDay={1}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,listWeek",
            }}
            buttonText={{ today: "Hôm nay", month: "Tháng", listWeek: "Tuần" }}
            eventDisplay="block"
            dayMaxEvents={3}
          />
        </Card>
      )}
    </div>
  );
};
