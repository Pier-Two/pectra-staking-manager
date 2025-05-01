import { getContracts } from "pec/constants/contracts";
import { useActiveChainWithDefault } from "./useChain";

export const useContracts = () => {
  const chain = useActiveChainWithDefault();

  return getContracts(chain.id);
};
