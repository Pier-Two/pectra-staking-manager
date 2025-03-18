import { client } from "pec/lib/wallet/client";
import { Contracts } from "pec/types/contracts";
import { getContract } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import { HOLEKSY_CHAINID } from "./networks";

export const holesky: Readonly<
  ChainOptions & {
    rpc: string;
  }
> = {
  name: "Holesky",
  rpc: "https://17000.rpc.thirdweb.com",
  id: 17000,
};

export const getContracts = (id: number | undefined): Contracts => {
  if (id === HOLEKSY_CHAINID) {
    return {
      consolidation: getContract({
        client,
        address: "0x0000BBdDc7CE488642fb579F8B00f3a590007251",
        chain: holesky,
      }),
      // TODO: Replace
      batchDeposit: "0x00000961Ef480Eb55e80D19ad83579A64c007002",
      withdrawal: getContract({
        client,
        address: "0x00000961Ef480Eb55e80D19ad83579A64c007002",
        chain: holesky,
      }),
    };
  }

  throw new Error(`Unsupported network: ${id}`);
};
