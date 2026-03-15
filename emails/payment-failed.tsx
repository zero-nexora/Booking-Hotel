import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

const DARK = "#1A1612";

interface PaymentFailedEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  retryUrl: string;
}

export function PaymentFailedEmail({
  name,
  bookingRef,
  hotelName,
  roomName,
  checkIn,
  checkOut,
  totalAmount,
  currency,
  retryUrl,
}: PaymentFailedEmailProps) {
  return (
    <EmailLayout preview={`Thanh toán thất bại cho đặt phòng #${bookingRef}`}>
      <Section style={failBadge}>
        <Text style={failText}>⚠ Thanh toán thất bại</Text>
      </Section>

      <Heading style={h1}>Thanh toán không thành công</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Rất tiếc, thanh toán cho đặt phòng của bạn không thành công. Phòng chưa
        được giữ cho đến khi thanh toán hoàn tất.
      </Text>

      <Section style={detailBox}>
        <InfoRow label="Mã đặt phòng" value={`#${bookingRef}`} />
        <InfoRow label="Khách sạn" value={hotelName} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng" value={checkIn} />
        <InfoRow label="Trả phòng" value={checkOut} />
        <InfoRow label="Số tiền" value={`${totalAmount} ${currency}`} last />
      </Section>

      <Text style={body}>
        Vui lòng thử lại với phương thức thanh toán khác. Lưu ý rằng phòng có
        thể không còn khả dụng nếu bạn chờ quá lâu.
      </Text>

      <EmailButton href={retryUrl}>Thử lại thanh toán →</EmailButton>

      <Hr style={hr} />
      <Text style={small}>
        Nếu bạn gặp sự cố liên tục, liên hệ{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>{" "}
        hoặc kiểm tra với ngân hàng của bạn.
      </Text>
    </EmailLayout>
  );
}

PaymentFailedEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  roomName: "Deluxe Double Room",
  checkIn: "20/12/2024",
  checkOut: "22/12/2024",
  totalAmount: "2,400,000",
  currency: "VND",
  retryUrl: "https://staywise.vn/booking/grand-palace-ha-noi/deluxe-double",
};

const failBadge: React.CSSProperties = {
  backgroundColor: "#F9ECEC",
  border: "1px solid #E8CACA",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const failText: React.CSSProperties = {
  fontSize: "13px",
  color: "#8B2E2E",
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
  marginBottom: "20px",
  backgroundColor: "#FAF7F2",
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
