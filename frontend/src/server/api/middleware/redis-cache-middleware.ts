import { redis } from "pec/lib/utils/redis";

import { createTRPCMiddleware } from "../trpc";

// Cache middleware for tRPC procedures
export const redisCacheMiddleware = ({
  ttl = 60 * 5, // Default 5 minutes cache
  staleWhileRevalidate = true, // Enable stale-while-revalidate by default
  keyPrefix = "trpc-cache:",
  staleTime = 60 * 5, // Default 5 minutes stale time
}: {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  keyPrefix?: string;
  staleTime?: number;
} = {}) => {
  return createTRPCMiddleware(async ({ input, path, next }) => {
    // Create a cache key based on the procedure path and input
    const cacheKey = `${keyPrefix}${path}:${JSON.stringify(input)}`;

    try {
      // Try to get data from cache
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cachedData = await redis.get<{ data: any; timestamp: number }>(
        cacheKey,
      );

      // Check if we have valid cached data
      if (cachedData) {
        const cacheAge = (Date.now() - cachedData.timestamp) / 1000; // Age in seconds

        // If data is fresh (within TTL), return it immediately
        if (cacheAge < ttl) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return cachedData.data;
        }

        // If stale-while-revalidate is enabled and we have stale data
        if (staleWhileRevalidate) {
          // Start background revalidation
          void (async () => {
            try {
              const result = await next();
              // Update the cache with fresh data
              await redis.set(
                cacheKey,
                {
                  data: result,
                  timestamp: Date.now(),
                },
                { ex: ttl + staleTime },
              );
            } catch (error) {
              console.error("[Cache] Background revalidation failed:", error);
            }
          })();

          // Return stale data immediately
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return cachedData.data;
        }
      }

      // If no cache hit or stale data without stale-while-revalidate, fetch fresh data
      const result = await next();

      // Store in cache
      await redis.set(
        cacheKey,
        {
          data: result,
          timestamp: Date.now(),
        },
        { ex: ttl + staleTime },
      );

      return result;
    } catch (error) {
      // If Redis fails, continue without caching
      console.error("[Cache] Redis error, bypassing cache:", error);
      return next();
    }
  });
};
