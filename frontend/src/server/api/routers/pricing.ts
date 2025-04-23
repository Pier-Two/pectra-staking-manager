import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type { CoinMarketCapPriceResponse } from "pec/types/api";
import { CoinMarketCapAxios } from "pec/lib/server/axios";

export const pricingRouter = createTRPCRouter({
  getCurrentEthPrice: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        convert: z.string(),
      }),
    )
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

      return response?.data?.data.ETH?.quote.USD?.price;
    }),
});
