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
    // to,
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
    subject: "Xác thực email tài khoản Staywise của bạn",
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
    react: ResetPasswordEmail({ name: opts.name, resetUrl: opts.resetUrl }),
  });
};

export const sendBookingConfirmation = async (opts: {
  to: string;
  name: string;
  bookingRef: string;
  hotelName: string;
  hotelAddress: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: string;
  currency: string;
  bookingUrl: string;
}) => {
  const { BookingConfirmationEmail } =
    await import("../emails/booking-confirmation");
  return sendEmail({
    to: opts.to,
    subject: `Xác nhận đặt phòng #${opts.bookingRef} — ${opts.hotelName}`,
    react: BookingConfirmationEmail(opts),
  });
};

export const sendBookingCancellation = async (opts: {
  to: string;
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  refundAmount?: string;
  cancelReason?: string;
  hotelsUrl: string;
}) => {
  const { BookingCancellationEmail } =
    await import("../emails/booking-cancellation");
  return sendEmail({
    to: opts.to,
    subject: `Đặt phòng #${opts.bookingRef} đã bị huỷ`,
    react: BookingCancellationEmail(opts),
  });
};

export const sendCheckInReminder = async (opts: {
  to: string;
  name: string;
  bookingRef: string;
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  checkIn: string;
  checkInTime: string;
  checkOut: string;
  checkOutTime: string;
  roomName: string;
  bookingUrl: string;
}) => {
  const { CheckInReminderEmail } = await import("../emails/checkin-reminder");
  return sendEmail({
    to: opts.to,
    subject: `Nhắc nhở: Ngày mai bạn check-in tại ${opts.hotelName}`,
    react: CheckInReminderEmail(opts),
  });
};

export const sendReviewRequest = async (opts: {
  to: string;
  name: string;
  hotelName: string;
  roomName: string;
  checkOut: string;
  reviewUrl: string;
}) => {
  const { ReviewRequestEmail } = await import("../emails/review-request");
  return sendEmail({
    to: opts.to,
    subject: `Chia sẻ trải nghiệm của bạn tại ${opts.hotelName}`,
    react: ReviewRequestEmail(opts),
  });
};

export const sendPaymentFailed = async (opts: {
  to: string;
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  retryUrl: string;
}) => {
  const { PaymentFailedEmail } = await import("../emails/payment-failed");
  return sendEmail({
    to: opts.to,
    subject: `Thanh toán thất bại cho đặt phòng #${opts.bookingRef}`,
    react: PaymentFailedEmail(opts),
  });
};
