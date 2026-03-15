"use client";

import { Menu, Bell, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import { useAdminUI } from "@/store/admin-ui";
import { ThemeToggle } from "@/components/common/theme-toggle";

export const AdminHeader = () => {
  const { collapsed, toggleCollapsed, setMobileOpen } = useAdminUI();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
        onClick={toggleCollapsed}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-4 h-4" />
      </Button>

      <AdminBreadcrumb />

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  );
};
