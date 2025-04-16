import { api } from "pec/trpc/react";
import { useWalletAddress } from "./useWallet";
import { useActiveChainWithDefault } from "./useChain";

export const useValidators = () => {
  const walletAddress = useWalletAddress();
  const chain = useActiveChainWithDefault();

  const queryFn = api.validators.getValidators.useQuery(
    {
      address: walletAddress,
      chainId: chain.id,
    },
    { enabled: !!walletAddress },
  );

  return queryFn;
};
