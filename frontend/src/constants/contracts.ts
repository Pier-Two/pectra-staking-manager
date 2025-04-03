import { client } from "pec/lib/wallet/client";
import type { Contracts } from "pec/types/contracts";
import { getContract } from "thirdweb";
import {
  batchDepositDeployedAddresses,
  batchDepositABI,
} from "@piertwo/contracts";
import { HOODI_CHAIN_DETAILS } from "./chain";
import { mainnet } from "thirdweb/chains";

export const getContracts = (id: number | undefined): Contracts => {
  if (id === HOODI_CHAIN_DETAILS.id || id === mainnet.id) {
    return {
      consolidation: getContract({
        client,
        address: "0x0000BBdDc7CE488642fb579F8B00f3a590007251",
        chain: HOODI_CHAIN_DETAILS,
      }),
      batchDeposit: getContract({
        client,
        address:
          batchDepositDeployedAddresses[HOODI_CHAIN_DETAILS.id as 560048],
        chain: HOODI_CHAIN_DETAILS,
        abi: batchDepositABI,
      }),
      withdrawal: getContract({
        client,
        address: "0x00000961Ef480Eb55e80D19ad83579A64c007002",
        chain: HOODI_CHAIN_DETAILS,
      }),
    };
  }

  throw new Error(`Unsupported network: ${id}`);
};
