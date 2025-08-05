const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to Somnia Testnet...");

  // Deploy STT Token first
  console.log("1. Deploying STT Token...");
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = await STTToken.deploy();
  await sttToken.waitForDeployment();
  const sttAddress = await sttToken.getAddress();
  console.log("STT Token deployed to:", sttAddress);

  // Deploy GameFi Contract
  console.log("2. Deploying MineEscapeGameFi...");
  const MineEscapeGameFi = await hre.ethers.getContractFactory("MineEscapeGameFi");
  const gamefi = await MineEscapeGameFi.deploy(sttAddress);
  await gamefi.waitForDeployment();
  const gamefiAddress = await gamefi.getAddress();
  console.log("MineEscapeGameFi deployed to:", gamefiAddress);

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("STT Token Address:", sttAddress);
  console.log("GameFi Contract Address:", gamefiAddress);
  console.log("\nUpdate these addresses in:");
  console.log("- lib/gamefi-contract.ts");
  console.log("- Add STT token to your wallet using address:", sttAddress);
  console.log("\nTo get test STT tokens, call the faucet() function on the STT contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});