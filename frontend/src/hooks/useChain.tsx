import { useActiveWalletChain } from "thirdweb/react";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { type ChainOptions } from "thirdweb/chains";

export const useActiveChainWithDefault = (): Readonly<
  ChainOptions & {
    rpc: string;
  }
> => {
  const chain = useActiveWalletChain();

  return chain ?? MAIN_CHAIN;
};
