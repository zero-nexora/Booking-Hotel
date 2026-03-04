import { create } from "zustand";
import { ReactNode } from "react";

export interface ModalDialogOptions {
  title: string;
  description?: string;
  content: ReactNode; 
  onClose?: () => void;
}

interface ModalDialogState {
  modalDialog: ModalDialogOptions | null;
  openModal: (options: ModalDialogOptions) => void;
  closeModal: () => void;
}

export const useModalDialogStore = create<ModalDialogState>((set) => ({
  modalDialog: null,

  openModal: (options) => set({ modalDialog: options }),

  closeModal: () => set({ modalDialog: null }),
}));