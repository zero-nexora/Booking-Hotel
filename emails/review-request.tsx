import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";

const GOLD = "#C9A96E";
const DARK = "#1A1612";

interface ReviewRequestEmailProps {
  name: string;
  hotelName: string;
  roomName: string;
  checkOut: string;
  reviewUrl: string;
}

export function ReviewRequestEmail({
  name,
  hotelName,
  roomName,
  checkOut,
  reviewUrl,
}: ReviewRequestEmailProps) {
  return (
    <EmailLayout preview={`Chia sẻ trải nghiệm của bạn tại ${hotelName}`}>
      <Section style={{ textAlign: "center", marginBottom: "20px" }}>
        <Text style={stars}>★ ★ ★ ★ ★</Text>
      </Section>

      <Heading style={h1}>Chuyến đi của bạn thế nào?</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Cảm ơn bạn đã lưu trú tại <strong>{hotelName}</strong> ({roomName}). Hy
        vọng bạn đã có những trải nghiệm tuyệt vời!
      </Text>
      <Text style={body}>
        Đánh giá của bạn giúp các du khách khác lựa chọn được chỗ nghỉ phù hợp.
        Chỉ mất 2 phút để chia sẻ nhé.
      </Text>

      <Section style={ctaSection}>
        <EmailButton href={reviewUrl}>Viết đánh giá ngay →</EmailButton>
      </Section>

      <Section style={noteBox}>
        <Text style={noteText}>
          Đánh giá sẽ được kiểm duyệt trước khi hiển thị công khai (1–2 ngày làm
          việc). Ngày check-out: <strong>{checkOut}</strong>.
        </Text>
      </Section>

      <Hr style={hr} />
      <Text style={small}>
        Bạn nhận được email này vì đã hoàn thành kỳ lưu trú tại Staywise. Nếu
        không muốn nhận email loại này, bạn có thể{" "}
        <a href="https://staywise.vn/account/profile" style={link}>
          cập nhật tuỳ chọn thông báo
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

ReviewRequestEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  hotelName: "The Grand Palace Hà Nội",
  roomName: "Deluxe Double Room",
  checkOut: "22/12/2024",
  reviewUrl: "https://staywise.vn/account/bookings/SW-20241215-ABCD/review",
};

const stars: React.CSSProperties = {
  fontSize: "26px",
  color: GOLD,
  margin: 0,
  letterSpacing: "6px",
  fontFamily: "serif",
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
const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "8px 0 20px",
};
const noteBox: React.CSSProperties = {
  backgroundColor: "#EDE8DC",
  border: "1px solid #DDD6C4",
  borderRadius: "8px",
  padding: "12px 20px",
};
const noteText: React.CSSProperties = {
  fontSize: "12px",
  color: "#7A6F5E",
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
