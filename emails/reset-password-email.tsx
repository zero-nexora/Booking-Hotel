import { Heading, Hr, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { EmailButton } from "./components/email-button";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Đặt lại mật khẩu tài khoản Staywise">
      <Heading style={h1}>Đặt lại mật khẩu</Heading>
      <Text style={body}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={body}>
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn
        vào nút bên dưới để tiếp tục.
      </Text>
      <EmailButton href={resetUrl}>Đặt lại mật khẩu →</EmailButton>
      <Hr style={hr} />
      <Text style={small}>
        Link này sẽ hết hạn sau <strong>1 giờ</strong>. Nếu bạn không yêu cầu
        đặt lại mật khẩu, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.
      </Text>
    </EmailLayout>
  );
}

ResetPasswordEmail.PreviewProps = {
  name: "Nguyễn Văn A",
  resetUrl: "https://staywise.vn/reset-password?token=xxx",
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
