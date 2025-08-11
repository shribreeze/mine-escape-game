const hre = require("hardhat");

async function main() {
  const sttAddress = "0x629a3448E887a61c4eD8A85634bFF21aeB16EC3E";
  const gamefiAddress = "0xd37FbBB7105406b7ed9bD845F12EC4AA9066B33C";
  
  console.log("Debugging game session issue...");
  
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = STTToken.attach(sttAddress);
  
  const MineEscapeGameFi = await hre.ethers.getContractFactory("MineEscapeGameFi");
  const gamefi = MineEscapeGameFi.attach(gamefiAddress);
  
  const [player] = await hre.ethers.getSigners();
  console.log("Player address:", player.address);
  
  // Check initial state
  let balance = await sttToken.balanceOf(player.address);
  console.log("Player balance:", hre.ethers.formatEther(balance), "STT");
  
  let session = await gamefi.getGameSession(player.address);
  console.log("Initial session:", {
    currentLevel: session.currentLevel.toString(),
    gemsCollected: session.gemsCollected.toString(),
    isActive: session.isActive,
    totalTokensSpent: hre.ethers.formatEther(session.totalTokensSpent)
  });
  
  // Get tokens if needed
  if (balance < hre.ethers.parseEther("1")) {
    console.log("Getting tokens from faucet...");
    const faucetTx = await sttToken.faucet();
    await faucetTx.wait();
    balance = await sttToken.balanceOf(player.address);
    console.log("Balance after faucet:", hre.ethers.formatEther(balance), "STT");
  }
  
  // Approve tokens
  console.log("Approving tokens...");
  const approveTx = await sttToken.approve(gamefiAddress, hre.ethers.parseEther("1000"));
  await approveTx.wait();
  console.log("Tokens approved");
  
  // Start level 1
  console.log("Starting level 1...");
  const startTx = await gamefi.startLevel(1);
  await startTx.wait();
  console.log("Level 1 started - Transaction hash:", startTx.hash);
  
  // Check session after starting
  session = await gamefi.getGameSession(player.address);
  console.log("Session after start:", {
    currentLevel: session.currentLevel.toString(),
    gemsCollected: session.gemsCollected.toString(),
    isActive: session.isActive,
    totalTokensSpent: hre.ethers.formatEther(session.totalTokensSpent)
  });
  
  if (!session.isActive) {
    console.log("❌ ERROR: Game session is not active after starting level!");
    return;
  }
  
  // Try to exit with 15 gems
  console.log("Attempting to exit with 15 gems...");
  try {
    const exitTx = await gamefi.exitGame(15);
    await exitTx.wait();
    console.log("✅ Exit successful - Transaction hash:", exitTx.hash);
    
    // Check final balance
    const finalBalance = await sttToken.balanceOf(player.address);
    console.log("Final balance:", hre.ethers.formatEther(finalBalance), "STT");
    
    // Check session after exit
    const finalSession = await gamefi.getGameSession(player.address);
    console.log("Final session:", {
      currentLevel: finalSession.currentLevel.toString(),
      gemsCollected: finalSession.gemsCollected.toString(),
      isActive: finalSession.isActive,
      totalTokensSpent: hre.ethers.formatEther(finalSession.totalTokensSpent)
    });
    
  } catch (error) {
    console.log("❌ Exit failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});