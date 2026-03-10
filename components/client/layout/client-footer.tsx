import Link from "next/link";
import { Logo } from "@/components/common/logo";

const links = [
  { label: "Tìm khách sạn", href: "/hotels" },
  { label: "Điểm đến", href: "/hotels?view=map" },
  { label: "Đặt phòng của tôi", href: "/account/bookings" },
];

export const ClientFooter = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo />
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
};
