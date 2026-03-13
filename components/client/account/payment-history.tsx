import { format } from "date-fns";
import { vi } from "date-fns/locale";
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

const PAYMENT_STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "Đang xử lý", variant: "secondary" },
  PAID: { label: "Thành công", variant: "default" },
  REFUNDED: { label: "Đã hoàn", variant: "outline" },
  FAILED: { label: "Thất bại", variant: "destructive" },
};

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  if (!payments.length) return null;

  return (
    <div className="rounded-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="text-xs">Loại</TableHead>
            <TableHead className="text-xs">Trạng thái</TableHead>
            <TableHead className="text-xs">Số tiền</TableHead>
            <TableHead className="text-xs">Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => {
            const statusInfo =
              PAYMENT_STATUS_MAP[p.status] ?? PAYMENT_STATUS_MAP.PENDING;
            const date = p.paidAt ?? p.refundedAt ?? p.createdAt;
            return (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {p.type === "CHARGE" ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span className="text-xs font-medium">
                      {p.type === "CHARGE" ? "Thanh toán" : "Hoàn tiền"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant} className="text-xs">
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-semibold">
                  {p.type === "REFUND" && (
                    <span className="text-emerald-600">+</span>
                  )}
                  ${Number(p.amount.toString())} {p.currency}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
