import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

const GOLD = "#C9A96E";
const DARK = "#1A1612";

interface RefundFailedEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  supportUrl: string;
}

export function RefundFailedEmail({
  name,
  bookingRef,
  hotelName,
  roomName,
  checkIn,
  checkOut,
  totalAmount,
  currency,
  supportUrl,
}: RefundFailedEmailProps) {
  return (
    <EmailLayout preview={`Hoàn tiền thất bại cho đặt phòng #${bookingRef}`}>
      <Section style={failBadge}>
        <Text style={failText}>⚠ Hoàn tiền thất bại</Text>
      </Section>

      <Heading style={h1}>Hoàn tiền không thành công</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Rất tiếc, chúng tôi không thể hoàn tiền tự động cho đặt phòng đã huỷ của
        bạn. Đội ngũ hỗ trợ sẽ liên hệ với bạn sớm nhất để xử lý thủ công.
      </Text>

      <Section style={detailBox}>
        <InfoRow label="Mã đặt phòng" value={`#${bookingRef}`} />
        <InfoRow label="Khách sạn" value={hotelName} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng" value={checkIn} />
        <InfoRow label="Trả phòng" value={checkOut} />
        <InfoRow
          label="Số tiền hoàn"
          value={`${totalAmount} ${currency}`}
          last
        />
      </Section>

      <Section style={noteBox}>
        <Text style={noteText}>
          💬 Nếu bạn chưa nhận được phản hồi trong vòng{" "}
          <strong style={{ color: DARK }}>2 ngày làm việc</strong>, vui lòng
          liên hệ trực tiếp với chúng tôi qua trang hỗ trợ.
        </Text>
      </Section>

      <EmailButton href={supportUrl}>Liên hệ hỗ trợ →</EmailButton>

      <Hr style={hr} />
      <Text style={small}>
        Nếu bạn có thắc mắc, liên hệ{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>
        . Chúng tôi xin lỗi vì sự bất tiện này.
      </Text>
    </EmailLayout>
  );
}

RefundFailedEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  roomName: "Deluxe Double Room",
  checkIn: "20/12/2024",
  checkOut: "22/12/2024",
  totalAmount: "2,400,000",
  currency: "VND",
  supportUrl: "https://staywise.vn/support",
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
  marginBottom: "16px",
  backgroundColor: "#FAF7F2",
};
const noteBox: React.CSSProperties = {
  backgroundColor: "#F5F0E8",
  border: "1px solid #DDD6C4",
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: "8px",
  padding: "14px 20px",
  marginBottom: "20px",
};
const noteText: React.CSSProperties = {
  fontSize: "13px",
  color: "#4A4035",
  lineHeight: "1.6",
  margin: 0,
  fontFamily: "'Nunito Sans', sans-serif",
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
