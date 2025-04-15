import { ethers } from "hardhat";

async function main() {
  // from sol
  // bytes memory callData = bytes.concat(srcPubkey, targetPubkey);
  // (bool writeOK,) = ConsolidationsContract.call{value: fee}(callData);

  const txData =
    "0x90acb61c7e314ae2447caa42150a85ed721fef422afbe2029d13d3a308c2fc1037be68bc1c4c963c07275625975bed54831cf4787d988df8aaf984de9038699dc0d3fde631960e01eddf524e04b0fb599707e4efc7211972cea666fdfcf4d69a";

  const source = txData.substring(0, 98);
  const target = `0x${txData.substring(98, 194)}`;

  const hoodiScan = "https://hoodi.beaconcha.in/validator/";

  console.log("Source: (should have a zero balance)");
  console.log(`${hoodiScan}${source}`);

  console.log("Target: (should have atleast 64 balance) ");
  console.log(`${hoodiScan}${target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
