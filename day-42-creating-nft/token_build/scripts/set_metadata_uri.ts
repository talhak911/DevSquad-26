import { network } from "hardhat";
const { ethers } = await network.connect();
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractAddress = "0x857952A2554D2A945541a1a5D3c9bB480dE54CC4";
  const newBaseURI = "ipfs://Qma6spzrSDUrspz7Cw8oUY6awh9hBRi9nSF9TWszttrV26/";

  console.log("Connecting to contract...");
  const MyNFT = await ethers.getContractAt("TalhaNFT", contractAddress);

  console.log(`Setting baseURI to: ${newBaseURI}...`);
  const tx1 = await MyNFT.setBaseURI(newBaseURI);
  console.log(`Transaction sent: ${tx1.hash}. Waiting for confirmation...`);
  await tx1.wait();
  console.log("baseURI set successfully!");

  console.log("Setting revealed status to true...");
  const tx2 = await MyNFT.setRevealed(true);
  console.log(`Transaction sent: ${tx2.hash}. Waiting for confirmation...`);
  await tx2.wait();
  console.log("Revealed status set successfully!");

  console.log("All setup successfully finalized!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
