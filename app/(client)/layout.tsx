import type { ReactNode } from "react";
import { ClientHeader } from "@/components/client/layout/client-header";
import { ClientFooter } from "@/components/client/layout/client-footer";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <main className="flex-1">{children}</main>
      <ClientFooter />
    </div>
  );
};

export default ClientLayout;
