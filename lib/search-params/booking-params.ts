import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsIsoDate,
} from "nuqs/server";

export const bookingParsers = {
  checkIn: parseAsIsoDate,
  checkOut: parseAsIsoDate,
  adults: parseAsInteger.withDefault(1),
  children: parseAsInteger.withDefault(0),
};

export const bookingCache = createSearchParamsCache(bookingParsers);
export type bookingParams = Awaited<ReturnType<typeof bookingCache.parse>>;
