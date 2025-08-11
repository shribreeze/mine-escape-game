const hre = require("hardhat");

async function main() {
  const sttAddress = "0x629a3448E887a61c4eD8A85634bFF21aeB16EC3E";
  const gamefiAddress = "0xd37FbBB7105406b7ed9bD845F12EC4AA9066B33C";
  
  console.log("Testing cashout functionality...");
  
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = STTToken.attach(sttAddress);
  
  const MineEscapeGameFi = await hre.ethers.getContractFactory("MineEscapeGameFi");
  const gamefi = MineEscapeGameFi.attach(gamefiAddress);
  
  const [player] = await hre.ethers.getSigners();
  console.log("Testing with player:", player.address);
  
  // Get initial balance
  let balance = await sttToken.balanceOf(player.address);
  console.log("Initial balance:", hre.ethers.formatEther(balance), "STT");
  
  // Get tokens from faucet if needed
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
  console.log("Level 1 started");
  
  // Check game session
  let session = await gamefi.getGameSession(player.address);
  console.log("Game session:", {
    currentLevel: session.currentLevel.toString(),
    gemsCollected: session.gemsCollected.toString(),
    isActive: session.isActive,
    totalTokensSpent: hre.ethers.formatEther(session.totalTokensSpent)
  });
  
  // Test exit game with 15 gems (should get 1 STT)
  console.log("Testing exit game with 15 gems...");
  const exitTx = await gamefi.exitGame(15);
  await exitTx.wait();
  console.log("Exit game successful");
  
  // Check final balance
  const finalBalance = await sttToken.balanceOf(player.address);
  console.log("Final balance:", hre.ethers.formatEther(finalBalance), "STT");
  
  // Check leaderboard
  const leaderboard = await gamefi.getLeaderboard();
  console.log("Leaderboard entries:", leaderboard.length);
  if (leaderboard.length > 0) {
    console.log("Latest entry:", {
      player: leaderboard[leaderboard.length - 1].player,
      maxLevel: leaderboard[leaderboard.length - 1].maxLevel.toString(),
      totalGems: leaderboard[leaderboard.length - 1].totalGems.toString()
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});