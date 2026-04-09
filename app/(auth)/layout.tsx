import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthPanelClient } from "@/components/client/layout/auth-panel-client";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await getSession();
  if (session) redirect("/");
  return (
    <div className="min-h-screen flex bg-background">
      <AuthPanelClient />
      <div className="flex-1 flex flex-col min-h-screen lg:px-12 px-6">
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;