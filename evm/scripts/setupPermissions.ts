import { ethers } from "hardhat";

async function main() {
  // Récupérer les adresses des contrats déployés
  // Remplacez ces adresses par celles de vos contrats déployés
  const TICKETHIC_COIN_ADDRESS = "0x..."; // Adresse du TickethicCoin
  const EVENT_MANAGER_ADDRESS = "0x..."; // Adresse de l'EventManager

  console.log("🔧 Setting up permissions...");

  // Get TickethicCoin contract
  const TickethicCoin = await ethers.getContractFactory("TickethicCoin");
  const tickethicCoin = TickethicCoin.attach(TICKETHIC_COIN_ADDRESS);

  // Get EventManager contract
  const EventManager = await ethers.getContractFactory("EventManager");
  const eventManager = EventManager.attach(EVENT_MANAGER_ADDRESS);

  // Check current owner
  const currentOwner = await tickethicCoin.owner();
  console.log("👤 Current TickethicCoin owner:", currentOwner);

  // Transfer ownership to EventManager so it can distribute rewards
  console.log("🔄 Transferring ownership to EventManager...");
  const transferTx = await tickethicCoin.transferOwnership(EVENT_MANAGER_ADDRESS);
  await transferTx.wait();
  console.log("✅ Ownership transferred successfully!");

  // Check new owner
  const newOwner = await tickethicCoin.owner();
  console.log("👤 New owner:", newOwner);

  // Check reward pool balance
  const rewardPoolBalance = await tickethicCoin.getRewardPoolBalance();
  console.log("💰 Reward pool balance:", ethers.formatEther(rewardPoolBalance), "TTC");

  console.log("🎉 Setup completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error during setup:", error);
    process.exit(1);
  });
