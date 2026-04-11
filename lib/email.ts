import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { env } from "./env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: false, // STARTTLS
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const FROM = env.EMAIL_FROM;

// "hien_dth235651@student.agu.edu.vn"

const sendEmail = async ({
  to,
  subject,
  react,
  attachments,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
  attachments?: {
    filename: string;
    content: string;
    content_type: string;
    content_id: string;
    inline: boolean;
  }[];
}) => {
  const html = await render(react);

  await transporter.sendMail({
    from: FROM,
    to,
    subject,
    html,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, "base64"),
      contentType: a.content_type,
      cid: a.content_id,
    })),
  });
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
  verifyUrl: string;
  qrBase64: string;
}) => {
  const { BookingConfirmationEmail } =
    await import("../emails/booking-confirmation");

  const qrCid = `qr-${opts.bookingRef}@staywise.vn`;
  const qrBase64Data = opts.qrBase64.replace(/^data:image\/png;base64,/, "");

  return sendEmail({
    to: opts.to,
    subject: `Xác nhận đặt phòng #${opts.bookingRef} — ${opts.hotelName}`,
    react: BookingConfirmationEmail({ ...opts, qrBase64: `cid:${qrCid}` }),
    attachments: [
      {
        filename: `qr-${opts.bookingRef}.png`,
        content: qrBase64Data,
        content_type: "image/png",
        content_id: qrCid,
        inline: true,
      },
    ],
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

export const sendRefundFailed = async (opts: {
  to: string;
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  supportUrl: string;
}) => {
  const { RefundFailedEmail } = await import("../emails/refund-failed");
  return sendEmail({
    to: opts.to,
    subject: `Hoàn tiền thất bại cho đặt phòng #${opts.bookingRef}`,
    react: RefundFailedEmail(opts),
  });
};

export const sendRefundSuccess = async (opts: {
  to: string;
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
}) => {
  const { RefundSuccessEmail } = await import("../emails/refund-success");
  return sendEmail({
    to: opts.to,
    subject: `Hoàn tiền thành công cho đặt phòng #${opts.bookingRef}`,
    react: RefundSuccessEmail(opts),
  });
};

export const sendCheckoutSummary = async (opts: {
  to: string;
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: string;
  currency: string;
  reviewUrl: string;
  hotelsUrl: string;
}) => {
  const { CheckoutSummaryEmail } =
    await import("../emails/checkout-summary-email");
  return sendEmail({
    to: opts.to,
    subject: `Cảm ơn bạn đã lưu trú tại ${opts.hotelName}!`,
    react: CheckoutSummaryEmail(opts),
  });
};

export const sendNoShow = async (opts: {
  to: string;
  name: string;
  bookingRef: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  currency: string;
  supportUrl: string;
  hotelsUrl: string;
}) => {
  const { NoShowEmail } = await import("../emails/no-show-email");
  return sendEmail({
    to: opts.to,
    subject: `Đặt phòng #${opts.bookingRef} — Bạn đã không đến nhận phòng`,
    react: NoShowEmail(opts),
  });
};
