"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";

export const ConfirmDialog = () => {
  const { confirmDialog, closeConfirm } = useConfirmDialogStore();
  const [isPending, setIsPending] = useState(false);

  if (!confirmDialog) return null;

  const {
    title,
    description,
    confirmLabel = "Xác nhận",
    cancelLabel = "Hủy",
    variant = "default",
    onConfirm,
    onCancel,
  } = confirmDialog;

  async function handleConfirm() {
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
      closeConfirm();
    }
  }

  function handleCancel() {
    onCancel?.();
    closeConfirm();
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              variant === "destructive" &&
                buttonVariants({ variant: "destructive" }),
            )}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
