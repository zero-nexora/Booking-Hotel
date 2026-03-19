"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Star, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/client/use-user";
import { authClient } from "@/lib/auth-client";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

const navLinks = [
  { href: "/account", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/account/bookings", label: "Đặt phòng của tôi", icon: BookOpen },
  { href: "/account/reviews", label: "Đánh giá của tôi", icon: Star },
  { href: "/account/profile", label: "Hồ sơ", icon: User },
];

export const AccountSidebar = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { openConfirm } = useConfirmDialogStore();

  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useMe();

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.removeQueries({ queryKey: trpc.client.user.me.queryKey() });
    router.push("/");
  };

  const handleOpenConfirmLogout = async () => {
    openConfirm({
      title: "Đăng xuất",
      description: "Bạn có chắc chắn muốn đăng xuất không?",
      variant: "destructive",
      onConfirm: handleSignOut,
    });
  };

  return (
    <aside className="w-full md:w-52 shrink-0">
      <div className="flex items-center gap-3 mb-4 px-1">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.image ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-foreground">
            {user?.name ?? "..."}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email ?? ""}
          </p>
        </div>
      </div>

      <Separator className="mb-3 bg-border" />

      <nav className="space-y-0.5">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/account" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <Separator className="my-2 bg-border" />

        <button
          onClick={handleOpenConfirmLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Đăng xuất
        </button>
      </nav>
    </aside>
  );
};
