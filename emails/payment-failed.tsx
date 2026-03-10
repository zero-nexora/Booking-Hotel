import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

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
  backgroundColor: "#fef2f2",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const failText: React.CSSProperties = {
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
