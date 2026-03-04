import Link from "next/link";
import { Hotel } from "lucide-react";

export const Footer = () => (
  <footer className="border-t bg-muted/30 mt-auto">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg mb-2"
          >
            <Hotel className="w-5 h-5" />
            HotelBook
          </Link>
          <p className="text-sm text-muted-foreground">
            Hàng nghìn khách sạn trên khắp Việt Nam với giá tốt nhất.
          </p>
        </div>
        <div>
          <p className="font-medium text-sm mb-3">Công ty</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              Về chúng tôi
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Liên hệ
            </Link>
          </div>
        </div>
        <div>
          <p className="font-medium text-sm mb-3">Pháp lý</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
        <div>
          <p className="font-medium text-sm mb-3">Hỗ trợ</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>support@hotelbook.vn</span>
            <span>1800 xxxx xxxx</span>
          </div>
        </div>
      </div>
      <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HotelBook. Tất cả quyền được bảo lưu.
      </div>
    </div>
  </footer>
);
