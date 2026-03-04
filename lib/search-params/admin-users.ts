import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";

export const adminUserParsers = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  search: parseAsString.withDefault(""),
  role: parseAsStringEnum(["ADMIN", "CUSTOMER"] as const),
};
export const adminUserCache = createSearchParamsCache(adminUserParsers);
export type AdminUserParams = Awaited<ReturnType<typeof adminUserCache.parse>>;
