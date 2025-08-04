const hre = require("hardhat");

async function main() {
  console.log("Deploying MineEscapeLeaderboard to Somnia Testnet...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", await deployer.getAddress());

  const MineEscapeLeaderboard = await hre.ethers.getContractFactory("MineEscapeLeaderboard", deployer);
  const leaderboard = await MineEscapeLeaderboard.deploy();

  await leaderboard.waitForDeployment();

  const address = await leaderboard.getAddress();
  console.log("MineEscapeLeaderboard deployed to:", address);
  console.log("Update this address in lib/contract.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});