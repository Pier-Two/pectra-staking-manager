import { getRpcClient } from "thirdweb";

import { HOODI_CHAIN_DETAILS } from "pec/constants/chain";
import { client } from "pec/lib/wallet/client";

import { useActiveChainWithDefault } from "./useChain";

export const useRpcClient = () => {
  const chain = useActiveChainWithDefault();

  if (!chain) return null;

  if (chain.id === HOODI_CHAIN_DETAILS.id) {
    return getRpcClient({
      chain: HOODI_CHAIN_DETAILS,
      client,
    });
  }

  throw new Error(`Unsupported network: ${JSON.stringify(chain)}`);
};
