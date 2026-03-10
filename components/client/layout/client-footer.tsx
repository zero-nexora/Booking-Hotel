import Link from "next/link";
import { Hotel } from "lucide-react";

const links = [
  { label: "Tìm khách sạn", href: "/hotels" },
  { label: "Điểm đến", href: "/hotels?view=map" },
  { label: "Đặt phòng của tôi", href: "/account/bookings" },
];

export function ClientFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Hotel className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">StayBook</span>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StayBook
          </p>
        </div>
      </div>
    </footer>
  );
}
