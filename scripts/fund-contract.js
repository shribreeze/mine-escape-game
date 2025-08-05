const hre = require("hardhat");

async function main() {
  const sttAddress = "0xBC62C6a497F445Ae2FD9967270b5A0a4301DA3E8";
  const gamefiAddress = "0x3799325E764463655A27C4880E7A9Ee2bC7c5Fa9";
  
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