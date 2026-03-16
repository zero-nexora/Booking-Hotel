import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsArrayOf,
  parseAsFloat,
  parseAsStringEnum,
} from "nuqs/server";
import { DEFAULT_PAGE_SIZE } from "../constants";

export const hotelSearchParsers = {
  search: parseAsString.withDefault(""),
  checkIn: parseAsIsoDate,
  checkOut: parseAsIsoDate,
  adults: parseAsInteger.withDefault(1),
  children: parseAsInteger.withDefault(0),
  limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  minPrice: parseAsFloat,
  maxPrice: parseAsFloat,
  stars: parseAsArrayOf(parseAsInteger),
  amenities: parseAsArrayOf(parseAsString),
  bedTypes: parseAsArrayOf(parseAsString),
  roomTypes: parseAsArrayOf(parseAsString),
  minRating: parseAsFloat,
  sort: parseAsStringEnum([
    "price_asc",
    "price_desc",
    "rating",
    "stars",
  ] as const).withDefault("price_asc"),
  view: parseAsStringEnum(["list", "grid", "map"] as const).withDefault("list"),
};

export const hotelSearchCache = createSearchParamsCache(hotelSearchParsers);
export type HotelSearchParams = Awaited<
  ReturnType<typeof hotelSearchCache.parse>
>;
