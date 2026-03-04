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
) => {
  const cached = await redis.get<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttlSeconds });

  return fresh;
};

export const invalidateCache = async (...keys: string[]) => {
  if (keys.length === 0) return;
  await redis.del(...keys);
};

export const TTL = {
  SHORT: 60,
  MEDIUM: 60 * 5,
  LONG: 60 * 60,
  DAY: 60 * 60 * 24,
} as const;

export const CACHE_KEYS = {
  COUNTRY_ALL: "country:all",
  CITY_ALL: "city:all",
  BED_TYPES_ALL: "bed-types:all",
  ROOM_TYPES_ALL: "room-types:all",
  AMENITIES_ALL: "amenities:all",
} as const;
