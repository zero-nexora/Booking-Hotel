"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "../ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ConfirmDialog } from "../common/confirm-dialog";
import { ModalDialog } from "../common/modal-dialog";
import { SheetDialog } from "../common/sheet-dialog";
import { ThemeProvider } from "./theme-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
        <ConfirmDialog />
        <ModalDialog />
        <SheetDialog />
      </TRPCReactProvider>
    </ThemeProvider>
  );
};
