import { Heading, Hr, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";

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
const hr: React.CSSProperties = { borderColor: "#e2e8f0", margin: "24px 0" };
const small: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  lineHeight: "1.5",
  margin: 0,
};
