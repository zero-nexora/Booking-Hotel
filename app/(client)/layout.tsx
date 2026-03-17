import { Suspense, type ReactNode } from "react";
import { ClientHeader } from "@/components/client/layout/client-header";
import { ClientFooter } from "@/components/client/layout/client-footer";
import Loading from "../loading";

const ClientLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Suspense
      fallback={<Loading />}
    >
      <ClientHeader />
    </Suspense>
    <main className="flex-1">{children}</main>
    <ClientFooter />
  </div>
);

export default ClientLayout;
