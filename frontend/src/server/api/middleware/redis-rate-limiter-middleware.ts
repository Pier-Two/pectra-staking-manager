import { TRPCError } from "@trpc/server";
import { createTRPCMiddleware } from "../trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "pec/lib/utils/redis";

// Rate limiter middleware for tRPC procedures
export const redisRateLimiterMiddleware = createTRPCMiddleware(
  async ({ ctx, path, next }) => {
    const ratelimit = new Ratelimit({
      redis: redis,
      // TODO: what should the rate limit be?
      limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
      analytics: true,
    });

    const ip =
      ctx.headers.get("x-forwarded-for") ?? ctx.headers.get("x-real-ip");

    // if we don't have an ip address, we can't rate limit
    if (!ip) {
      return next();
    }

    // check if the identifier is already in the ratelimit
    const { success } = await ratelimit.limit(`${ip}:${path}`);

    // if the request is not successful, we throw an error
    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }

    return next();
  },
);
