import { getContracts } from "pec/constants/contracts";
import { useActiveWalletChain } from "thirdweb/react";

export const useContracts = () => {
  const chain = useActiveWalletChain();
  if (!chain) return null;
  return getContracts(chain.id);
};
