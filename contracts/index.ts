import hoodiDeployedAddresses from "./ignition/deployments/chain-560048/deployed_addresses.json";
import { HOODI_CHAIN_ID } from "./constants/networks";
import { BATCH_DEPOSIT_ABI as batchDepositABI } from "./constants/abi";

const batchDepositDeployedAddresses: Record<typeof HOODI_CHAIN_ID, string> = {
  [HOODI_CHAIN_ID]: hoodiDeployedAddresses["BatchDepositModule#BatchDeposit"],
};

export { batchDepositDeployedAddresses, batchDepositABI };
