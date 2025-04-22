import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type { CoinMarketCapPriceResponse } from "pec/types/api";
import { CoinMarketCapAxios } from "pec/lib/server/axios";
import { getCached, setCache } from "pec/server/cache";

export const pricingRouter = createTRPCRouter({
  getCurrentEthPrice: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        convert: z.string(),
      }),
    )
    .query(async ({ input: { symbol, convert } }) => {
      const cacheKey = `eth-price-${symbol}-${convert}`;
      const cachedPrice = getCached<number>(cacheKey);
      if (cachedPrice !== null) return cachedPrice;

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
      //Cache for 5 minutes
      if (price) setCache(cacheKey, price, 5 * 60 * 1000);
      return price;
    }),
});
