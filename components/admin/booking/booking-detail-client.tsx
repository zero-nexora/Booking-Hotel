"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminBookingDetail,
  useUpdateBookingStatus,
} from "@/hooks/admin/use-admin-bookings";
import { ArrowLeft } from "lucide-react";
import { RouterOutput } from "@/trpc/client";
import { StatusBadge } from "@/components/common/status-badge";
import { StarRating } from "@/components/common/star-rating";
import {
  formatDateShort,
  formatDatetime,
  formatCurrencyUSD,
} from "@/lib/utils";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";

type BookingDetail = RouterOutput["admin"]["booking"]["detail"];
type BookingStatus =
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

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

const REQUIRES_REASON = new Set<BookingStatus>(["CANCELLED", "NO_SHOW"]);

const BookingDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-9 w-9 bg-muted" />
      <Skeleton className="h-8 w-64 bg-muted" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-32 bg-muted" />
      ))}
    </div>
    <Skeleton className="h-64 bg-muted" />
  </div>
);

interface ConfirmStatusDialogProps {
  status: BookingStatus | null;
  onConfirm: (reason?: string) => void;
  onClose: () => void;
  isPending: boolean;
}

const ConfirmStatusDialog = ({
  status,
  onConfirm,
  onClose,
  isPending,
}: ConfirmStatusDialogProps) => {
  const [reason, setReason] = useState("");

  if (!status) return null;

  const needsReason = REQUIRES_REASON.has(status);
  const isNoShow = status === "NO_SHOW";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isNoShow ? "Xác nhận khách không đến" : "Xác nhận hủy booking"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2 text-sm text-muted-foreground">
          {isNoShow ? (
            <p>
              Booking sẽ chuyển sang trạng thái <strong>No-show</strong>. Phòng
              sẽ được giải phóng. Tiền <strong>không hoàn lại</strong>.
            </p>
          ) : (
            <p>
              Booking sẽ bị hủy. Nếu đã thanh toán, toàn bộ số tiền sẽ được hoàn
              qua Stripe.
            </p>
          )}
          {needsReason && (
            <Textarea
              placeholder="Lý do (tuỳ chọn)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Huỷ
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => onConfirm(reason)}
          >
            {isPending ? "Đang xử lý..." : TRANSITION_LABEL[status]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => router.push("/admin/bookings")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight font-mono text-foreground">
              {booking.bookingRef}
            </h1>
            <StatusBadge status={booking.status} type="booking" />
            <StatusBadge status={booking.paymentStatus} type="payment" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {booking.hotel.name} · Tạo {formatDateShort(booking.createdAt)}
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
  <Card className="bg-card border-border shadow-none">
    <CardHeader>
      <CardTitle className="text-base text-foreground">
        Thông tin khách
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tên</span>
        <span className="font-medium text-foreground">{booking.guestName}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Email</span>
        <span className="text-foreground">{booking.guestEmail}</span>
      </div>
      {booking.guestPhone && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Điện thoại</span>
          <span className="text-foreground">{booking.guestPhone}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tài khoản</span>
        <span className="text-foreground">{booking.user.name}</span>
      </div>
    </CardContent>
  </Card>
);

const StayCard = ({ booking }: { booking: BookingDetail }) => (
  <Card className="bg-card border-border shadow-none">
    <CardHeader>
      <CardTitle className="text-base text-foreground">
        Thông tin lưu trú
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Check-in</span>
        <span className="font-medium text-foreground">
          {formatDateShort(booking.checkIn)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Check-out</span>
        <span className="font-medium text-foreground">
          {formatDateShort(booking.checkOut)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Địa điểm</span>
        <span className="text-foreground">
          {booking.hotel.address.city.name},{" "}
          {booking.hotel.address.city.country.name}
        </span>
      </div>
      {booking.specialRequests && (
        <div>
          <p className="text-muted-foreground mb-1">Yêu cầu đặc biệt</p>
          <p className="text-xs bg-muted text-foreground rounded p-2">
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
  <Card className="bg-card border-border shadow-none">
    <CardHeader>
      <CardTitle className="text-base text-foreground">Thanh toán</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tổng tiền</span>
        <span className="font-bold text-base text-foreground">
          {formatCurrencyUSD(Number(booking.totalAmount))}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Trạng thái</span>
        <StatusBadge status={booking.paymentStatus} type="payment" />
      </div>
      {booking.payments.map((payment) => (
        <div key={payment.id} className="border-t border-border pt-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {payment.type === "CHARGE" ? "Thanh toán" : "Hoàn tiền"}
            </span>
            <span className="text-foreground">
              {formatCurrencyUSD(Number(payment.amount))}
            </span>
          </div>
          {payment.paidAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thời gian</span>
              <span className="text-xs text-foreground">
                {formatDatetime(payment.paidAt)}
              </span>
            </div>
          )}
          {payment.stripePaymentIntentId && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stripe ID</span>
              <span className="font-mono text-xs text-foreground truncate max-w-35">
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
  <Card className="bg-card border-border shadow-none">
    <CardHeader>
      <CardTitle className="text-base text-foreground">
        Chi tiết phòng
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {booking.items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-border bg-background p-3 space-y-2 text-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{item.room.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.room.roomType.name}
                {item.room.floor ? ` · Tầng ${item.room.floor}` : ""}
              </p>
            </div>
            <StatusBadge status={item.status} type="booking" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Check-in</span>
              <span className="text-foreground">
                {formatDateShort(item.checkIn)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span className="text-foreground">
                {formatDateShort(item.checkOut)}
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
                {formatCurrencyUSD(Number(item.unitPrice))}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Tổng</span>
              <span className="text-foreground">
                {formatCurrencyUSD(Number(item.total))}
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
    <Card className="bg-card border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base text-foreground">Đánh giá</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <StarRating value={booking.review.overallRating} readonly size="sm" />
          <StatusBadge status={booking.review.status} type="review" />
        </div>
        {booking.review.title && (
          <p className="font-medium text-foreground">{booking.review.title}</p>
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
  const [pendingStatus, setPendingStatus] = useState<BookingStatus | null>(
    null,
  );

  if (isLoading) return <BookingDetailSkeleton />;
  if (!booking) return null;

  const handleStatusChange = (status: BookingStatus) => {
    if (REQUIRES_REASON.has(status)) {
      setPendingStatus(status);
    } else {
      void updateStatus.mutateAsync({ id: bookingId, status });
    }
  };

  const handleConfirm = async (reason?: string) => {
    if (!pendingStatus) return;
    await updateStatus.mutateAsync({
      id: bookingId,
      status: pendingStatus,
      cancelReason: reason,
    });
    setPendingStatus(null);
  };

  return (
    <div className="space-y-6">
      <BookingHeader
        booking={booking}
        onStatusChange={handleStatusChange}
        isPending={updateStatus.isPending}
      />
      <div className="grid grid-cols-3 gap-4">
        <GuestCard booking={booking} />
        <StayCard booking={booking} />
        <PaymentCard booking={booking} />
      </div>
      <BookingItemsCard booking={booking} />
      <ReviewCard booking={booking} />
      <ConfirmStatusDialog
        status={pendingStatus}
        onConfirm={handleConfirm}
        onClose={() => setPendingStatus(null)}
        isPending={updateStatus.isPending}
      />
    </div>
  );
};
