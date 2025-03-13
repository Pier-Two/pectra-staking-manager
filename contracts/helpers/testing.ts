import { ignition } from "hardhat"; 
import BatchDepositModule from "../ignition/modules/Lock";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

export const testingFixture = async () => {
  loadFixture(async () => {
    const { token } = await ignition.deploy(BatchDepositModule); 
 
    return { token }
  });
}
