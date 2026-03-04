import {
  createSearchParamsCache,
  parseAsIsoDate,
  parseAsStringEnum,
} from "nuqs/server";

export const adminBookingCalendarParsers = {
  status: parseAsStringEnum([
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "CHECKED_OUT",
    "CANCELLED",
    "NO_SHOW",
  ] as const),
  paymentStatus: parseAsStringEnum([
    "UNPAID",
    "PENDING",
    "PAID",
    "REFUNDED",
    "FAILED",
  ] as const),
  from: parseAsIsoDate,
  to: parseAsIsoDate,
};

export const adminBookingCalendarCache = createSearchParamsCache(
  adminBookingCalendarParsers,
);
export type BookingCalendarParams = Awaited<
  ReturnType<typeof adminBookingCalendarCache.parse>
>;
