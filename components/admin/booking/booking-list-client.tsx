"use client";

import { useRef } from "react";
import { format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  useAdminBookingList,
  useAdminBookingCalendar,
} from "@/hooks/admin/use-admin-bookings";
import { Calendar, List } from "lucide-react";
import { RouterOutput } from "@/trpc/client";
import { adminBookingParsers } from "@/lib/search-params/admin-bookings";
import { parseAsString, useQueryStates } from "nuqs";
import { BookingStatus, PaymentStatus } from "@/generated/prisma/enums";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";

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
  PENDING: "#f59e0b",
  CONFIRMED: "#10b981",
  CHECKED_IN: "#3b82f6",
  CHECKED_OUT: "#6b7280",
  CANCELLED: "#ef4444",
  NO_SHOW: "#ef4444",
};

const BOOKING_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CHECKED_IN: "default",
  CHECKED_OUT: "outline",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

const BOOKING_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  CHECKED_OUT: "Đã check-out",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến",
};

const PAYMENT_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  UNPAID: "secondary",
  PENDING: "secondary",
  PAID: "default",
  REFUNDED: "outline",
  FAILED: "destructive",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa TT",
  PENDING: "Đang xử lý",
  PAID: "Đã TT",
  REFUNDED: "Hoàn tiền",
  FAILED: "Thất bại",
};

const BookingRow = ({
  booking,
  onClick,
}: {
  booking: Booking;
  onClick: (id: string) => void;
}) => (
  <TableRow className="cursor-pointer" onClick={() => onClick(booking.id)}>
    <TableCell className="font-mono text-xs">
      {booking.bookingRef.slice(0, 8).toUpperCase()}
    </TableCell>
    <TableCell>
      <p className="text-sm font-medium">{booking.guestName}</p>
      <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
    </TableCell>
    <TableCell>
      <p className="text-sm">{booking.hotel.name}</p>
      <p className="text-xs text-muted-foreground">
        {booking.items.map((i) => i.room.name).join(", ")}
      </p>
    </TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {format(new Date(booking.checkIn), "dd/MM/yy")} →{" "}
      {format(new Date(booking.checkOut), "dd/MM/yy")}
    </TableCell>
    <TableCell>
      <Badge variant={BOOKING_STATUS_VARIANT[booking.status]}>
        {BOOKING_STATUS_LABEL[booking.status]}
      </Badge>
    </TableCell>
    <TableCell>
      <Badge variant={PAYMENT_STATUS_VARIANT[booking.paymentStatus]}>
        {PAYMENT_STATUS_LABEL[booking.paymentStatus]}
      </Badge>
    </TableCell>
    <TableCell className="text-sm text-right">
      {Number(booking.totalAmount).toLocaleString("vi-VN")}đ
    </TableCell>
  </TableRow>
);

export const BookingListClient = () => {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [params, setParams] = useQueryStates(adminBookingParsers);
  const [{ view }, setView] = useQueryStates({
    view: parseAsString.withDefault("list"),
  });

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

  const handleEventClick = (arg: EventClickArg) =>
    router.push(`/admin/bookings/${arg.event.extendedProps.bookingId}`);

  return (
    <div className="space-y-4">
      <ListHeader title="Booking" count={data?.total} countLabel="booking">
        <div className="flex gap-2 items-center flex-wrap">
          <SearchInput
            value={params.search}
            onChange={(v) => void setParams({ search: v, page: 1 })}
            placeholder="Tìm mã, tên, email..."
            className="w-64"
          />
          <Select
            value={params.status ?? "all"}
            onValueChange={(v) =>
              void setParams({
                status: v === "all" ? null : (v as BookingStatus),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {BOOKING_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.paymentStatus ?? "all"}
            onValueChange={(v) =>
              void setParams({
                paymentStatus: v === "all" ? null : (v as PaymentStatus),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả TT</SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex gap-1 border rounded-md p-0.5">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => void setView({ view: "list" })}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => void setView({ view: "calendar" })}
            >
              <Calendar className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </ListHeader>

      {view === "list" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Khách</TableHead>
                <TableHead>Khách sạn / Phòng</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
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
                      className="text-center text-muted-foreground py-12"
                    >
                      Không có booking nào
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.items.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      onClick={(id) => router.push(`/admin/bookings/${id}`)}
                    />
                  ))
                )}
              </TableBody>
            )}
          </Table>
          {data && (
            <Pagination
              page={params.page}
              totalPages={data.totalPages}
              total={data.total}
              limit={params.limit}
              onPageChange={(p) => void setParams({ page: p })}
              onLimitChange={(l) => void setParams({ limit: l, page: 1 })}
            />
          )}
        </Card>
      ) : (
        <Card className="p-4 [&_.fc-daygrid-event]:text-xs [&_.fc-event]:rounded [&_.fc-event]:px-1.5 [&_.fc-col-header-cell-cushion]:text-xs [&_.fc-col-header-cell-cushion]:text-muted-foreground [&_.fc-col-header-cell-cushion]:font-medium [&_.fc-daygrid-day-number]:text-sm [&_.fc-toolbar-title]:text-base [&_.fc-toolbar-title]:font-semibold [&_.fc-button]:bg-background! [&_.fc-button]:text-foreground! [&_.fc-button]:border-border! [&_.fc-button]:shadow-none! [&_.fc-button-active]:bg-muted!">
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
