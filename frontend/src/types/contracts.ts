import type { batchDepositABI } from "@piertwo/contracts";
import type { Address, ThirdwebContract } from "thirdweb";

export interface Contracts {
  consolidation: ThirdwebContract<[], Address>;
  withdrawal: ThirdwebContract<[], Address>;
  batchDeposit: ThirdwebContract<typeof batchDepositABI, Address>;
}
