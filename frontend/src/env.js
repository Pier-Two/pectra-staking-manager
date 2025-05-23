import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production")
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
    return `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`;
  return "http://localhost:3000";
};

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    THIRDWEB_SECRET_KEY: z.string(),
    MONGODB_URI: z.string(),
    QSTASH_TOKEN: z.string(),
    QSTASH_URL: z.string(),
    QSTASH_CURRENT_SIGNING_KEY: z.string(),
    QSTASH_NEXT_SIGNING_KEY: z.string(),
    VERCEL_URL: z.string(),
    BEACONCHAIN_API_KEY: z.string(),
    HUBSPOT_API_KEY: z.string(),
    AUTH_JWT_VERIFYING_KEY: z.string(),
    COIN_MARKET_CAP_API_KEY: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    MONGO_TRIGGER_SECRET: z.string(),
    QUICKNODE_ENDPOINT_SECRET: z.string(),
    QUICKNODE_ENDPOINT_NAME: z.string(),
    HOODI_QUICKNODE_ENDPOINT_SECRET: z.string(),
    HOODI_QUICKNODE_ENDPOINT_NAME: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_URL: z.string(),
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_URL: getBaseUrl(),
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    QSTASH_URL: process.env.QSTASH_URL,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
    BEACONCHAIN_API_KEY: process.env.BEACONCHAIN_API_KEY,
    HUBSPOT_API_KEY: process.env.HUBSPOT_API_KEY,
    AUTH_JWT_VERIFYING_KEY: process.env.AUTH_JWT_VERIFYING_KEY,
    COIN_MARKET_CAP_API_KEY: process.env.COIN_MARKET_CAP_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    MONGO_TRIGGER_SECRET: process.env.MONGO_TRIGGER_SECRET,
    QUICKNODE_ENDPOINT_SECRET: process.env.QUICKNODE_ENDPOINT_SECRET,
    QUICKNODE_ENDPOINT_NAME: process.env.QUICKNODE_ENDPOINT_NAME,
    HOODI_QUICKNODE_ENDPOINT_SECRET:
      process.env.HOODI_QUICKNODE_ENDPOINT_SECRET,
    HOODI_QUICKNODE_ENDPOINT_NAME: process.env.HOODI_QUICKNODE_ENDPOINT_NAME,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
