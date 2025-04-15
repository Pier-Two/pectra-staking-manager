import { ethers } from "hardhat";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const targetContract = "0x0000BBdDc7CE488642fb579F8B00f3a590007251";
  const sender = "0xd286E945CCF80a29ad70151DCcc4e520837e62Dc";

  // Make sure to create a .env file with your Etherscan API key
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
  if (!etherscanApiKey) {
    throw new Error("Please set your ETHERSCAN_API_KEY in a .env file");
  }

  console.log(`Fetching transactions from ${sender} to ${targetContract}...`);

  // Query Etherscan API for normal transactions
  const response = await axios.get("https://api-hoodi.etherscan.io/api", {
    params: {
      module: "account",
      action: "txlist",
      address: targetContract,
      startblock: "0",
      endblock: "99999999",
      sort: "asc",
      apikey: etherscanApiKey,
    },
  });

  if (response.data.status !== "1") {
    throw new Error(`Etherscan API error: ${response.data.message}`);
  }

  // Filter transactions where the sender matches our specified address
  const relevantTxs = response.data.result.filter(
    (tx: any) => tx.from.toLowerCase() === sender.toLowerCase(),
  );

  console.log(`Found ${relevantTxs.length} consolidation transactions`);

  // Extract the input data (tx.data) from each transaction
  const txDataFields = relevantTxs.map((tx: any) => ({
    hash: tx.hash,
    timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
    data: tx.input,
  }));

  // Display the transaction data
  txDataFields.forEach((tx: any, index: number) => {
    console.log(`\nTransaction ${index + 1}:`);
    console.log(`Hash: ${tx.hash}`);
    console.log(`Timestamp: ${tx.timeStamp}`);
    console.log(`Data: ${tx.data}`);

    const hoodiScan = "https://hoodi.beaconcha.in/validator/";

    const source = tx.data.substring(0, 98);
    const target = `0x${tx.data.substring(98, 194)}`;

    console.log("---------------------EXPLORERS------------------------");

    console.log("Source Validator:");
    console.log(`${hoodiScan}${source}`);

    console.log("Target Validator:");
    console.log(`${hoodiScan}${target}`);

    console.log("--------------------------------------------------");
  });

  return txDataFields;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
