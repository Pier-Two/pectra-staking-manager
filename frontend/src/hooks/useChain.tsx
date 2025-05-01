import { useActiveWalletChain } from "thirdweb/react";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { type ChainOptions } from "thirdweb/chains";
import { SUPPORTED_NETWORKS_IDS } from "pec/constants/chain";

export const useActiveChainWithDefault = (): Readonly<
  ChainOptions & {
    rpc: string;
  }
> => {
  const chain = useActiveWalletChain();

  if (!chain) return MAIN_CHAIN;

  if (!SUPPORTED_NETWORKS_IDS.includes(chain.id)) {
    return MAIN_CHAIN;
  }

  return chain;
};
