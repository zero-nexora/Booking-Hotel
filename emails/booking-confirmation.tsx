import {
  Heading,
  Hr,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

interface BookingConfirmationEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  hotelAddress: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: string;
  currency: string;
  bookingUrl: string;
}

export function BookingConfirmationEmail({
  name,
  bookingRef,
  hotelName,
  hotelAddress,
  roomName,
  checkIn,
  checkOut,
  nights,
  adults,
  children,
  totalAmount,
  currency,
  bookingUrl,
}: BookingConfirmationEmailProps) {
  const guests = `${adults} người lớn${children > 0 ? `, ${children} trẻ em` : ""}`;

  return (
    <EmailLayout preview={`Xác nhận đặt phòng #${bookingRef} — ${hotelName}`}>
      <Section style={successBadge}>
        <Text style={successText}>✓ Đặt phòng thành công</Text>
      </Section>

      <Heading style={h1}>Xác nhận đặt phòng</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Đặt phòng của bạn đã được xác nhận. Dưới đây là thông tin chi tiết:
      </Text>

      <Section style={refBox}>
        <Text style={refLabel}>Mã đặt phòng</Text>
        <Text style={refValue}>#{bookingRef}</Text>
      </Section>

      <Section style={detailBox}>
        <Text style={sectionTitle}>{hotelName}</Text>
        <Text style={subtext}>{hotelAddress}</Text>
        <Hr style={hrThin} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng" value={checkIn} />
        <InfoRow label="Trả phòng" value={checkOut} />
        <InfoRow label="Số đêm" value={`${nights} đêm`} />
        <InfoRow label="Khách" value={guests} />
        <Hr style={hrThin} />
        <Row style={{ padding: "10px 0 0" }}>
          <Column style={{ width: "40%" }}>
            <Text style={totalLabel}>Tổng cộng</Text>
          </Column>
          <Column>
            <Text style={totalValue}>
              {totalAmount} {currency}
            </Text>
          </Column>
        </Row>
      </Section>

      <EmailButton href={bookingUrl}>Xem chi tiết đặt phòng →</EmailButton>

      <Hr style={hr} />
      <Text style={small}>
        Vui lòng mang mã đặt phòng khi check-in. Nếu bạn cần hỗ trợ, liên hệ
        chúng tôi qua{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

BookingConfirmationEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  hotelAddress: "12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
  roomName: "Deluxe Double Room",
  checkIn: "Thứ Sáu, 20/12/2024 (từ 14:00)",
  checkOut: "Chủ Nhật, 22/12/2024 (trước 12:00)",
  nights: 2,
  adults: 2,
  children: 0,
  totalAmount: "2,400,000",
  currency: "VND",
  bookingUrl: "https://staywise.vn/account/bookings/SW-20241215-ABCD",
};

const successBadge: React.CSSProperties = {
  backgroundColor: "#f0fdf4",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const successText: React.CSSProperties = {
  fontSize: "13px",
  color: "#16a34a",
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
const refBox: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "14px 20px",
  marginBottom: "20px",
  textAlign: "center",
};
const refLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: "0 0 4px",
  fontWeight: 600,
};
const refValue: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#0f172a",
  margin: 0,
  letterSpacing: "0.05em",
  fontFamily: "monospace",
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
  margin: "0 0 4px",
};
const subtext: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "0 0 12px",
};
const hrThin: React.CSSProperties = { borderColor: "#f1f5f9", margin: "8px 0" };
const totalLabel: React.CSSProperties = {
  fontSize: "14px",
  color: "#0f172a",
  fontWeight: 700,
  margin: 0,
};
const totalValue: React.CSSProperties = {
  fontSize: "16px",
  color: "#C9A84C",
  fontWeight: 700,
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
