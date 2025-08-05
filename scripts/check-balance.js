const hre = require("hardhat");

async function main() {
  const sttAddress = "0x7089349Ff87fe87f7F6a61df9c8dF44bC3CBAA36";
  const gamefiAddress = "0xa29f36B65b787e99999C567731F1085008d0bdC9";
  
  console.log("Checking balances...");
  
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = STTToken.attach(sttAddress);
  
  const [signer] = await hre.ethers.getSigners();
  const playerAddress = signer.address;
  
  // Check player balance
  const playerBalance = await sttToken.balanceOf(playerAddress);
  console.log("Your STT balance:", hre.ethers.formatEther(playerBalance));
  
  // Check contract balance
  const contractBalance = await sttToken.balanceOf(gamefiAddress);
  console.log("Contract STT balance:", hre.ethers.formatEther(contractBalance));
  
  // Check game session
  const MineEscapeGameFi = await hre.ethers.getContractFactory("MineEscapeGameFi");
  const gamefi = MineEscapeGameFi.attach(gamefiAddress);
  
  const session = await gamefi.getGameSession(playerAddress);
  console.log("Game session:", {
    currentLevel: session.currentLevel.toString(),
    gemsCollected: session.gemsCollected.toString(),
    isActive: session.isActive,
    totalTokensSpent: hre.ethers.formatEther(session.totalTokensSpent)
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});