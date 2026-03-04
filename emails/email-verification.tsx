import { Button, Heading, Hr, Text } from "@react-email/components";
import { EmailLayout } from "./components/email-layout";

interface EmailVerificationEmailProps {
  name: string;
  verifyUrl: string;
}

export function EmailVerificationEmail({
  name,
  verifyUrl,
}: EmailVerificationEmailProps) {
  return (
    <EmailLayout preview="Xác thực email Staywise của bạn">
      <Heading className="text-2xl font-bold text-gray-900 mb-2">
        Xác thực email của bạn
      </Heading>
      <Text className="text-gray-600 mt-0">
        Xin chào {name}, cảm ơn bạn đã đăng ký Staywise!
      </Text>
      <Text className="text-gray-600">
        Nhấn vào nút bên dưới để xác thực địa chỉ email và kích hoạt tài khoản
        của bạn.
      </Text>

      <Button
        href={verifyUrl}
        className="bg-gray-900 text-white rounded-lg px-6 py-3 text-sm font-medium no-underline mt-2"
      >
        Xác thực email →
      </Button>

      <Hr className="border-gray-200 my-6" />
      <Text className="text-xs text-gray-400">
        Link này sẽ hết hạn sau 24 giờ. Nếu bạn không tạo tài khoản, hãy bỏ qua
        email này.
      </Text>
    </EmailLayout>
  );
}
