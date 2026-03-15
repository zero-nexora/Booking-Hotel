import type { ReactNode } from "react";
import { AccountSidebar } from "@/components/client/account/account-sidebar";

const AccountLayout = ({ children }: { children: ReactNode }) => (
  <div className="max-w-5xl mx-auto px-4 py-8">
    <div className="flex gap-6">
      <AccountSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  </div>
);

export default AccountLayout;
