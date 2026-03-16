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

const navLinks = [
  { label: "Khách sạn", href: "/hotels" },
  { label: "Điểm đến", href: "/hotels?view=map" },
];

const navItemClass = (active: boolean) =>
  cn(
    "text-sm font-medium px-1 py-0.5 border-b-2",
    active
      ? "text-foreground border-primary"
      : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
  );

export const ClientHeader = () => {
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
    router.push("/sign-in");
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
              className={navItemClass(currentUrl === link.href)}
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
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
                  <Avatar className="size-7">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-32 truncate">{user.name}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-card border-border text-foreground"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 cursor-pointer text-foreground hover:bg-muted"
                  >
                    <User className="size-4" />
                    Tài khoản
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 cursor-pointer text-foreground hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" />
                      Trang quản trị
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/bookings"
                    className="flex items-center gap-2 cursor-pointer text-foreground hover:bg-muted"
                  >
                    <BookOpen className="size-4" />
                    Đặt phòng của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/reviews"
                    className="flex items-center gap-2 cursor-pointer text-foreground hover:bg-muted"
                  >
                    <Star className="size-4" />
                    Đánh giá của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={handleOpenConfirmLogout}
                >
                  <LogOut className="size-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="box-hidden items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                asChild
              >
                <Link href="/sign-in">Đăng nhập</Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/sign-up">Đăng ký</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden size-9 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-background border-border p-0"
            >
              <div className="flex items-center h-14 px-4 border-b border-border">
                <span className="text-sm font-semibold text-foreground">
                  Menu
                </span>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center h-10 px-3 rounded-lg text-sm font-medium",
                      currentUrl === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border bg-background text-foreground hover:bg-muted hover:text-foreground"
                      asChild
                    >
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      asChild
                    >
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
