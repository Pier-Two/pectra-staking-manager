import { NextResponse } from "next/server";
import { CoinMarketCapAxios } from "pec/lib/server/axios";
import type { CoinMarketCapPriceResponse } from "pec/types/api";

export async function GET() {
  const response = await CoinMarketCapAxios(
    "ETH",
    "USD",
  ).get<CoinMarketCapPriceResponse>("/cryptocurrency/quotes/latest");

  const ethPrice = response?.data?.data.ETH?.quote.USD?.price;

  return NextResponse.json(
    { ethPrice },
    {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate",
      },
    },
  );
}
