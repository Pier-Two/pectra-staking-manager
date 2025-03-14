import { ignition } from "hardhat";
import BatchDepositModule from "../ignition/modules/BatchDeposit";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const buildFixture = async () => {
  const { batchDeposit } = await ignition.deploy(BatchDepositModule);

  return { batchDeposit };
};

export const testingFixture = async () => loadFixture(buildFixture);
