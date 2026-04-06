"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCancelBooking } from "@/hooks/client/use-booking";
import { useRouter } from "next/navigation";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";

interface CancelSectionProps {
  bookingRef: string;
}

export const CancelSection = ({ bookingRef }: CancelSectionProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const cancel = useCancelBooking(bookingRef);
  const { openConfirm } = useConfirmDialogStore();

  const handleCancel = async () => {
    await cancel.mutateAsync({ bookingRef, cancelReason: reason || undefined });
    router.refresh();
    setOpen(false);
  };

  const handleOpenCancel = () => {
    openConfirm({
      title: "Xác nhận huỷ đặt phòng",
      description: "Bạn có chắc chắn muốn huỷ đặt phòng này không?",
      onConfirm: handleCancel,
    });
  };

  return (
    <div
      id="cancel"
      className="rounded-2xl border border-destructive/30 bg-destructive/5"
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between gap-3 p-4 text-left">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              <span className="text-sm font-medium text-destructive">
                Huỷ đặt phòng
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {open ? "Thu gọn" : "Mở rộng"}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t border-destructive/20 pt-4">
            <p className="text-sm text-muted-foreground">
              Sau khi huỷ, phòng sẽ được giải phóng. Nếu bạn đã thanh toán,
              khoản tiền sẽ được hoàn trả theo chính sách.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Lý do huỷ{" "}
                <span className="text-muted-foreground font-normal">
                  (tuỳ chọn)
                </span>
              </Label>
              <Textarea
                placeholder="Nhập lý do huỷ..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none text-sm bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={cancel.isPending}
                onClick={handleOpenCancel}
              >
                {cancel.isPending ? "Đang huỷ..." : "Xác nhận huỷ"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
