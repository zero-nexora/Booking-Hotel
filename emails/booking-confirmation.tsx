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

const GOLD = "#C9A96E";
const DARK = "#1A1612";

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
  backgroundColor: "#EAF0E8",
  border: "1px solid #C6D9C0",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const successText: React.CSSProperties = {
  fontSize: "13px",
  color: "#3A6B35",
  fontWeight: 600,
  margin: 0,
  fontFamily: "'Nunito Sans', sans-serif",
  letterSpacing: "0.03em",
};
const h1: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: 400,
  color: DARK,
  margin: "0 0 8px",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  letterSpacing: "0.02em",
};
const body: React.CSSProperties = {
  fontSize: "14px",
  color: "#4A4035",
  lineHeight: "1.7",
  margin: "0 0 12px",
  fontFamily: "'Nunito Sans', sans-serif",
};
const refBox: React.CSSProperties = {
  backgroundColor: "#EDE8DC",
  border: "1px solid #DDD6C4",
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: "8px",
  padding: "14px 20px",
  marginBottom: "20px",
  textAlign: "center",
};
const refLabel: React.CSSProperties = {
  fontSize: "10px",
  color: "#7A6F5E",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  margin: "0 0 4px",
  fontWeight: 600,
  fontFamily: "'Nunito Sans', sans-serif",
};
const refValue: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  color: DARK,
  margin: 0,
  letterSpacing: "0.06em",
  fontFamily: "monospace",
};
const detailBox: React.CSSProperties = {
  border: "1px solid #DDD6C4",
  borderRadius: "10px",
  padding: "20px 24px",
  marginBottom: "20px",
  backgroundColor: "#FAF7F2",
};
const sectionTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 400,
  color: DARK,
  margin: "0 0 4px",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  letterSpacing: "0.02em",
};
const subtext: React.CSSProperties = {
  fontSize: "12px",
  color: "#7A6F5E",
  margin: "0 0 12px",
  fontFamily: "'Nunito Sans', sans-serif",
};
const hrThin: React.CSSProperties = { borderColor: "#E8E0CF", margin: "8px 0" };
const totalLabel: React.CSSProperties = {
  fontSize: "14px",
  color: DARK,
  fontWeight: 700,
  margin: 0,
  fontFamily: "'Nunito Sans', sans-serif",
};
const totalValue: React.CSSProperties = {
  fontSize: "16px",
  color: GOLD,
  fontWeight: 700,
  margin: 0,
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  letterSpacing: "0.04em",
};
const hr: React.CSSProperties = { borderColor: "#DDD6C4", margin: "24px 0" };
const small: React.CSSProperties = {
  fontSize: "12px",
  color: "#7A6F5E",
  lineHeight: "1.6",
  margin: 0,
  fontFamily: "'Nunito Sans', sans-serif",
};
const link: React.CSSProperties = {
  color: DARK,
  textDecoration: "underline",
};
