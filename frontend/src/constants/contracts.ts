import { client } from "pec/lib/wallet/client";
import type { Contracts } from "pec/types/contracts";
import { getContract } from "thirdweb";
import type { ChainOptions } from "thirdweb/chains";
import { HOODI_CHAINID } from "./networks";

export const hoodi: Readonly<
  ChainOptions & {
    rpc: string;
  }
> = {
  name: "Hoodi testnet",
  // rpc: "https://rpc.hoodi.ethpandaops.io",
  rpc: "https://0xrpc.io/hoodi",
  id: 560048,
  nativeCurrency: {
    name: "Hoodi",
    symbol: "ETH",
    decimals: 18,
  },
};

export const getContracts = (id: number | undefined): Contracts => {
  console.log("id", id);
  if (id === HOODI_CHAINID) {
    return {
      consolidation: getContract({
        client,
        address: "0x0000BBdDc7CE488642fb579F8B00f3a590007251",
        chain: hoodi,
      }),
      // TODO: Replace
      batchDeposit: "0x00000961Ef480Eb55e80D19ad83579A64c007002",
      withdrawal: getContract({
        client,
        address: "0x00000961Ef480Eb55e80D19ad83579A64c007002",
        chain: hoodi,
      }),
    };
  }

  throw new Error(`Unsupported network: ${id}`);
};
