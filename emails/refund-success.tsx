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
const GREEN = "#1A6B3C";
const GREEN_BG = "#EAF5EF";
const GREEN_BORDER = "#B6DEC8";

interface RefundSuccessEmailProps {
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  refundAmount: string;
  currency: string;
  cancelReason?: string;
  bookingUrl: string;
}

export function RefundSuccessEmail({
  name,
  bookingRef,
  hotelName,
  roomName,
  checkIn,
  checkOut,
  refundAmount,
  currency,
  cancelReason,
  bookingUrl,
}: RefundSuccessEmailProps) {
  return (
    <EmailLayout preview={`Hoàn tiền thành công cho đặt phòng #${bookingRef}`}>
      <Section style={successBadge}>
        <Text style={successText}>✓ Hoàn tiền thành công</Text>
      </Section>

      <Heading style={h1}>Yêu cầu hoàn tiền đã được xử lý</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Chúng tôi đã xử lý thành công yêu cầu hoàn tiền cho đặt phòng đã huỷ của
        bạn. Số tiền sẽ được hoàn trả về phương thức thanh toán ban đầu trong
        vòng <strong>5–10 ngày làm việc</strong> tuỳ theo ngân hàng.
      </Text>

      <Section style={amountBox}>
        <Row>
          <Column align="center">
            <Text style={amountLabel}>Số tiền hoàn trả</Text>
            <Text style={amountValue}>
              {refundAmount} {currency}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={detailBox}>
        <InfoRow label="Mã đặt phòng" value={`#${bookingRef}`} />
        <InfoRow label="Khách sạn" value={hotelName} />
        <InfoRow label="Phòng" value={roomName} />
        <InfoRow label="Nhận phòng" value={checkIn} />
        <InfoRow label="Trả phòng" value={checkOut} />
        {cancelReason && (
          <InfoRow label="Lý do huỷ" value={cancelReason} last />
        )}
        {!cancelReason && <InfoRow label="Trạng thái" value="Đã huỷ" last />}
      </Section>

      <Section style={noteBox}>
        <Text style={noteText}>
          ⏱ Thời gian xử lý thực tế phụ thuộc vào ngân hàng hoặc tổ chức phát
          hành thẻ của bạn.{" "}
          <strong style={{ color: DARK }}>Thường từ 3–10 ngày làm việc.</strong>
        </Text>
      </Section>

      <EmailButton href={bookingUrl}>Xem chi tiết đặt phòng →</EmailButton>

      <Hr style={hr} />
      <Text style={small}>
        Nếu bạn chưa nhận được tiền sau 10 ngày làm việc, vui lòng liên hệ{" "}
        <a href="mailto:support@staywise.vn" style={link}>
          support@staywise.vn
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

RefundSuccessEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  bookingRef: "SW-20241215-ABCD",
  hotelName: "The Grand Palace Hà Nội",
  roomName: "Deluxe Double Room",
  checkIn: "20/12/2024",
  checkOut: "22/12/2024",
  refundAmount: "1,800,000",
  currency: "VND",
  cancelReason: "Thay đổi kế hoạch du lịch",
  bookingUrl: "https://staywise.vn/account/bookings/SW-20241215-ABCD",
};

const successBadge: React.CSSProperties = {
  backgroundColor: GREEN_BG,
  border: `1px solid ${GREEN_BORDER}`,
  borderRadius: "6px",
  padding: "8px 16px",
  marginBottom: "20px",
  textAlign: "center",
};

const successText: React.CSSProperties = {
  fontSize: "13px",
  color: GREEN,
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

const amountBox: React.CSSProperties = {
  backgroundColor: GREEN_BG,
  border: `1px solid ${GREEN_BORDER}`,
  borderRadius: "10px",
  padding: "20px 24px",
  marginBottom: "16px",
  textAlign: "center",
};

const amountLabel: React.CSSProperties = {
  fontSize: "12px",
  color: GREEN,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: "0 0 6px",
  fontFamily: "'Nunito Sans', sans-serif",
};

const amountValue: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 400,
  color: GREEN,
  margin: 0,
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  letterSpacing: "0.02em",
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

const hr: React.CSSProperties = {
  borderColor: "#DDD6C4",
  margin: "24px 0",
};

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