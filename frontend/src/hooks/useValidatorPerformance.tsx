import { api } from "pec/trpc/react";
import { useWalletAddress } from "./useWallet";
import { useActiveChainWithDefault } from "./useChain";

export const useValidatorPerformance = (
  filter: "daily" | "weekly" | "monthly" | "yearly" | "overall",
) => {
  const walletAddress = useWalletAddress();
  const chain = useActiveChainWithDefault();

  const queryFn = api.validators.getValidatorsPerformanceInGwei.useQuery(
    {
      address: walletAddress,
      chainId: chain.id,
      filter,
    },
    { enabled: !!walletAddress },
  );

  return queryFn;
};
