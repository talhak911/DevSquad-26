import { network } from "hardhat";
const { ethers } = await network.connect();

async function main() {
  const NFT = await ethers.getContractFactory("TalhaNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();

  console.log("TalhaNFT deployed to:", await nft.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
