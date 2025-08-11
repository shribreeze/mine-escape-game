const hre = require("hardhat");

async function main() {
  const sttAddress = "0xD646e62350cbd1dC9c5cB92CF4175115ca0D362a";
  const gamefiAddress = "0x9B4bF5712a81C8CA2e0575b3D1e1c9e632a3f777";
  
  console.log("Testing proportional rewards...");
  
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = STTToken.attach(sttAddress);
  
  const MineEscapeGameFi = await hre.ethers.getContractFactory("MineEscapeGameFi");
  const gamefi = MineEscapeGameFi.attach(gamefiAddress);
  
  const [player] = await hre.ethers.getSigners();
  console.log("Testing with player:", player.address);
  
  // Get initial balance
  let balance = await sttToken.balanceOf(player.address);
  console.log("Initial balance:", hre.ethers.formatEther(balance), "STT");
  
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
  
  // Start level 1
  console.log("Starting level 1...");
  const startTx = await gamefi.startLevel(1);
  await startTx.wait();
  
  // Test with 8 gems (Level 1 max)
  console.log("Testing exit with 8 gems...");
  const exitTx = await gamefi.exitGame(8);
  await exitTx.wait();
  
  // Check final balance
  const finalBalance = await sttToken.balanceOf(player.address);
  console.log("Final balance:", hre.ethers.formatEther(finalBalance), "STT");
  
  const earned = finalBalance - balance + hre.ethers.parseEther("0.1"); // Add back entry fee
  console.log("Net STT earned:", hre.ethers.formatEther(earned), "STT");
  console.log("Expected: 0.8 STT (8 gems / 10 = 0.8)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});