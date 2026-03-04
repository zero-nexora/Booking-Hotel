import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  createSearchParamsCache,
} from "nuqs/server";

export const adminRoomParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  isActive: parseAsBoolean,
  roomTypeId: parseAsString.withDefault(""),
};

export const adminRoomCache = createSearchParamsCache(adminRoomParsers);
export type AdminRoomParams = Awaited<ReturnType<typeof adminRoomCache.parse>>;
