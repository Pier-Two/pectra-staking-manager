import { api } from "pec/trpc/react";

import { useActiveChainWithDefault } from "./useChain";
import { useWalletAddress } from "./useWallet";

export const useValidatorPerformance = (
  filter: "daily" | "weekly" | "monthly" | "yearly" | "overall",
) => {
  const walletAddress = useWalletAddress();
  const chain = useActiveChainWithDefault();

  const queryFn = api.validators.getValidatorsPerformanceInWei.useQuery(
    {
      address: walletAddress,
      chainId: chain.id,
      filter,
    },
    { enabled: !!walletAddress },
  );

  return queryFn;
};
