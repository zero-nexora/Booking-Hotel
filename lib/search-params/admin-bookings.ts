import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";

export const adminBookingParsers = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  search: parseAsString.withDefault(""),
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
  view: parseAsStringEnum(["calendar", "list"]).withDefault("list"),
  hotelId: parseAsString.withDefault(""),
  from: parseAsIsoDate,
  to: parseAsIsoDate,
};

export const adminBookingCache = createSearchParamsCache(adminBookingParsers);
export type AdminBookingParams = Awaited<
  ReturnType<typeof adminBookingCache.parse>
>;
