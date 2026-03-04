import { create } from "zustand";

export interface ConfirmDialogOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogState {
  confirmDialog: ConfirmDialogOptions | null;
  openConfirm: (options: ConfirmDialogOptions) => void;
  closeConfirm: () => void;
}

export const useConfirmDialogStore = create<ConfirmDialogState>((set) => ({
  confirmDialog: null,

  openConfirm: (options) => set({ confirmDialog: options }),

  closeConfirm: () => set({ confirmDialog: null }),
}));
