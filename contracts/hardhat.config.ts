import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-chai-matchers-viem";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const forkingURL = process.env.FORKING_URL || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: forkingURL,
        blockNumber: 22062918,
      },
    },
  },
};

export default config;
