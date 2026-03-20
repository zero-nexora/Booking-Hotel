import { Prisma } from "@/prisma/generated/prisma/client";

export type RefundTier = {
  refundPercent: number;
  label: string;
  description: string;
};

export const calcRefundPolicy = (
  checkIn: Date,
  createdAt: Date,
  now = new Date(),
): RefundTier => {
  const msDay = 1000 * 60 * 60 * 24;
  const hoursSinceCreated =
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  const daysUntilCheckIn = (checkIn.getTime() - now.getTime()) / msDay;

  if (hoursSinceCreated <= 24) {
    return {
      refundPercent: 100,
      label: "Hoàn tiền đầy đủ",
      description: "Huỷ trong vòng 24 giờ sau khi đặt — hoàn 100%",
    };
  }

  if (daysUntilCheckIn > 7) {
    return {
      refundPercent: 100,
      label: "Hoàn tiền đầy đủ",
      description: "Huỷ trước ngày check-in hơn 7 ngày — hoàn 100%",
    };
  }

  if (daysUntilCheckIn >= 3) {
    return {
      refundPercent: 50,
      label: "Hoàn tiền 50%",
      description: "Huỷ trước ngày check-in 3–7 ngày — hoàn 50%",
    };
  }

  return {
    refundPercent: 0,
    label: "Không hoàn tiền",
    description: "Huỷ trong vòng 3 ngày trước check-in — không hoàn tiền",
  };
};

export const calcRefundAmount = (
  totalAmount: Prisma.Decimal,
  refundPercent: number,
): number => {
  return Math.floor((Number(totalAmount) * refundPercent) / 100);
};
