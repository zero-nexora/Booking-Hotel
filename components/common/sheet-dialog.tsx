"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSheetDialogStore } from "@/store/sheet-dialog-store";

export const SheetDialog = () => {
  const { sheetDialog, closeSheet } = useSheetDialogStore();

  if (!sheetDialog) return null;

  const { title, content, onClose } = sheetDialog;

  const handleClose = () => {
    onClose?.();
    closeSheet();
  };

  return (
    <Sheet open onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0 bg-card border-border">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-foreground">
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-6 space-y-6">{content}</div>
      </SheetContent>
    </Sheet>
  );
};
