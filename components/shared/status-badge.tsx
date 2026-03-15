import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BOOKING_STATUS: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-secondary text-secondary-foreground border-border",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  CHECKED_IN: {
    label: "Đang ở",
    className: "bg-accent text-accent-foreground border-border",
  },
  CHECKED_OUT: {
    label: "Đã trả phòng",
    className: "bg-muted text-muted-foreground border-border",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  NO_SHOW: {
    label: "Không đến",
    className: "bg-secondary text-secondary-foreground border-border",
  },
};

const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  UNPAID: {
    label: "Chưa thanh toán",
    className: "bg-muted text-muted-foreground border-border",
  },
  PENDING: {
    label: "Đang xử lý",
    className: "bg-secondary text-secondary-foreground border-border",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "bg-accent text-accent-foreground border-border",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  FAILED: {
    label: "Thất bại",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const REVIEW_STATUS: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Chờ duyệt",
    className: "bg-secondary text-secondary-foreground border-border",
  },
  APPROVED: {
    label: "Đã duyệt",
    className: "bg-accent text-accent-foreground border-border",
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const HOTEL_STATUS: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-accent text-accent-foreground border-border",
  },
  INACTIVE: {
    label: "Không hoạt động",
    className: "bg-muted text-muted-foreground border-border",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    className: "bg-secondary text-secondary-foreground border-border",
  },
};

const USER_ROLE: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: "Admin",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  CUSTOMER: {
    label: "Customer",
    className: "bg-primary/10 text-primary border-primary/20",
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

export const StatusBadge = ({
  status,
  type = "booking",
  className,
}: StatusBadgeProps) => {
  const map = STATUS_MAPS[type];
  const config = map[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
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
};
