import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BOOKING_STATUS: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  CHECKED_IN: {
    label: "Đang ở",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  CHECKED_OUT: {
    label: "Đã trả phòng",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  NO_SHOW: {
    label: "Không đến",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  UNPAID: {
    label: "Chưa thanh toán",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  PENDING: {
    label: "Đang xử lý",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    className: "bg-violet-100 text-violet-700 border-violet-200",
  },
  FAILED: {
    label: "Thất bại",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const REVIEW_STATUS: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Chờ duyệt",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Đã duyệt",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const HOTEL_STATUS: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  INACTIVE: {
    label: "Không hoạt động",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
};

const USER_ROLE: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: "Admin",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  CUSTOMER: {
    label: "Customer",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
};

type StatusType = "booking" | "payment" | "review" | "hotel" | "role";

const STATUS_MAPS: Record<
  StatusType,
  Record<string, { label: string; className: string }>
> = {
  booking: BOOKING_STATUS,
  payment: PAYMENT_STATUS,
  review: REVIEW_STATUS,
  hotel: HOTEL_STATUS,
  role: USER_ROLE,
};

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

export function StatusBadge({
  status,
  type = "booking",
  className,
}: StatusBadgeProps) {
  const map = STATUS_MAPS[type];
  const config = map[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-xs whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
