"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Menu, Hotel } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useMe } from "@/hooks/client/use-user";

export const Header = () => {
  const { data: user } = useMe();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Hotel className="w-5 h-5" />
          HotelBook
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/hotels" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Khách sạn
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium truncate">{user.name}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/bookings">Đặt phòng của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-4 mt-6">
              <Link href="/hotels" onClick={() => setOpen(false)} className="text-sm font-medium">
                Khách sạn
              </Link>
              <div className="border-t pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/account/profile" onClick={() => setOpen(false)} className="text-sm">Hồ sơ</Link>
                    <Link href="/account/bookings" onClick={() => setOpen(false)} className="text-sm">Đặt phòng của tôi</Link>
                    <button onClick={handleSignOut} className="text-sm text-destructive text-left">Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild><Link href="/login">Đăng nhập</Link></Button>
                    <Button size="sm" asChild><Link href="/register">Đăng ký</Link></Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};