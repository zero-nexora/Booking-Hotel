import { Resend } from "resend";
import { env } from "./env";

export const resend = new Resend(env.RESEND_API_KEY);
const FROM = env.EMAIL_FROM;

const sendEmail = async ({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) => {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: "hien_dth235651@student.agu.edu.vn",
    subject,
    react,
  });

  if (error) {
    console.error("[email] Send failed:", error);
    throw new Error(error.message);
  }

  return data;
};

export const sendEmailVerification = async (opts: {
  to: string;
  name: string;
  verifyUrl: string;
}) => {
  const { EmailVerificationEmail } =
    await import("../emails/email-verification");
  return sendEmail({
    to: opts.to,
    subject: "Xác thực email Staywise của bạn",
    react: EmailVerificationEmail({
      name: opts.name,
      verifyUrl: opts.verifyUrl,
    }),
  });
};

export const sendPasswordReset = async (opts: {
  to: string;
  name: string;
  resetUrl: string;
}) => {
  const { ResetPasswordEmail } = await import("../emails/reset-password-email");

  return sendEmail({
    to: opts.to,
    subject: "Đặt lại mật khẩu Staywise",
    react: ResetPasswordEmail({
      name: opts.name,
      resetUrl: opts.resetUrl,
    }),
  });
};
