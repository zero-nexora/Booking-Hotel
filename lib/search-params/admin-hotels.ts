import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  createSearchParamsCache,
} from "nuqs/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";

export const adminHotelParsers = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  search: parseAsString.withDefault(""),
  status: parseAsStringEnum(["ACTIVE", "INACTIVE", "MAINTENANCE"] as const),
  starRating: parseAsInteger,
  cityId: parseAsString.withDefault(""),
  countryId: parseAsString.withDefault(""),
};

export const adminHotelCache = createSearchParamsCache(adminHotelParsers);
export type AdminHotelParams = Awaited<
  ReturnType<typeof adminHotelCache.parse>
>;
