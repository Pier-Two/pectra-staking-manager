import { client } from "pec/lib/wallet/client";
import type { Contracts } from "pec/types/contracts";
import { getContract } from "thirdweb";
import { HOODI_CHAINID } from "./networks";
import {
  batchDepositDeployedAddresses,
  batchDepositABI,
} from "@piertwo/contracts";
import { HOODI_CHAIN_DETAILS } from "./chain";
import { mainnet } from "thirdweb/chains";

export const getContracts = (id: number | undefined): Contracts => {
  if (id === HOODI_CHAINID || id === mainnet.id) {
    return {
      consolidation: getContract({
        client,
        address: "0x0000BBdDc7CE488642fb579F8B00f3a590007251",
        chain: HOODI_CHAIN_DETAILS,
      }),
      batchDeposit: getContract({
        client,
        address: batchDepositDeployedAddresses[HOODI_CHAINID],
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
