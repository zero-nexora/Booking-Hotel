"use client";

import { useRef } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

type BookingPrintData = {
  bookingRef: string;
  status: string;
  paymentStatus: string;
  checkIn: string | Date;
  checkOut: string | Date;
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  specialRequests?: string | null;
  totalAmount: { toString(): string };
  currency: string;
  hotel: {
    name: string;
    phone?: string | null;
    email?: string | null;
    starRating: number;
    policy?: { checkInTime: string; checkOutTime: string } | null;
    address: {
      street: string;
      city: { name: string; country: { name: string } };
    };
  };
  items: {
    nights: number;
    adults: number;
    children: number;
    unitPrice: { toString(): string };
    room: { name: string; roomType: { name: string } };
  }[];
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Đang chờ",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  CHECKED_OUT: "Đã check-out",
  CANCELLED: "Đã huỷ",
  NO_SHOW: "Không đến",
};

const PAYMENT_LABEL: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Đang xử lý",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

interface BookingPrintProps {
  booking: BookingPrintData;
}

export const BookingPrint = ({ booking }: BookingPrintProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const el = printRef.current;
    if (!el) return;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <title>Phiếu xác nhận đặt phòng — ${booking.bookingRef}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Nunito+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; color: #1A1612; background: #F5F0E8; }
          .page { max-width: 720px; margin: 0 auto; padding: 40px 48px; background: #F5F0E8; }
          .header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 24px; border-bottom: 1.5px solid #C9A96E; margin-bottom: 28px; }
          .brand { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 400; letter-spacing: 0.06em; color: #1A1612; }
          .brand span { color: #C9A96E; }
          .brand-sub { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #7A6F5E; margin-top: 4px; font-weight: 500; }
          .voucher-label { text-align: right; }
          .voucher-label .ref-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #7A6F5E; margin-bottom: 5px; font-weight: 600; }
          .voucher-label .ref { font-size: 17px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 0.06em; color: #1A1612; background: #EDE8DC; border: 1px solid #DDD6C4; border-left: 3px solid #C9A96E; padding: 6px 12px; border-radius: 4px; display: inline-block; }
          .status-row { display: flex; gap: 8px; margin-bottom: 28px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
          .badge-green { background: #EAF0E8; color: #3A6B35; border: 1px solid #C6D9C0; }
          .badge-blue { background: #EDE8DC; color: #5C4A20; border: 1px solid #DDD6C4; }
          .badge-red { background: #F9ECEC; color: #8B2E2E; border: 1px solid #E8CACA; }
          .badge-gray { background: #EDE8DC; color: #7A6F5E; border: 1px solid #DDD6C4; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #7A6F5E; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #DDD6C4; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
          .field-label { font-size: 9px; color: #7A6F5E; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
          .field-value { font-size: 13px; font-weight: 500; color: #1A1612; line-height: 1.4; }
          .field-sub { font-size: 11px; color: #7A6F5E; margin-top: 2px; }
          .special-box { margin-top: 12px; padding: 10px 14px; background: #EDE8DC; border-radius: 6px; border: 1px solid #DDD6C4; border-left: 3px solid #C9A96E; font-size: 12px; color: #4A4035; line-height: 1.6; }
          .special-box strong { color: #1A1612; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7A6F5E; padding: 8px 10px; background: #EDE8DC; border: 1px solid #DDD6C4; }
          td { padding: 9px 10px; border: 1px solid #DDD6C4; font-size: 12px; vertical-align: top; color: #1A1612; background: #FAF7F2; line-height: 1.5; }
          tr:nth-child(even) td { background: #F5F0E8; }
          .td-right { text-align: right; }
          .total-row td { font-weight: 700; background: #1A1612; color: #F5F0E8; font-size: 13px; border-color: #1A1612; }
          .total-row .td-right { color: #C9A96E; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 15px; letter-spacing: 0.04em; }
          .footer { margin-top: 36px; padding-top: 20px; border-top: 1px dashed #C9A96E; display: flex; justify-content: space-between; align-items: flex-end; }
          .footer-note { font-size: 10px; color: #7A6F5E; line-height: 1.8; }
          .footer-note p + p { margin-top: 2px; }
          .footer-note .print-time { color: #B5A898; margin-top: 6px; }
          .qr-placeholder { width: 72px; height: 72px; border: 1px solid #DDD6C4; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #7A6F5E; text-align: center; background: #EDE8DC; font-family: 'Courier New', monospace; word-break: break-all; padding: 6px; line-height: 1.4; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 80px; font-weight: 900; color: rgba(139,46,46,0.06); letter-spacing: 4px; pointer-events: none; user-select: none; white-space: nowrap; }
          @media print { body { background: #F5F0E8; } .page { padding: 24px 32px; } }
        </style>
      </head>
      <body>
        ${booking.status === "CANCELLED" ? '<div class="watermark">ĐÃ HUỶ</div>' : ""}
        <div class="page">
          <div class="header">
            <div>
              <div class="brand">Stay<span>wise</span></div>
              <div class="brand-sub">Phiếu xác nhận đặt phòng</div>
            </div>
            <div class="voucher-label">
              <div class="ref-label">Mã đặt phòng</div>
              <div class="ref">${booking.bookingRef}</div>
            </div>
          </div>
          <div class="status-row">
            <span class="badge ${getStatusBadgeClass(booking.status)}">${STATUS_LABEL[booking.status] ?? booking.status}</span>
            <span class="badge ${getPaymentBadgeClass(booking.paymentStatus)}">${PAYMENT_LABEL[booking.paymentStatus] ?? booking.paymentStatus}</span>
          </div>
          <div class="section">
            <div class="section-title">Thông tin khách sạn</div>
            <div class="grid-2">
              <div>
                <div class="field-label">Tên khách sạn</div>
                <div class="field-value">${booking.hotel.name} <span style="color:#C9A96E;font-size:12px;">${"★".repeat(booking.hotel.starRating)}</span></div>
              </div>
              <div>
                <div class="field-label">Địa chỉ</div>
                <div class="field-value">${booking.hotel.address.street}, ${booking.hotel.address.city.name}, ${booking.hotel.address.city.country.name}</div>
              </div>
              ${booking.hotel.phone ? `<div><div class="field-label">Điện thoại</div><div class="field-value">${booking.hotel.phone}</div></div>` : ""}
              ${booking.hotel.email ? `<div><div class="field-label">Email</div><div class="field-value">${booking.hotel.email}</div></div>` : ""}
            </div>
          </div>
          <div class="section">
            <div class="section-title">Thời gian lưu trú</div>
            <div class="grid-3">
              <div>
                <div class="field-label">Ngày nhận phòng</div>
                <div class="field-value">${format(new Date(booking.checkIn), "EEEE, dd/MM/yyyy", { locale: vi })}</div>
                ${booking.hotel.policy ? `<div class="field-sub">Từ ${booking.hotel.policy.checkInTime}</div>` : ""}
              </div>
              <div>
                <div class="field-label">Ngày trả phòng</div>
                <div class="field-value">${format(new Date(booking.checkOut), "EEEE, dd/MM/yyyy", { locale: vi })}</div>
                ${booking.hotel.policy ? `<div class="field-sub">Trước ${booking.hotel.policy.checkOutTime}</div>` : ""}
              </div>
              <div>
                <div class="field-label">Số đêm</div>
                <div class="field-value">${booking.items[0]?.nights ?? "—"} đêm</div>
              </div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Thông tin khách lưu trú</div>
            <div class="grid-3">
              <div><div class="field-label">Họ và tên</div><div class="field-value">${booking.guestName}</div></div>
              <div><div class="field-label">Email</div><div class="field-value">${booking.guestEmail}</div></div>
              ${booking.guestPhone ? `<div><div class="field-label">Điện thoại</div><div class="field-value">${booking.guestPhone}</div></div>` : ""}
            </div>
            ${booking.specialRequests ? `<div class="special-box"><strong>Yêu cầu đặc biệt:</strong> ${booking.specialRequests}</div>` : ""}
          </div>
          <div class="section">
            <div class="section-title">Chi tiết phòng</div>
            <table>
              <thead>
                <tr>
                  <th>Tên phòng</th><th>Loại phòng</th><th>Khách</th><th>Số đêm</th>
                  <th class="td-right">Đơn giá</th><th class="td-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${booking.items
                  .map((item) => {
                    const unit = Number(item.unitPrice.toString());
                    const subtotal = unit * item.nights;
                    const guests = `${item.adults} người lớn${item.children > 0 ? ` + ${item.children} trẻ em` : ""}`;
                    return `<tr>
                    <td>${item.room.name}</td><td>${item.room.roomType.name}</td>
                    <td>${guests}</td><td>${item.nights}</td>
                    <td class="td-right">${unit.toLocaleString()} ${booking.currency}</td>
                    <td class="td-right">${subtotal.toLocaleString()} ${booking.currency}</td>
                  </tr>`;
                  })
                  .join("")}
                <tr class="total-row">
                  <td colspan="5">Tổng thanh toán</td>
                  <td class="td-right">${Number(booking.totalAmount.toString()).toLocaleString()} ${booking.currency}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="footer">
            <div class="footer-note">
              <p>Vui lòng xuất trình phiếu này khi đến check-in.</p>
              <p>Liên hệ hỗ trợ: support@staywise.vn</p>
              <p class="print-time">In lúc: ${format(new Date(), "HH:mm dd/MM/yyyy")}</p>
            </div>
            <div class="qr-placeholder">${booking.bookingRef}</div>
          </div>
        </div>
        <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <>
      <div ref={printRef} className="hidden" aria-hidden />
      <Button
        variant="outline"
        className="rounded-xl gap-2 border-border text-foreground hover:bg-muted hover:text-foreground"
        onClick={handlePrint}
      >
        <Printer className="w-4 h-4" />
        In xác nhận
      </Button>
    </>
  );
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "CONFIRMED":
    case "CHECKED_IN":
      return "badge-green";
    case "CANCELLED":
    case "NO_SHOW":
      return "badge-red";
    case "CHECKED_OUT":
      return "badge-gray";
    default:
      return "badge-blue";
  }
};

const getPaymentBadgeClass = (status: string): string => {
  switch (status) {
    case "PAID":
      return "badge-green";
    case "FAILED":
    case "UNPAID":
    case "CANCELLED":
      return "badge-red";
    case "REFUNDED":
      return "badge-gray";
    default:
      return "badge-blue";
  }
};
