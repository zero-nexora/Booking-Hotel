import Link from "next/link";
import { Logo } from "@/components/common/logo";

const navLinks = [
  { label: "Tìm khách sạn", href: "/hotels" },
  { label: "Xem bản đồ", href: "/hotels?view=map" },
  { label: "Đặt phòng của tôi", href: "/account/bookings" },
];

const legalLinks = [
  { label: "Điều khoản sử dụng", href: "/terms" },
  { label: "Chính sách bảo mật", href: "/privacy" },
];

export const ClientFooter = () => (
  <footer className="border-t border-border bg-background">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Staywise
        </p>
      </div>
    </div>
  </footer>
);
