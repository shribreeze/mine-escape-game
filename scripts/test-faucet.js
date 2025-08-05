const hre = require("hardhat");

async function main() {
  const sttAddress = "0x0581BA6e11Ac0AEE20ED0608F4881F5c847cd16A"; // Update after deployment
  
  console.log("Getting STT tokens from faucet...");
  
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = STTToken.attach(sttAddress);
  
  const [signer] = await hre.ethers.getSigners();
  console.log("Calling faucet for address:", signer.address);
  
  const tx = await sttToken.faucet();
  await tx.wait();
  
  const balance = await sttToken.balanceOf(signer.address);
  console.log("New STT balance:", hre.ethers.formatEther(balance), "STT");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});