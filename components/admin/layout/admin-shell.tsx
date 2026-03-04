"use client";

import { useAdminUI } from "@/store/admin-ui";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

export const AdminShell = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const { collapsed, mobileOpen, setMobileOpen } = useAdminUI();

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
      />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
