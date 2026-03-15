import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

const GOLD = "#C9A96E";
const DARK = "#1A1612";

interface CheckInReminderEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  checkIn: string;
  checkInTime: string;
  checkOut: string;
  checkOutTime: string;
  roomName: string;
  bookingUrl: string;
}

export function CheckInReminderEmail({
  name,
  bookingRef,
  hotelName,
  hotelAddress,
  hotelPhone,
  checkIn,
  checkInTime,
  checkOut,
  checkOutTime,
  roomName,
  bookingUrl,
}: CheckInReminderEmailProps) {
  return (
    <EmailLayout preview={`Nhắc nhở: Ngày mai bạn check-in tại ${hotelName}`}>
      <Section style={reminderBadge}>
        <Text style={reminderText}>🏨 Ngày mai là ngày check-in của bạn!</Text>
      </Section>

      <Heading style={h1}>Chuẩn bị cho chuyến đi</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Chuyến lưu trú của bạn tại <strong>{hotelName}</strong> sắp bắt đầu.
        Dưới đây là thông tin bạn cần biết trước khi đến.
      </Text>

      <Section style={detailBox}>
        <Text style={sectionTitle}>{hotelName}</Text>
        <Text style={subtext}>{hotelAddress}</Text>
        <Hr style={hrThin} />
        <InfoRow label="Mã đặt phòng" value={`#${bookingRef}`} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng" value={`${checkIn} (từ ${checkInTime})`} />
        <InfoRow
          label="Trả phòng"
          value={`${checkOut} (trước ${checkOutTime})`}
          last
        />
      </Section>

      <Section style={tipsBox}>
        <Text style={tipsTitle}>Lưu ý khi check-in</Text>
        <Text style={tipsItem}>· Mang theo CMND / CCCD hoặc hộ chiếu</Text>
        <Text style={tipsItem}>
          · Trình mã đặt phòng:{" "}
          <strong style={{ color: DARK }}>#{bookingRef}</strong>
        </Text>
        <Text style={tipsItem}>
          · Liên hệ khách sạn:{" "}
          <a href={`tel:${hotelPhone}`} style={link}>
            {hotelPhone}
          </a>
        </Text>
      </Section>

      <EmailButton href={bookingUrl}>Xem chi tiết đặt phòng →</EmailButton>

      <Hr style={hr} />
      <Text style={small}>
        Chúc bạn có chuyến lưu trú tuyệt vời! Mọi thắc mắc vui lòng liên hệ{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

CheckInReminderEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  hotelAddress: "12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
  hotelPhone: "024 3825 0888",
  checkIn: "Thứ Sáu, 20/12/2024",
  checkInTime: "14:00",
  checkOut: "Chủ Nhật, 22/12/2024",
  checkOutTime: "12:00",
  roomName: "Deluxe Double Room",
  bookingUrl: "https://staywise.vn/account/bookings/SW-20241215-ABCD",
};

const reminderBadge: React.CSSProperties = {
  backgroundColor: "#F5F0E8",
  border: "1px solid #DDD6C4",
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: "6px",
  padding: "10px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const reminderText: React.CSSProperties = {
  fontSize: "13px",
  color: "#5C4A20",
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
const detailBox: React.CSSProperties = {
  border: "1px solid #DDD6C4",
  borderRadius: "10px",
  padding: "20px 24px",
  marginBottom: "16px",
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
const tipsBox: React.CSSProperties = {
  backgroundColor: "#EDE8DC",
  border: "1px solid #DDD6C4",
  borderRadius: "8px",
  padding: "16px 20px",
  marginBottom: "20px",
};
const tipsTitle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#7A6F5E",
  margin: "0 0 10px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontFamily: "'Nunito Sans', sans-serif",
};
const tipsItem: React.CSSProperties = {
  fontSize: "13px",
  color: "#4A4035",
  margin: "0 0 6px",
  fontFamily: "'Nunito Sans', sans-serif",
  lineHeight: "1.6",
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
