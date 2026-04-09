"use client";

import { useRef } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardAnalyticsReport } from "@/hooks/admin/use-admin-dashboard";

export const DashboardPrint = () => {
  const { data, isLoading } = useDashboardAnalyticsReport();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!data) return;

    const now = new Date();
    const monthLabel = format(new Date(data.month + "-01"), "MMMM yyyy", {
      locale: vi,
    });

    // Build booking status rows
    const statusRows = data.bookingsByStatus
      .map(
        (s) => `
        <tr>
          <td>${s.label}</td>
          <td class="td-right">${s.count}</td>
          <td class="td-right">${data.totalBookings > 0 ? ((s.count / data.totalBookings) * 100).toFixed(1) : 0}%</td>
        </tr>`,
      )
      .join("");

    // Build top hotels rows
    const hotelRows = data.topHotels
      .map(
        (h, i) => `
        <tr>
          <td class="td-center">${i + 1}</td>
          <td>${h.name}</td>
          <td class="td-right">${h.bookings}</td>
          <td class="td-right">${h.revenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
        </tr>`,
      )
      .join("");

    // Build mini sparkline-style revenue bars (text-based)
    const maxRev = Math.max(...data.revenueByDay.map((d) => d.revenue), 1);
    const revenueRows = data.revenueByDay
      .filter((d) => d.revenue > 0)
      .map((d) => {
        const pct = Math.round((d.revenue / maxRev) * 100);
        return `
        <tr>
          <td>${format(new Date(d.date), "dd/MM", { locale: vi })}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:${pct}%;max-width:220px;min-width:2px;height:8px;background:#C9A96E;border-radius:4px;transition:width .3s"></div>
            </div>
          </td>
          <td class="td-right">${d.revenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
        </tr>`;
      })
      .join("");

    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8"/>
        <title>Báo cáo thống kê — ${monthLabel}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Nunito+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Nunito Sans',-apple-system,BlinkMacSystemFont,sans-serif; font-size:13px; color:#1A1612; background:#F5F0E8; }
          .page { max-width:780px; margin:0 auto; padding:40px 48px; background:#F5F0E8; }

          /* Header */
          .header { display:flex; align-items:flex-start; justify-content:space-between; padding-bottom:24px; border-bottom:1.5px solid #C9A96E; margin-bottom:28px; }
          .brand { font-family:'Cormorant Garamond',Georgia,serif; font-size:26px; font-weight:400; letter-spacing:.06em; color:#1A1612; }
          .brand span { color:#C9A96E; }
          .brand-sub { font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:#7A6F5E; margin-top:4px; font-weight:500; }
          .report-meta { text-align:right; }
          .report-meta .report-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:#7A6F5E; }
          .report-meta .report-period { font-size:18px; font-weight:700; font-family:'Cormorant Garamond',Georgia,serif; color:#1A1612; margin-top:4px; }

          /* KPI summary cards */
          .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; }
          .kpi { background:#EDE8DC; border:1px solid #DDD6C4; border-left:3px solid #C9A96E; border-radius:6px; padding:12px 14px; }
          .kpi .kpi-label { font-size:9px; text-transform:uppercase; letter-spacing:.12em; color:#7A6F5E; font-weight:600; margin-bottom:6px; }
          .kpi .kpi-value { font-size:18px; font-weight:700; font-family:'Cormorant Garamond',Georgia,serif; color:#1A1612; }
          .kpi .kpi-sub { font-size:10px; color:#7A6F5E; margin-top:4px; }
          .kpi .kpi-sub.up { color:#3A6B35; }
          .kpi .kpi-sub.down { color:#8B2E2E; }

          /* Sections */
          .section { margin-bottom:28px; }
          .section-title { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.14em; color:#7A6F5E; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #DDD6C4; }

          /* Tables */
          table { width:100%; border-collapse:collapse; }
          th { text-align:left; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#7A6F5E; padding:8px 10px; background:#EDE8DC; border:1px solid #DDD6C4; }
          td { padding:8px 10px; border:1px solid #DDD6C4; font-size:12px; vertical-align:middle; color:#1A1612; background:#FAF7F2; }
          tr:nth-child(even) td { background:#F5F0E8; }
          .td-right { text-align:right; }
          .td-center { text-align:center; }

          /* Footer */
          .footer { margin-top:36px; padding-top:20px; border-top:1px dashed #C9A96E; display:flex; justify-content:space-between; align-items:flex-end; }
          .footer-note { font-size:10px; color:#7A6F5E; line-height:1.8; }
          .print-time { color:#B5A898; margin-top:6px; }
          .ref-box { font-size:8px; color:#7A6F5E; text-align:right; font-family:'Courier New',monospace; }

          @media print { body { background:#F5F0E8; } .page { padding:24px 32px; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <div class="brand">Stay<span>wise</span></div>
              <div class="brand-sub">Báo cáo thống kê vận hành</div>
            </div>
            <div class="report-meta">
              <div class="report-title">Kỳ báo cáo</div>
              <div class="report-period">${monthLabel}</div>
            </div>
          </div>

          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi">
              <div class="kpi-label">Tổng booking</div>
              <div class="kpi-value">${data.totalBookings.toLocaleString()}</div>
              <div class="kpi-sub">${data.cancelledCount} đã hủy</div>
            </div>
            <div class="kpi">
              <div class="kpi-label">Tỷ lệ hủy</div>
              <div class="kpi-value">${data.cancellationRate.toFixed(1)}%</div>
              <div class="kpi-sub ${data.cancellationRate > 20 ? "down" : "up"}">${data.cancellationRate > 20 ? "▲ Cao" : "▼ Tốt"}</div>
            </div>
            <div class="kpi">
              <div class="kpi-label">Giá trị TB / đơn</div>
              <div class="kpi-value">$${data.avgBookingValue.toFixed(0)}</div>
              <div class="kpi-sub ${(data.avgValueGrowth ?? 0) >= 0 ? "up" : "down"}">
                ${data.avgValueGrowth !== null ? `${data.avgValueGrowth >= 0 ? "▲" : "▼"} ${Math.abs(data.avgValueGrowth).toFixed(1)}% vs tháng trước` : "Chưa có dữ liệu trước"}
              </div>
            </div>
            <div class="kpi">
              <div class="kpi-label">Người dùng mới</div>
              <div class="kpi-value">${data.newUsers.toLocaleString()}</div>
              <div class="kpi-sub">/ ${data.totalUsers.toLocaleString()} tổng</div>
            </div>
          </div>

          <!-- Booking by status -->
          <div class="section">
            <div class="section-title">Phân bổ booking theo trạng thái</div>
            <table>
              <thead><tr><th>Trạng thái</th><th class="td-right">Số lượng</th><th class="td-right">Tỷ lệ</th></tr></thead>
              <tbody>${statusRows}</tbody>
            </table>
          </div>

          <!-- Top hotels -->
          <div class="section">
            <div class="section-title">Top khách sạn theo doanh thu</div>
            <table>
              <thead><tr><th class="td-center">#</th><th>Khách sạn</th><th class="td-right">Booking</th><th class="td-right">Doanh thu</th></tr></thead>
              <tbody>${hotelRows || '<tr><td colspan="4" style="text-align:center;color:#7A6F5E">Chưa có dữ liệu</td></tr>'}</tbody>
            </table>
          </div>

          <!-- Revenue by day -->
          <div class="section">
            <div class="section-title">Doanh thu theo ngày (các ngày có phát sinh)</div>
            <table>
              <thead><tr><th>Ngày</th><th>Biểu đồ</th><th class="td-right">Doanh thu</th></tr></thead>
              <tbody>${revenueRows || '<tr><td colspan="3" style="text-align:center;color:#7A6F5E">Chưa có dữ liệu</td></tr>'}</tbody>
            </table>
          </div>

          <div class="footer">
            <div class="footer-note">
              <p>Báo cáo được tạo tự động từ hệ thống Staywise.</p>
              <p>Liên hệ: support@staywise.vn</p>
              <p class="print-time">Xuất lúc: ${format(now, "HH:mm dd/MM/yyyy")}</p>
            </div>
            <div class="ref-box">
              STAYWISE ANALYTICS<br/>
              ${data.month}<br/>
              v1.0
            </div>
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
        disabled={isLoading || !data}
      >
        <FileBarChart className="w-4 h-4" />
        Xuất báo cáo
      </Button>
    </>
  );
};