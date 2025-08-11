const hre = require("hardhat");

async function main() {
  const sttAddress = "0x3Fb2a6c13FB63f9F2e56Cc8C382B347267d59943";
  const gamefiAddress = "0x9A7cA818Ac5b1D2e0168648Ff12223b8caCd34fd";
  
  console.log("Funding GameFi contract with STT tokens...");
  
  const STTToken = await hre.ethers.getContractFactory("STTToken");
  const sttToken = STTToken.attach(sttAddress);
  
  const [signer] = await hre.ethers.getSigners();
  console.log("Funding from address:", signer.address);
  
  // Transfer 10,000 STT to the GameFi contract for payouts
  const fundAmount = hre.ethers.parseEther("10000");
  const tx = await sttToken.transfer(gamefiAddress, fundAmount);
  await tx.wait();
  
  console.log("✅ Transferred 10,000 STT to GameFi contract");
  
  // Check contract balance
  const contractBalance = await sttToken.balanceOf(gamefiAddress);
  console.log("GameFi contract STT balance:", hre.ethers.formatEther(contractBalance));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});