import { Address, ThirdwebContract } from "thirdweb";

export type SupportedNetworks = "Holesky";

export interface Contracts {
  consolidation: ThirdwebContract<[], Address>;
  withdrawal: ThirdwebContract<[], Address>;
  batchDeposit: string;
}
