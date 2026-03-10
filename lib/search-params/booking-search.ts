import { createSearchParamsCache, parseAsStringEnum } from "nuqs/server";

export const accountBookingParsers = {
  status: parseAsStringEnum([
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "CHECKED_OUT",
    "CANCELLED",
    "NO_SHOW",
  ] as const),
};

export const accountBookingCache = createSearchParamsCache(
  accountBookingParsers,
);
export type AccountBookingParams = Awaited<
  ReturnType<typeof accountBookingCache.parse>
>;
