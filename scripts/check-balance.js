const hre = require("hardhat");

async function main() {
  const sttAddress = "0xD66B19387aDBB2ccCD941739001227Ce18E87D62";
  const gamefiAddress = "0x719A228501606Af476BeC289902d42817C4871Bc";
  
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