import { create } from "zustand";
import { ReactNode } from "react";

export interface SheetDialogOptions {
  title: string;
  content: ReactNode;
  onClose?: () => void;
}

interface SheetDialogState {
  sheetDialog: SheetDialogOptions | null;
  openSheet: (options: SheetDialogOptions) => void;
  closeSheet: () => void;
}

export const useSheetDialogStore = create<SheetDialogState>((set) => ({
  sheetDialog: null,
  openSheet: (options) => set({ sheetDialog: options }),
  closeSheet: () => set({ sheetDialog: null }),
}));