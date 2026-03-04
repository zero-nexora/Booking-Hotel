"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Star,
  Sparkles,
  Users,
  ChevronRight,
  LogOut,
  Hotel,
  Globe,
  MapPin,
  Home,
  BedDouble,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hotels", label: "Khách sạn", icon: Building2 },
  { href: "/admin/room-types", label: "Loại phòng", icon: Home },
  { href: "/admin/bed-types", label: "Loại giường", icon: BedDouble },
  { href: "/admin/amenities", label: "Tiện nghi", icon: Sparkles },
  { href: "/admin/bookings", label: "Đặt phòng", icon: CalendarDays },
  { href: "/admin/reviews", label: "Đánh giá", icon: Star },
  { href: "/admin/countries", label: "Quốc gia", icon: Globe },
  { href: "/admin/cities", label: "Thành phố", icon: MapPin },
  { href: "/admin/users", label: "Người dùng", icon: Users },
];

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  user: User;
}

export const AdminSidebar = ({
  collapsed,
  mobileOpen,
  onMobileClose,
  user,
}: AdminSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-card border-r",
          collapsed ? "w-16" : "w-64",
          "lg:relative lg:translate-x-0",
          mobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b gap-3",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shrink-0">
            <Hotel className="w-4 h-4" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-tight">
              HotelAdmin
            </span>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                  collapsed && "justify-center px-0 w-10 h-10 mx-auto",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <ChevronRight className="w-3 h-3 ml-auto" />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>

        <div className={cn("p-4 border-t", collapsed && "px-2")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 mx-auto flex"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Đăng xuất</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 shrink-0"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
