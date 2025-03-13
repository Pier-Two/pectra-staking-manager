// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BatchDepositModule = buildModule("BatchDepositModule", (m) => {
  const batchDeposit = m.contract("BatchDeposit", []);

  return { batchDeposit };
});

export default BatchDepositModule;
