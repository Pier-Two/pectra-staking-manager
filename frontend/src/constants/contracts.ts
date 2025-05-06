import { client } from "pec/lib/wallet/client";
import type { Contracts } from "pec/types/contracts";
import { getContract } from "thirdweb";
import {
  batchDepositDeployedAddresses,
  batchDepositABI,
} from "@piertwo/contracts";
import { HOODI_CHAIN_DETAILS } from "./chain";
import { mainnet } from "thirdweb/chains";

// Address found in the EIP: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7251.md#specification
const CONSOLIDATION_ADDRESS = "0x0000BBdDc7CE488642fb579F8B00f3a590007251";

// Address found in the EIP: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7002.md#configuration
const WITHDRAWAL_ADDRESS = "0x00000961Ef480Eb55e80D19ad83579A64c007002";

export const getContracts = (id: number): Contracts => {
  if (id === HOODI_CHAIN_DETAILS.id) {
    return {
      consolidation: getContract({
        client,
        address: CONSOLIDATION_ADDRESS,
        chain: HOODI_CHAIN_DETAILS,
      }),
      batchDeposit: getContract({
        client,
        address:
          batchDepositDeployedAddresses[HOODI_CHAIN_DETAILS.id as 560048],
        abi: batchDepositABI,
        chain: HOODI_CHAIN_DETAILS,
      }),
      withdrawal: getContract({
        client,
        address: WITHDRAWAL_ADDRESS,
        chain: HOODI_CHAIN_DETAILS,
      }),
    };
  } else if (id === mainnet.id) {
    return {
      consolidation: getContract({
        client,
        address: CONSOLIDATION_ADDRESS,
        chain: mainnet,
      }),
      batchDeposit: getContract({
        client,
        address: batchDepositDeployedAddresses[1],
        abi: batchDepositABI,
        chain: mainnet,
      }),
      withdrawal: getContract({
        client,
        address: WITHDRAWAL_ADDRESS,
        chain: mainnet,
      }),
    };
  }

  throw new Error(`Unsupported network: ${id}`);
};
