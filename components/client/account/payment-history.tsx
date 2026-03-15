import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDatetime, formatCurrencyUSD } from "@/lib/utils";

type Payment = {
  id: string;
  type: "CHARGE" | "REFUND";
  status: string;
  amount: { toString(): string };
  currency: string;
  paidAt?: Date | null;
  refundedAt?: Date | null;
  createdAt: Date;
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; className: string }> =
  {
    PENDING: {
      label: "Đang xử lý",
      className: "bg-secondary text-secondary-foreground border-border",
    },
    PAID: {
      label: "Thành công",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    REFUNDED: {
      label: "Đã hoàn",
      className: "bg-muted text-muted-foreground border-border",
    },
    FAILED: {
      label: "Thất bại",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  if (!payments.length) return null;

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 border-border hover:bg-transparent">
            <TableHead className="text-xs text-muted-foreground font-medium">
              Loại
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Trạng thái
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Số tiền
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Thời gian
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => {
            const statusInfo =
              PAYMENT_STATUS_MAP[p.status] ?? PAYMENT_STATUS_MAP.PENDING;
            const date = p.paidAt ?? p.refundedAt ?? p.createdAt;
            return (
              <TableRow key={p.id} className="border-border hover:bg-muted/40">
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {p.type === "CHARGE" ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-accent-foreground" />
                    )}
                    <span className="text-xs font-medium text-foreground">
                      {p.type === "CHARGE" ? "Thanh toán" : "Hoàn tiền"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-semibold text-foreground">
                  {p.type === "REFUND" && (
                    <span className="text-primary">+</span>
                  )}
                  {formatCurrencyUSD(Number(p.amount.toString()))}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDatetime(new Date(date))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
