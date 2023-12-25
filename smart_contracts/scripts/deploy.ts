import { ethers } from "hardhat";

async function main() {
  const Transactions = await ethers.getContractFactory("Transactions");

  const transactions = await Transactions.deploy();

  await transactions.waitForDeployment();

  const contractAddress = await transactions.getAddress()

  console.log(
    `Transactions deployed to ${contractAddress}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
