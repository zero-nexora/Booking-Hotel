"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  User,
  BookOpen,
  Star,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/client/use-user";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Logo } from "@/components/common/logo";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const navLinks = [
  { label: "Khách sạn", href: "/hotels" },
  { label: "Bản đồ", href: "/hotels?view=map" },
  { label: "Điều khoản sử dụng", href: "/terms" },
  { label: "Chính sách bảo mật", href: "/privacy" },
];

export const ClientHeader = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { openConfirm } = useConfirmDialogStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: user } = useMe();
  const [mobileOpen, setMobileOpen] = useState(false);

  const viewParam = searchParams.get("view");
  const currentUrl = viewParam ? `${pathname}?view=${viewParam}` : pathname;

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.removeQueries({ queryKey: trpc.client.user.me.queryKey() });
    router.push("/");
  };

  const handleOpenConfirmLogout = () => {
    openConfirm({
      title: "Đăng xuất",
      description: "Bạn có chắc chắn muốn đăng xuất không?",
      variant: "destructive",
      onConfirm: handleSignOut,
    });
  };

  const initials = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="box-hidden items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors px-1 py-0.5 border-b-2",
                currentUrl === link.href
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-muted transition-colors">
                  <Avatar className="size-7">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block max-w-32 truncate text-foreground">
                    {user.name}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="size-4" /> Tài khoản
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/bookings"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="size-4" /> Đặt phòng của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/reviews"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Star className="size-4" /> Đánh giá của tôi
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="size-4" /> Quản trị
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={handleOpenConfirmLogout}
                >
                  <LogOut className="size-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className=" items-center gap-2 box-hidden">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-border text-foreground hover:bg-muted hover:text-foreground"
              >
                <Link href="/sign-in">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Đăng ký</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden size-9">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex items-center h-14 px-4 border-b border-border">
                <Logo />
              </div>
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-colors",
                      currentUrl === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {user ? (
                  <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-border">
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <User className="size-4" /> Tài khoản
                    </Link>
                    <Link
                      href="/account/bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <BookOpen className="size-4" /> Đặt phòng của tôi
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleOpenConfirmLogout();
                      }}
                      className="flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full text-left"
                    >
                      <LogOut className="size-4" /> Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-muted hover:text-foreground w-full"
                      asChild
                    >
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
