import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { CoinMarketCapPriceResponse } from "pec/types/api";
import { CoinMarketCapAxios } from "pec/lib/server/axios";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";

import { redisCacheMiddleware } from "../middleware/redis-cache-middleware";

export const pricingRouter = createTRPCRouter({
  getCurrentEthPrice: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        convert: z.string(),
      }),
    )
    .use(redisCacheMiddleware())
    .query(async ({ input: { symbol, convert } }) => {
      const response = await CoinMarketCapAxios.get<CoinMarketCapPriceResponse>(
        "/cryptocurrency/quotes/latest",
        {
          params: {
            symbol,
            convert,
          },
        },
      );

      const price = response?.data?.data.ETH?.quote.USD?.price;

      if (!price) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No price found",
        });
      }

      return price;
    }),
});
