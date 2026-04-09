import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";
import { InfoRow } from "./components/info-row";

const GOLD = "#C9A96E";
const DARK = "#1A1612";

interface CheckoutSummaryEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: string;
  currency: string;
  reviewUrl: string;
  hotelsUrl: string;
}

export function CheckoutSummaryEmail({
  name,
  bookingRef,
  hotelName,
  roomName,
  checkIn,
  checkOut,
  nights,
  totalAmount,
  currency,
  reviewUrl,
  hotelsUrl,
}: CheckoutSummaryEmailProps) {
  return (
    <EmailLayout preview={`Cảm ơn bạn đã lưu trú tại ${hotelName}!`}>
      <Section style={checkoutBadge}>
        <Text style={checkoutText}>✓ Trả phòng thành công</Text>
      </Section>

      <Heading style={h1}>Cảm ơn bạn đã lưu trú!</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Chúng tôi hy vọng bạn đã có một kỳ nghỉ tuyệt vời tại{" "}
        <strong>{hotelName}</strong>. Dưới đây là tóm tắt chuyến lưu trú của
        bạn:
      </Text>

      <Section style={detailBox}>
        <Text style={sectionTitle}>{hotelName}</Text>
        <Hr style={hrThin} />
        <InfoRow label="Mã đặt phòng" value={`#${bookingRef}`} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng" value={checkIn} />
        <InfoRow label="Trả phòng" value={checkOut} />
        <InfoRow label="Số đêm" value={`${nights} đêm`} />
        <InfoRow
          label="Tổng cộng"
          value={`${totalAmount} ${currency}`}
          last
        />
      </Section>

      <Section style={reviewBox}>
        <Text style={reviewTitle}>Chia sẻ trải nghiệm của bạn</Text>
        <Text style={reviewDesc}>
          Đánh giá của bạn giúp các khách hàng khác lựa chọn khách sạn phù hợp
          hơn. Chỉ mất 1 phút!
        </Text>
        <EmailButton href={reviewUrl}>Viết đánh giá →</EmailButton>
      </Section>

      <EmailButton href={hotelsUrl} variant="outline">
        Đặt phòng cho chuyến tiếp theo →
      </EmailButton>

      <Hr style={hr} />
      <Text style={small}>
        Nếu bạn có thắc mắc về hoá đơn hoặc trải nghiệm lưu trú, liên hệ{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

CheckoutSummaryEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  roomName: "Deluxe Double Room",
  checkIn: "20/12/2024",
  checkOut: "22/12/2024",
  nights: 2,
  totalAmount: "2,400,000",
  currency: "VND",
  reviewUrl: "https://staywise.vn/reviews/new?booking=SW-20241215-ABCD",
  hotelsUrl: "https://staywise.vn/hotels",
};

const checkoutBadge: React.CSSProperties = {
  backgroundColor: "#EAF0E8",
  border: "1px solid #C6D9C0",
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};
const checkoutText: React.CSSProperties = {
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
const reviewBox: React.CSSProperties = {
  backgroundColor: "#F5F0E8",
  border: "1px solid #DDD6C4",
  borderLeft: `3px solid ${GOLD}`,
  borderRadius: "8px",
  padding: "18px 20px",
  marginBottom: "16px",
};
const reviewTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: DARK,
  margin: "0 0 6px",
  fontFamily: "'Nunito Sans', sans-serif",
};
const reviewDesc: React.CSSProperties = {
  fontSize: "13px",
  color: "#4A4035",
  lineHeight: "1.6",
  margin: "0 0 14px",
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