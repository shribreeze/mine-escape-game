const hre = require("hardhat");

async function main() {
  const sttAddress = "0x92dF9139676D2b6A18584bAE55cBA193eBC894CD";
  const gamefiAddress = "0xAE25b273a8d9e75F966F5943445C3d406bF6F31e";
  
  console.log("Testing contract deployment...");
  
  try {
    // Test if contracts exist
    const sttCode = await hre.ethers.provider.getCode(sttAddress);
    const gamefiCode = await hre.ethers.provider.getCode(gamefiAddress);
    
    console.log("STT Contract exists:", sttCode !== "0x");
    console.log("GameFi Contract exists:", gamefiCode !== "0x");
    
    if (sttCode === "0x" || gamefiCode === "0x") {
      console.log("Contracts not deployed properly. Redeploying...");
      return;
    }
    
    // Test basic contract calls
    const STTToken = await hre.ethers.getContractFactory("STTToken");
    const sttToken = STTToken.attach(sttAddress);
    
    const [signer] = await hre.ethers.getSigners();
    console.log("Testing with address:", signer.address);
    
    // Test faucet
    console.log("Calling faucet...");
    const faucetTx = await sttToken.faucet();
    await faucetTx.wait();
    console.log("Faucet called successfully");
    
    // Check balance
    const balance = await sttToken.balanceOf(signer.address);
    console.log("Your STT balance:", hre.ethers.formatEther(balance));
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});