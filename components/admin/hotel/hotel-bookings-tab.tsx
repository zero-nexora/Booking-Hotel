"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/common/pagination";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { useAdminBookingList } from "@/hooks/admin/use-admin-bookings";
import { adminBookingParsers } from "@/lib/search-params/admin-bookings";
import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import { RouterOutput } from "@/trpc/client";
import { BookingStatus, PaymentStatus } from "@/prisma/generated/prisma/enums";
import { DEFAULT_PAGE } from "@/lib/constants";
import { formatDateShort, formatCurrencyUSD } from "@/lib/utils";
import { DataTableBody } from "@/components/common/table-body";

type Booking = RouterOutput["admin"]["booking"]["list"]["items"][number];

const BOOKING_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  CHECKED_OUT: "Đã check-out",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa TT",
  PENDING: "Đang xử lý",
  PAID: "Đã TT",
  REFUNDED: "Hoàn tiền",
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
};

const BookingRow = ({ booking }: { booking: Booking }) => (
  <TableRow className="border-border hover:bg-muted/40">
    <TableCell className="font-mono text-xs text-muted-foreground">
      {booking.bookingRef.slice(0, 8).toUpperCase()}
    </TableCell>
    <TableCell>
      <p className="text-sm font-medium text-foreground">{booking.guestName}</p>
      <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
    </TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {formatDateShort(booking.checkIn)} → {formatDateShort(booking.checkOut)}
    </TableCell>
    <TableCell>
      <StatusBadge status={booking.status} type="booking" />
    </TableCell>
    <TableCell>
      <StatusBadge status={booking.paymentStatus} type="payment" />
    </TableCell>
    <TableCell className="text-sm text-right font-medium text-foreground">
      {formatCurrencyUSD(Number(booking.totalAmount))}
    </TableCell>
  </TableRow>
);

interface HotelBookingsTabProps {
  hotelId: string;
}

export const HotelBookingsTab = ({ hotelId }: HotelBookingsTabProps) => {
  const [params, setParams] = useQueryStates(adminBookingParsers);
  const { data, isLoading } = useAdminBookingList({ ...params, hotelId });

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
    (l: number) => setParams({ limit: l, page: DEFAULT_PAGE }),
    [setParams],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={params.search}
          onChange={handleSearchChange}
          placeholder="Tìm mã, tên, email..."
          className="w-56"
        />
        <Select
          value={params.status ?? "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-44 border-border bg-background text-foreground">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground hover:bg-muted">
              Tất cả trạng thái
            </SelectItem>
            {Object.entries(BOOKING_STATUS_LABEL).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className="text-foreground hover:bg-muted"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={params.paymentStatus ?? "all"}
          onValueChange={handlePaymentStatusChange}
        >
          <SelectTrigger className="w-40 border-border bg-background text-foreground">
            <SelectValue placeholder="Thanh toán" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground hover:bg-muted">
              Tất cả TT
            </SelectItem>
            {Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className="text-foreground hover:bg-muted"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Mã booking
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Khách
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Thời gian
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Trạng thái
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Thanh toán
              </TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">
                Tổng tiền
              </TableHead>
            </TableRow>
          </TableHeader>
          <DataTableBody
            data={data?.items}
            isLoading={isLoading}
            cols={6}
            emptyMessage="Chưa có booking nào"
            renderRow={(booking) => (
              <BookingRow key={booking.id} booking={booking} />
            )}
          />
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
    </div>
  );
};
