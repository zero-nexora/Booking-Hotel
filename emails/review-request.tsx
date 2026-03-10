import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";

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
  fontSize: "28px",
  color: "#C9A84C",
  margin: 0,
  letterSpacing: "4px",
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
const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "8px 0 20px",
};
const noteBox: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "12px 20px",
};
const noteText: React.CSSProperties = {
  fontSize: "12px",
  color: "#64748b",
  lineHeight: "1.5",
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
