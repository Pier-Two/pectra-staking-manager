import { useQuery } from "@tanstack/react-query";

interface EthPriceResponse {
  ethPrice: number;
}

export const useEthPrice = () => {
  return useQuery({
    queryKey: ["eth-price"],
    queryFn: async (): Promise<number> => {
      const res = await fetch("/api/eth-price");
      const data = (await res.json()) as EthPriceResponse;
      return data.ethPrice ?? 0;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};
