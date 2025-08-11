const hre = require("hardhat");

async function main() {
  console.log("Deploying to Somnia Testnet...");
  
  // Deploy STT Token
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = await STTToken.deploy();
  await sttToken.waitForDeployment();
  const sttAddress = await sttToken.getAddress();
  console.log("STT Token deployed to:", sttAddress);
  
  // Deploy GameFi Contract
  const MineEscapeGameFi = await hre.ethers.getContractFactory("MineEscapeGameFi");
  const gamefi = await MineEscapeGameFi.deploy(sttAddress);
  await gamefi.waitForDeployment();
  const gamefiAddress = await gamefi.getAddress();
  console.log("GameFi Contract deployed to:", gamefiAddress);
  
  // Fund the contract
  const [deployer] = await hre.ethers.getSigners();
  console.log("Funding contract from:", deployer.address);
  
  // Get some tokens from faucet first
  const faucetTx = await sttToken.faucet();
  await faucetTx.wait();
  console.log("Got tokens from faucet");
  
  // Transfer tokens to contract
  const transferAmount = hre.ethers.parseEther("10000");
  const transferTx = await sttToken.transfer(gamefiAddress, transferAmount);
  await transferTx.wait();
  console.log("Transferred 10,000 STT to GameFi contract");
  
  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("STT Token:", sttAddress);
  console.log("GameFi Contract:", gamefiAddress);
  
  // Test basic functionality
  console.log("\nTesting basic functionality...");
  const balance = await sttToken.balanceOf(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "STT");
  
  const contractBalance = await sttToken.balanceOf(gamefiAddress);
  console.log("Contract balance:", hre.ethers.formatEther(contractBalance), "STT");
  
  // Test leaderboard
  const leaderboard = await gamefi.getLeaderboard();
  console.log("Leaderboard entries:", leaderboard.length);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});