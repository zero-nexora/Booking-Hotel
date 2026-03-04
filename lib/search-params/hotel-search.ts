import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  createSearchParamsCache,
} from "nuqs/server";

export const hotelSearchParsers = {
  cityId: parseAsString.withDefault(""),
  countryId: parseAsString.withDefault(""),
  cityName: parseAsString.withDefault(""),
  checkIn: parseAsIsoDate,
  checkOut: parseAsIsoDate,
  guests: parseAsInteger.withDefault(1),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  starRating: parseAsInteger,
  amenityIds: parseAsArrayOf(parseAsString).withDefault([]),
};

export const hotelSearchCache = createSearchParamsCache(hotelSearchParsers);
export type HotelSearchParams = Awaited<
  ReturnType<typeof hotelSearchCache.parse>
>;
