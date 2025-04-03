import { HOODI_CHAIN_DETAILS } from "pec/constants/chain";
import { client } from "pec/lib/wallet/client";
import { getRpcClient } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";

export const useRpcClient = () => {
  const chain = useActiveWalletChain();

  if (!chain) return null;

  if (chain.id === HOODI_CHAIN_DETAILS.id) {
    return getRpcClient({
      chain: HOODI_CHAIN_DETAILS,
      client,
    });
  }

  throw new Error(`Unsupported network: ${JSON.stringify(chain)}`);
};
