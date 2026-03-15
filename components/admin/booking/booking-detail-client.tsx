"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminBookingDetail,
  useUpdateBookingStatus,
} from "@/hooks/admin/use-admin-bookings";
import { ArrowLeft } from "lucide-react";
import { RouterOutput } from "@/trpc/client";
import { formatDateShort } from "@/lib/utils";

type BookingDetail = RouterOutput["admin"]["booking"]["detail"];
type BookingStatus =
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

const BOOKING_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  CHECKED_OUT: "Đã check-out",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến",
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

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Đang xử lý",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
  FAILED: "Thất bại",
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

const VALID_TRANSITIONS: Record<string, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["CHECKED_OUT"],
};

const TRANSITION_LABEL: Record<BookingStatus, string> = {
  CONFIRMED: "Xác nhận",
  CHECKED_IN: "Check-in",
  CHECKED_OUT: "Check-out",
  CANCELLED: "Hủy booking",
  NO_SHOW: "Không đến",
};

const BookingDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-9 w-9" />
      <Skeleton className="h-8 w-64" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
    <Skeleton className="h-64" />
  </div>
);

interface BookingHeaderProps {
  booking: BookingDetail;
  onStatusChange: (status: BookingStatus) => void;
  isPending: boolean;
}

const BookingHeader = ({
  booking,
  onStatusChange,
  isPending,
}: BookingHeaderProps) => {
  const router = useRouter();
  const nextStatuses = VALID_TRANSITIONS[booking.status] ?? [];

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/bookings")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight font-mono">
              {booking.bookingRef}
            </h1>
            <Badge variant={BOOKING_STATUS_VARIANT[booking.status]}>
              {BOOKING_STATUS_LABEL[booking.status]}
            </Badge>
            <Badge variant={PAYMENT_STATUS_VARIANT[booking.paymentStatus]}>
              {PAYMENT_STATUS_LABEL[booking.paymentStatus]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {booking.hotel.name} · Tạo{" "}
            {formatDateShort(booking.createdAt)}
          </p>
        </div>
      </div>
      {nextStatuses.length > 0 && (
        <div className="flex gap-2">
          {nextStatuses.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={
                status === "CANCELLED" || status === "NO_SHOW"
                  ? "destructive"
                  : "default"
              }
              disabled={isPending}
              onClick={() => onStatusChange(status)}
            >
              {TRANSITION_LABEL[status]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

const GuestCard = ({ booking }: { booking: BookingDetail }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Thông tin khách</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tên</span>
        <span className="font-medium">{booking.guestName}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Email</span>
        <span>{booking.guestEmail}</span>
      </div>
      {booking.guestPhone && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Điện thoại</span>
          <span>{booking.guestPhone}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tài khoản</span>
        <span>{booking.user.name}</span>
      </div>
    </CardContent>
  </Card>
);

const StayCard = ({ booking }: { booking: BookingDetail }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Thông tin lưu trú</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Check-in</span>
        <span className="font-medium">
          {format(new Date(booking.checkIn), "dd/MM/yyyy")}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Check-out</span>
        <span className="font-medium">
          {format(new Date(booking.checkOut), "dd/MM/yyyy")}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Địa điểm</span>
        <span>
          {booking.hotel.address.city.name},{" "}
          {booking.hotel.address.city.country.name}
        </span>
      </div>
      {booking.specialRequests && (
        <div>
          <p className="text-muted-foreground mb-1">Yêu cầu đặc biệt</p>
          <p className="text-xs bg-muted rounded p-2">
            {booking.specialRequests}
          </p>
        </div>
      )}
      {booking.cancelReason && (
        <div>
          <p className="text-muted-foreground mb-1">Lý do hủy</p>
          <p className="text-xs bg-destructive/10 text-destructive rounded p-2">
            {booking.cancelReason}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

const PaymentCard = ({ booking }: { booking: BookingDetail }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Thanh toán</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tổng tiền</span>
        <span className="font-bold text-base">
          {Number(booking.totalAmount).toLocaleString("vi-VN")}đ
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Trạng thái</span>
        <Badge variant={PAYMENT_STATUS_VARIANT[booking.paymentStatus]}>
          {PAYMENT_STATUS_LABEL[booking.paymentStatus]}
        </Badge>
      </div>
      {booking.payments.map((payment) => (
        <div key={payment.id} className="border-t pt-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {payment.type === "CHARGE" ? "Thanh toán" : "Hoàn tiền"}
            </span>
            <span>{Number(payment.amount).toLocaleString("vi-VN")}đ</span>
          </div>
          {payment.paidAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thời gian</span>
              <span className="text-xs">
                {format(new Date(payment.paidAt), "dd/MM/yyyy HH:mm")}
              </span>
            </div>
          )}
          {payment.stripePaymentIntentId && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stripe ID</span>
              <span className="font-mono text-xs truncate max-w-35">
                {payment.stripePaymentIntentId}
              </span>
            </div>
          )}
          {payment.failureMessage && (
            <p className="text-xs text-destructive">{payment.failureMessage}</p>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

const BookingItemsCard = ({ booking }: { booking: BookingDetail }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Chi tiết phòng</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {booking.items.map((item) => (
        <div key={item.id} className="rounded-lg border p-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item.room.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.room.roomType.name}
                {item.room.floor ? ` · Tầng ${item.room.floor}` : ""}
              </p>
            </div>
            <Badge variant="outline">{item.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Check-in</span>
              <span className="text-foreground">
                {format(new Date(item.checkIn), "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span className="text-foreground">
                {format(new Date(item.checkOut), "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Số đêm</span>
              <span className="text-foreground">{item.nights}</span>
            </div>
            <div className="flex justify-between">
              <span>Khách</span>
              <span className="text-foreground">
                {item.adults} người lớn
                {item.children > 0 ? `, ${item.children} trẻ em` : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Đơn giá</span>
              <span className="text-foreground">
                {Number(item.unitPrice).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Tổng</span>
              <span className="text-foreground">
                {Number(item.total).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ReviewCard = ({ booking }: { booking: BookingDetail }) => {
  if (!booking.review) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Đánh giá</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: booking.review.overallRating }).map(
              (_, i) => (
                <span key={i} className="text-amber-400">
                  ★
                </span>
              ),
            )}
            {Array.from({ length: 5 - booking.review.overallRating }).map(
              (_, i) => (
                <span key={i} className="text-muted-foreground">
                  ★
                </span>
              ),
            )}
          </div>
          <Badge
            variant={
              booking.review.status === "APPROVED"
                ? "default"
                : booking.review.status === "REJECTED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {booking.review.status === "APPROVED"
              ? "Đã duyệt"
              : booking.review.status === "REJECTED"
                ? "Từ chối"
                : "Chờ duyệt"}
          </Badge>
        </div>
        {booking.review.title && (
          <p className="font-medium">{booking.review.title}</p>
        )}
        <p className="text-muted-foreground">{booking.review.comment}</p>
      </CardContent>
    </Card>
  );
};

interface BookingDetailClientProps {
  bookingId: string;
}

export const BookingDetailClient = ({
  bookingId,
}: BookingDetailClientProps) => {
  const { data: booking, isLoading } = useAdminBookingDetail(bookingId);
  const updateStatus = useUpdateBookingStatus(bookingId);

  if (isLoading) return <BookingDetailSkeleton />;
  if (!booking) return null;

  return (
    <div className="space-y-6">
      <BookingHeader
        booking={booking}
        onStatusChange={(status) =>
          void updateStatus.mutateAsync({ id: bookingId, status })
        }
        isPending={updateStatus.isPending}
      />
      <div className="grid grid-cols-3 gap-4">
        <GuestCard booking={booking} />
        <StayCard booking={booking} />
        <PaymentCard booking={booking} />
      </div>
      <BookingItemsCard booking={booking} />
      <ReviewCard booking={booking} />
    </div>
  );
};
