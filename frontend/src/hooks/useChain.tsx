import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { type ChainOptions } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";

export const useActiveChainWithDefault = (): Readonly<
  ChainOptions & {
    rpc: string;
  }
> => {
  const activeChain = useActiveWalletChain();

  return activeChain ?? MAIN_CHAIN;
};
