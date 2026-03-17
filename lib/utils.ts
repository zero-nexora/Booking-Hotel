import { Decimal } from "@prisma/client/runtime/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isTomorrow,
} from "date-fns";
import { vi } from "date-fns/locale";
import { BOOKING_EXPIRY_MINUTES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d));

export const formatDateShort = (d: Date | string) =>
  format(toDate(d), "dd/MM/yyyy");

export const formatDatetime = (d: Date | string) =>
  format(toDate(d), "dd/MM/yyyy HH:mm");

export const formatDateFull = (d: Date | string) =>
  format(toDate(d), "EEEE, dd/MM/yyyy", { locale: vi });

export const formatDateLong = (d: Date | string) =>
  format(toDate(d), "dd MMMM, yyyy", { locale: vi });

export const formatDateCompact = (d: Date | string) =>
  format(toDate(d), "MMM yyyy", { locale: vi });

export const formatDateMonthDay = (d: Date | string) =>
  format(toDate(d), "dd MMM", { locale: vi });

export const formatTime = (d: Date | string) => format(toDate(d), "HH:mm");

export const formatRelative = (d: Date | string) =>
  formatDistanceToNow(toDate(d), { addSuffix: true, locale: vi });

export const formatSmart = (d: Date | string): string => {
  const date = toDate(d);
  if (isToday(date)) return "Hôm nay";
  if (isYesterday(date)) return "Hôm qua";
  if (isTomorrow(date)) return "Ngày mai";
  return formatDateShort(date);
};

export const toDateParam = (d: Date): string => format(d, "yyyy-MM-dd");

export const formatCurrencyUSD = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatCurrencyUSDExact = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const calcNights = (checkIn: Date, checkOut: Date): number => {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

export const calcTotal = (
  basePrice: Decimal | number,
  nights: number,
): number => {
  return Number(basePrice) * nights;
};

export const getBookingExpiresAt = (): Date => {
  return new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000);
};

// export const isBookingCancellable = (status: string): boolean => {
//   return ["PENDING", "CONFIRMED"].includes(status);
// };

export const getDatesInRange = (checkIn: Date, checkOut: Date): Date[] => {
  const dates: Date[] = [];
  const cur = new Date(checkIn);
  while (cur < checkOut) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};
