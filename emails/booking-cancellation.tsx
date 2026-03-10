import {
  Heading,
  Hr,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

interface BookingCancellationEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  refundAmount?: string;
  cancelReason?: string;
  hotelsUrl: string;
}

export function BookingCancellationEmail({
  name,
  bookingRef,
  hotelName,
  roomName,
  checkIn,
  checkOut,
  totalAmount,
  currency,
  refundAmount,
  cancelReason,
  hotelsUrl,
}: BookingCancellationEmailProps) {
  return (
    <EmailLayout preview={`Đặt phòng #${bookingRef} đã bị huỷ`}>
      <Section style={cancelBadge}>
        <Text style={cancelText}>✕ Đặt phòng đã bị huỷ</Text>
      </Section>

      <Heading style={h1}>Đặt phòng đã bị huỷ</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Đặt phòng của bạn đã được huỷ thành công. Dưới đây là thông tin tóm tắt:
      </Text>

      <Section style={detailBox}>
        <Text style={sectionTitle}>{hotelName}</Text>
        <Hr style={hrThin} />
        <InfoRow label="Mã đặt phòng" value={`#${bookingRef}`} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng" value={checkIn} />
        <InfoRow label="Trả phòng" value={checkOut} />
        <InfoRow
          label="Tổng tiền"
          value={`${totalAmount} ${currency}`}
          last={!refundAmount && !cancelReason}
        />
        {refundAmount && (
          <InfoRow
            label="Hoàn tiền"
            value={`${refundAmount} ${currency}`}
            last={!cancelReason}
          />
        )}
        {cancelReason && <InfoRow label="Lý do" value={cancelReason} last />}
      </Section>

      {refundAmount && (
        <Section style={refundBox}>
          <Text style={refundText}>
            💳 Khoản hoàn tiền{" "}
            <strong>
              {refundAmount} {currency}
            </strong>{" "}
            sẽ được xử lý trong 5–10 ngày làm việc tuỳ theo ngân hàng của bạn.
          </Text>
        </Section>
      )}

      <EmailButton href={hotelsUrl} variant="outline">
        Tìm khách sạn khác →
      </EmailButton>

      <Hr style={hr} />
      <Text style={small}>
        Nếu bạn có thắc mắc về việc huỷ phòng hoặc hoàn tiền, liên hệ{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

BookingCancellationEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  roomName: "Deluxe Double Room",
  checkIn: "20/12/2024",
  checkOut: "22/12/2024",
  totalAmount: "2,400,000",
  currency: "VND",
  refundAmount: "2,400,000",
  cancelReason: "Thay đổi kế hoạch",
  hotelsUrl: "https://staywise.vn/hotels",
};

const cancelBadge: React.CSSProperties = {
  backgroundColor: "#fef2f2",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const cancelText: React.CSSProperties = {
  fontSize: "13px",
  color: "#dc2626",
  fontWeight: 600,
  margin: 0,
};
const h1: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#0f172a",
  margin: "0 0 8px",
};
const body: React.CSSProperties = {
  fontSize: "14px",
  color: "#475569",
  lineHeight: "1.6",
  margin: "0 0 12px",
};
const detailBox: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "20px 24px",
  marginBottom: "20px",
};
const sectionTitle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#0f172a",
  margin: "0 0 12px",
};
const hrThin: React.CSSProperties = { borderColor: "#f1f5f9", margin: "8px 0" };
const refundBox: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  borderRadius: "8px",
  padding: "14px 20px",
  marginBottom: "20px",
};
const refundText: React.CSSProperties = {
  fontSize: "13px",
  color: "#1e40af",
  lineHeight: "1.5",
  margin: 0,
};
const hr: React.CSSProperties = { borderColor: "#e2e8f0", margin: "24px 0" };
const small: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  lineHeight: "1.5",
  margin: 0,
};
const link: React.CSSProperties = {
  color: "#0f172a",
  textDecoration: "underline",
};
