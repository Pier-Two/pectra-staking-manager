import { hoodi } from "pec/constants/contracts";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { type ChainOptions } from "thirdweb/chains";

export const useActiveChainWithDefault = (): Readonly<
  ChainOptions & {
    rpc: string;
  }
> => {
  return hoodi ?? MAIN_CHAIN;
};
