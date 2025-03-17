import { getContracts } from "pec/constants/contracts";
import { useActiveWalletChain, useChainMetadata } from "thirdweb/react";

export const useContracts = () => {
  const chain = useActiveWalletChain();

  if (!chain) {
    return null;
  }

  return getContracts(chain.id);
};
