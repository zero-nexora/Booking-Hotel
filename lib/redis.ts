import { Redis } from "@upstash/redis";
import { env } from "./env";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const getOrSet = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 60,
): Promise<T> => {
  const cached = await redis.get<T>(key);
  if (cached !== null) return cached;
  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
};

export const invalidateCache = async (...keys: string[]): Promise<void> => {
  if (keys.length === 0) return;
  await redis.del(...keys);
};

export const invalidateByPattern = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
};

export const TTL = {
  TINY: 30,
  SHORT: 60 * 5,
  MEDIUM: 60 * 15,
  LONG: 60 * 60,
  DAY: 60 * 60 * 24,
} as const;

export const CACHE_KEYS = {
  COUNTRY_ALL: "country:all",
  CITY_ALL: "city:all",
  BED_TYPES_ALL: "bed-types:all",
  ROOM_TYPES_ALL: "room-types:all",
  AMENITIES_ALL: "amenities:all",
  HOTELS_FEATURED: "hotels:featured",
  HOTELS_POPULAR_DESTINATIONS: "hotels:popular-destinations",
  HOTELS_TOP_AMENITIES: "hotels:top-amenities",
  HOTELS_HIGHLIGHTED_REVIEWS: "hotels:highlighted-reviews",
  HOTELS_FILTER_OPTIONS: "hotels:filter-options",
  HOTEL_DETAIL: (slug: string) => `hotel:${slug}`,
  HOTEL_SEARCH: (params: string) => `hotel:search:${params}`,
  ADMIN_DASHBOARD_STATS: "admin:dashboard:stats",
  ADMIN_DASHBOARD_REVENUE: "admin:dashboard:revenue",
  ADMIN_DASHBOARD_BOOKING_STATUS: "admin:dashboard:booking-status",
  ADMIN_DASHBOARD_TOP_HOTELS: "admin:dashboard:top-hotels",
} as const;
