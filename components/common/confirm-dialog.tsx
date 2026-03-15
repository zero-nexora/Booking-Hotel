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

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
      closeConfirm();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    closeConfirm();
  };

  return (
    <AlertDialog open onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isPending}
            className="border-border text-foreground hover:bg-muted hover:text-foreground"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              variant === "destructive"
                ? buttonVariants({ variant: "destructive" })
                : "bg-primary text-primary-foreground hover:bg-primary/90",
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
