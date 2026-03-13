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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { useAdminBookingList } from "@/hooks/admin/use-admin-bookings";
import { adminBookingParsers } from "@/lib/search-params/admin-bookings";
import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import { format } from "date-fns";
import { RouterOutput } from "@/trpc/client";
import { BookingStatus, PaymentStatus } from "@/generated/prisma/enums";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { DEFAULT_PAGE } from "@/lib/constants";
import { formatCurrencyUSD } from "@/lib/utils";

type Booking = RouterOutput["admin"]["booking"]["list"]["items"][number];

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

const BookingRow = ({ booking }: { booking: Booking }) => (
  <TableRow>
    <TableCell className="font-mono text-xs">
      {booking.bookingRef.slice(0, 8).toUpperCase()}
    </TableCell>
    <TableCell>
      <p className="text-sm font-medium">{booking.guestName}</p>
      <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
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
      setParams({
        status: v === "all" ? null : (v as BookingStatus),
        page: 1,
      }),
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
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {Object.entries(BOOKING_STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={params.paymentStatus ?? "all"}
          onValueChange={handlePaymentStatusChange}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả TT</SelectItem>
            {Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã booking</TableHead>
              <TableHead>Khách</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton cols={6} />
          ) : (
            <TableBody>
              {data?.items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-12"
                  >
                    Chưa có booking nào
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
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
    </div>
  );
};
