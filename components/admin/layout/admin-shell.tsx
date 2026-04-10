"use client";

import { useAdminUI } from "@/store/admin-ui";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { User } from "better-auth";

export const AdminShell = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const { collapsed, mobileOpen, setMobileOpen } = useAdminUI();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
      />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/40 box-block"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
};
