import { Heading, Hr, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";

const DARK = "#1A1612";

interface EmailVerificationProps {
  name: string;
  verifyUrl: string;
}

export function EmailVerificationEmail({
  name,
  verifyUrl,
}: EmailVerificationProps) {
  return (
    <EmailLayout preview="Xác thực email tài khoản Staywise của bạn">
      <Heading style={h1}>Xác thực email của bạn</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Cảm ơn bạn đã đăng ký Staywise. Nhấn vào nút bên dưới để xác thực địa
        chỉ email và kích hoạt tài khoản của bạn.
      </Text>
      <EmailButton href={verifyUrl}>Xác thực email →</EmailButton>
      <Hr style={hr} />
      <Text style={small}>
        Link này sẽ hết hạn sau <strong>24 giờ</strong>. Nếu bạn không tạo tài
        khoản, hãy bỏ qua email này.
      </Text>
    </EmailLayout>
  );
}

EmailVerificationEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  verifyUrl: "https://staywise.vn/verify-email?token=xxx",
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
const hr: React.CSSProperties = { borderColor: "#DDD6C4", margin: "24px 0" };
const small: React.CSSProperties = {
  fontSize: "12px",
  color: "#7A6F5E",
  lineHeight: "1.6",
  margin: 0,
  fontFamily: "'Nunito Sans', sans-serif",
};
