import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsIsoDate,
} from "nuqs/server";

export const roomDetailParsers = {
  checkIn: parseAsIsoDate,
  checkOut: parseAsIsoDate,
  adults: parseAsInteger.withDefault(1),
  children: parseAsInteger.withDefault(0),
};

export const roomDetailCache = createSearchParamsCache(roomDetailParsers);
export type roomDetailParams = Awaited<
  ReturnType<typeof roomDetailCache.parse>
>;
