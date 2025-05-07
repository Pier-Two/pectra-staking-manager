import { HOODI_CHAIN_DETAILS } from "pec/constants/chain";
import { client } from "pec/lib/wallet/client";
import { getRpcClient } from "thirdweb";
import { useActiveChainWithDefault } from "./useChain";
import { mainnet } from "thirdweb/chains";

export const useRpcClient = () => {
  const chain = useActiveChainWithDefault();

  if (!chain) return null;

  if (chain.id === HOODI_CHAIN_DETAILS.id) {
    return getRpcClient({
      chain: HOODI_CHAIN_DETAILS,
      client,
    });
  } else if (chain.id === mainnet.id) {
    return getRpcClient({
      chain: mainnet,
      client,
    });
  }

  throw new Error(`Unsupported network: ${JSON.stringify(chain)}`);
};
