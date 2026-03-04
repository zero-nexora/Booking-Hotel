import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const adminReviewParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  status: parseAsStringEnum(["PENDING", "APPROVED", "REJECTED"] as const),
  hotelId: parseAsString.withDefault(""),
};

export const adminReviewCache = createSearchParamsCache(adminReviewParsers);
export type AdminReviewParams = Awaited<
  ReturnType<typeof adminReviewCache.parse>
>;
