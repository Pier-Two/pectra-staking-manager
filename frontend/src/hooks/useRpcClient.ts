import { holesky } from "pec/constants/contracts";
import { HOLEKSY_CHAINID } from "pec/constants/networks";
import { client } from "pec/lib/wallet/client";
import { getRpcClient } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";

export const useRpcClient = () => {
  const chain = useActiveWalletChain();

  if (!chain) return null;

  if (chain.id === HOLEKSY_CHAINID) {
    return getRpcClient({
      chain: holesky,
      client,
    });
  }

  throw new Error(`Unsupported network: ${JSON.stringify(chain)}`);
};
