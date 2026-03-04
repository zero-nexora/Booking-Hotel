import { Button, Heading, Hr, Text } from "@react-email/components";
import { EmailLayout } from "./components/email-layout";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Đặt lại mật khẩu Staywise">
      <Heading className="text-2xl font-bold text-gray-900 mb-2">
        Đặt lại mật khẩu
      </Heading>

      <Text className="text-gray-600 mt-0">Xin chào {name},</Text>

      <Text className="text-gray-600">
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn
        vào nút bên dưới để tiếp tục.
      </Text>

      <Button
        href={resetUrl}
        className="bg-gray-900 text-white rounded-lg px-6 py-3 text-sm font-medium no-underline mt-2"
      >
        Đặt lại mật khẩu →
      </Button>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-xs text-gray-400">
        Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu,
        hãy bỏ qua email này.
      </Text>
    </EmailLayout>
  );
}
