import { hoodi } from "pec/constants/contracts";
import { HOODI_CHAINID } from "pec/constants/networks";
import { client } from "pec/lib/wallet/client";
import { getRpcClient } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";

export const useRpcClient = () => {
  const chain = useActiveWalletChain();

  if (!chain) return null;

  if (chain.id === HOODI_CHAINID) {
    return getRpcClient({
      chain: hoodi,
      client,
    });
  }

  throw new Error(`Unsupported network: ${JSON.stringify(chain)}`);
};
