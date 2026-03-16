import { Ratelimit } from "@upstash/ratelimit";
import { TRPCError } from "@trpc/server";
import { redis } from "./redis";

type WindowUnit = "ms" | "s" | "m" | "h" | "d";
type WindowStr = `${number} ${WindowUnit}`;

const createLimiter = (tokens: number, window: WindowStr, prefix: string) =>
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix,
  });

export const rateLimiters = {
  auth: createLimiter(10, "1 m", "rl:auth"),
  booking: createLimiter(5, "5 m", "rl:booking"),
  search: createLimiter(60, "1 m", "rl:search"),
  review: createLimiter(3, "10 m", "rl:review"),
  adminMutation: createLimiter(40, "1 m", "rl:admin-mutation"),
  userMutation: createLimiter(20, "1 m", "rl:user-mutation"),
  userCancel: createLimiter(5, "10 m", "rl:user-cancel"),
} as const;

export type RateLimiterKey = keyof typeof rateLimiters;

export const checkRateLimit = async (
  limiter: Ratelimit,
  identifier: string,
): Promise<void> => {
  const { success } = await limiter.limit(identifier);
  if (!success)
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Quá nhiều yêu cầu, vui lòng thử lại sau",
    });
};
