"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, User, BookOpen, Star, LogOut, ChevronDown } from "lucide-react";
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

const navLinks = [
  { label: "Khách sạn", href: "/hotels" },
  { label: "Điểm đến", href: "/hotels?view=map" },
];

const navItemClass = (active: boolean) =>
  cn(
    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
    active
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:text-foreground hover:bg-muted",
  );

export const ClientHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: user } = useMe();
  const [mobileOpen, setMobileOpen] = useState(false);

  const viewParam = searchParams.get("view");
  const currentUrl = viewParam ? `${pathname}?view=${viewParam}` : pathname;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo />
        </Link>

        <nav className="items-center gap-1 box-hidden">
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
                <button className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-muted transition-colors">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium box-hidden">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground box-hidden" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Tài khoản
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/bookings"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Đặt phòng của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/reviews"
                    className="flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Đánh giá của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Đăng ký</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="flex items-center justify-between px-4 h-14 border-b">
                <span className="font-semibold text-sm">Menu</span>
              </div>
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={navItemClass(currentUrl === link.href)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="pt-3 border-t mt-3 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
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
