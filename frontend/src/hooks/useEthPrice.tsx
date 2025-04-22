import { api } from "pec/trpc/react";

export const useEthPrice = (symbol: string, convert: string) => {
  const queryFn = api.pricing.getCurrentEthPrice.useQuery(
    {
      symbol,
      convert,
    },
    { enabled: !!symbol && !!convert },
  );

  return queryFn;
};
