import { Decimal } from "@prisma/client/runtime/client";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { BOOKING_EXPIRY_MINUTES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDateStr = (date: Date | string): string => {
  if (typeof date === "string") return date.slice(0, 10);
  return format(date, "yyyy-MM-dd");
};

export const formatDateShort = (date: Date | string): string => {
  return format(new Date(date), "MM/dd/yy");
};

export const formatDateDisplay = (date: Date | string): string => {
  return format(new Date(date), "MM/dd");
};

export const formatDateFull = (date: Date | string): string => {
  return format(new Date(date), "MMM d, yyyy");
};

export const formatMonthYear = (date: Date): string => {
  return format(date, "MMMM yyyy", { locale: vi });
};

export const formatCurrencyUSD = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyUSDCompact = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function calcNights(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function calcTotal(basePrice: Decimal | number, nights: number): number {
  return Number(basePrice) * nights;
}

export function buildCursorWhere(cursor?: { id: string; updatedAt: Date }) {
  if (!cursor) return undefined;
  return {
    OR: [
      { updatedAt: { lt: cursor.updatedAt } },
      { updatedAt: cursor.updatedAt, id: { lt: cursor.id } },
    ],
  };
}

export function getNextCursor<T extends { id: string; updatedAt: Date }>(
  items: T[],
  limit: number,
): { id: string; updatedAt: Date } | null {
  if (items.length < limit) return null;
  const last = items[items.length - 1];
  return { id: last.id, updatedAt: last.updatedAt };
}

export function formatCurrency(amount: number | Decimal, currency = "USD") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

export function getBookingExpiresAt(): Date {
  return new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000);
}

export function isBookingCancellable(status: string): boolean {
  return ["PENDING", "CONFIRMED"].includes(status);
}
