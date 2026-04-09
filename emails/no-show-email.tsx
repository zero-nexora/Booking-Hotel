import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

const DARK = "#1A1612";

interface NoShowEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  supportUrl: string;
  hotelsUrl: string;
}

export function NoShowEmail({
  name,
  bookingRef,
  hotelName,
  roomName,
  checkIn,
  checkOut,
  totalAmount,
  currency,
  supportUrl,
  hotelsUrl,
}: NoShowEmailProps) {
  return (
    <EmailLayout preview={`Đặt phòng #${bookingRef} đã bị đánh dấu no-show`}>
      <Section style={noShowBadge}>
        <Text style={noShowText}>⚠ Không nhận phòng (No-show)</Text>
      </Section>

      <Heading style={h1}>Bạn đã bỏ lỡ đặt phòng</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Chúng tôi nhận thấy bạn không đến nhận phòng theo lịch đặt. Đặt phòng
        của bạn đã được đánh dấu là <strong>no-show</strong> theo chính sách của
        khách sạn.
      </Text>

      <Section style={detailBox}>
        <Text style={sectionTitle}>{hotelName}</Text>
        <Hr style={hrThin} />
        <InfoRow label="Mã đặt phòng" value={`#${bookingRef}`} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng (dự kiến)" value={checkIn} />
        <InfoRow label="Trả phòng (dự kiến)" value={checkOut} />
        <InfoRow label="Tổng tiền" value={`${totalAmount} ${currency}`} last />
      </Section>

      <Section style={noteBox}>
        <Text style={noteText}>
          Nếu bạn cho rằng đây là sự nhầm lẫn hoặc gặp sự cố bất khả kháng, vui
          lòng liên hệ đội ngũ hỗ trợ của chúng tôi trong vòng{" "}
          <strong>48 giờ</strong> để được xem xét.
        </Text>
      </Section>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <EmailButton href={supportUrl}>Liên hệ hỗ trợ →</EmailButton>

        <EmailButton href={hotelsUrl} variant="outline">
          Đặt phòng mới →
        </EmailButton>
      </div>

      <Hr style={hr} />
      <Text style={small}>
        Để biết thêm về chính sách no-show và phí phát sinh, vui lòng xem{" "}
        <a href="https://staywise.vn/terms" style={link}>
          điều khoản dịch vụ
        </a>{" "}
        hoặc liên hệ{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

NoShowEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  roomName: "Deluxe Double Room",
  checkIn: "20/12/2024",
  checkOut: "22/12/2024",
  totalAmount: "2,400,000",
  currency: "VND",
  supportUrl: "https://staywise.vn/support?booking=SW-20241215-ABCD",
  hotelsUrl: "https://staywise.vn/hotels",
};

const noShowBadge: React.CSSProperties = {
  backgroundColor: "#FDF4E3",
  border: "1px solid #F0D9A0",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const noShowText: React.CSSProperties = {
  fontSize: "13px",
  color: "#7A5C0A",
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
const sectionTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 400,
  color: DARK,
  margin: "0 0 12px",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  letterSpacing: "0.02em",
};
const hrThin: React.CSSProperties = { borderColor: "#E8E0CF", margin: "8px 0" };
const noteBox: React.CSSProperties = {
  backgroundColor: "#FDF4E3",
  border: "1px solid #F0D9A0",
  borderLeft: "3px solid #D4A017",
  borderRadius: "8px",
  padding: "14px 20px",
  marginBottom: "16px",
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
