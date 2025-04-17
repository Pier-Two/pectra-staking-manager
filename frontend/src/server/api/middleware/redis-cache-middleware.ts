import { redis } from "pec/lib/utils/redis";
import { createTRPCMiddleware } from "../trpc";

// Cache middleware for tRPC procedures
export const redisCacheMiddleware = ({
  ttl = 30, // Default 30 seconds cache
  staleWhileRevalidate = true, // Enable stale-while-revalidate by default
  keyPrefix = "trpc-cache:",
}: {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  keyPrefix?: string;
} = {}) => {
  return createTRPCMiddleware(async ({ ctx, input, path, next }) => {
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
          console.debug(
            `[Cache] Fresh cache hit for ${path} (age: ${cacheAge.toFixed(2)}s)`,
          );
          return cachedData.data;
        }

        // If stale-while-revalidate is enabled and we have stale data
        if (staleWhileRevalidate) {
          console.debug(
            `[Cache] Stale cache hit for ${path} (age: ${cacheAge.toFixed(2)}s), starting background revalidation`,
          );
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
                { ex: ttl + 60 },
              ); // Add some buffer to the expiry
              console.debug(
                `[Cache] Background revalidation completed for ${path}`,
              );
            } catch (error) {
              console.error("[Cache] Background revalidation failed:", error);
            }
          })();

          // Return stale data immediately
          return cachedData.data;
        }
      }

      // If no cache hit or stale data without stale-while-revalidate, fetch fresh data
      console.debug(`[Cache] Cache miss for ${path}, fetching fresh data`);
      const result = await next();

      // Store in cache
      await redis.set(
        cacheKey,
        {
          data: result,
          timestamp: Date.now(),
        },
        { ex: ttl + 60 },
      ); // Add some buffer to the expiry
      console.debug(`[Cache] Fresh data stored in cache for ${path}`);

      return result;
    } catch (error) {
      // If Redis fails, continue without caching
      console.error("[Cache] Redis error, bypassing cache:", error);
      return next();
    }
  });
};
