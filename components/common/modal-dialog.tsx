"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModalDialogStore } from "@/store/modal-dialog-store";

export const ModalDialog = () => {
  const { modalDialog, closeModal } = useModalDialogStore();

  if (!modalDialog) return null;

  const { title, description, content, onClose } = modalDialog;

  const handleClose = () => {
    onClose?.();
    closeModal();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-4">{content}</div>
      </DialogContent>
    </Dialog>
  );
};
