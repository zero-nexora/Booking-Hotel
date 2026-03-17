import type { ReactNode } from "react";
import { AccountSidebar } from "@/components/client/account/account-sidebar";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

const AccountLayout = async ({ children }: { children: ReactNode }) => {
  try {
    await requireAuth();
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex wrapper gap-6">
        <AccountSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default AccountLayout;
