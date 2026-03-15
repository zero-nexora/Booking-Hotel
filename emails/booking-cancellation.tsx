import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

const GOLD = "#C9A96E";
const DARK = "#1A1612";

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
            <strong style={{ color: GOLD }}>
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
  backgroundColor: "#F9ECEC",
  border: "1px solid #E8CACA",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const cancelText: React.CSSProperties = {
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
const sectionTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 400,
  color: DARK,
  margin: "0 0 12px",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  letterSpacing: "0.02em",
};
const hrThin: React.CSSProperties = { borderColor: "#E8E0CF", margin: "8px 0" };
const refundBox: React.CSSProperties = {
  backgroundColor: "#F5F0E8",
  border: "1px solid #DDD6C4",
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: "8px",
  padding: "14px 20px",
  marginBottom: "20px",
};
const refundText: React.CSSProperties = {
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
