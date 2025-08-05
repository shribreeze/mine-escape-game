const hre = require("hardhat");

async function main() {
  const sttAddress = "0x0581BA6e11Ac0AEE20ED0608F4881F5c847cd16A";
  const gamefiAddress = "0x3d9b10A4AF4f055Bcc112528d77e6f80d490973f";
  
  console.log("Verifying contract deployments...");
  
  try {
    // Test STT Token
    const STTToken = await hre.ethers.getContractFactory("STTToken");
    const sttToken = STTToken.attach(sttAddress);
    
    const [signer] = await hre.ethers.getSigners();
    console.log("Testing with address:", signer.address);
    
    // Check STT balance
    const balance = await sttToken.balanceOf(signer.address);
    console.log("STT Balance:", hre.ethers.formatEther(balance));
    
    // Test GameFi Contract
    const MineEscapeGameFi = await hre.ethers.getContractFactory("MineEscapeGameFi");
    const gamefi = MineEscapeGameFi.attach(gamefiAddress);
    
    // Check level costs
    const level1Cost = await gamefi.getLevelCost(1);
    console.log("Level 1 Cost:", hre.ethers.formatEther(level1Cost), "STT");
    
    // Check game session
    const session = await gamefi.getGameSession(signer.address);
    console.log("Game Session:", session);
    
    console.log("✅ All contracts working properly!");
    
  } catch (error) {
    console.error("❌ Contract verification failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});