const hre = require("hardhat");

async function main() {
  const Lock = await hre.ethers.getContractFactory("EcoMint");
  const lock = await Lock.deploy();

  await lock.waitForDeployment();

  console.log(`Contract Address: ${lock.target}`);
  console.log(lock);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
