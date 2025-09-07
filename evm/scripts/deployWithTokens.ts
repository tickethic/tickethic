import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting Tickethic deployment with tokens...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Deployment configuration
  const creators = [
    deployer.address, // Add your creator addresses here
    // "0x...", // Add more creators if needed
  ];

  console.log("📝 Creators:", creators);

  // Deploy TickethicCoin first
  console.log("\n🪙 Deploying TickethicCoin...");
  const TickethicCoin = await ethers.getContractFactory("TickethicCoin");
  const tickethicCoin = await TickethicCoin.deploy(creators);
  await tickethicCoin.waitForDeployment();
  const tickethicCoinAddress = await tickethicCoin.getAddress();
  console.log("✅ TickethicCoin deployed to:", tickethicCoinAddress);

  // Deploy RewardConfig
  console.log("\n⚙️ Deploying RewardConfig...");
  const RewardConfig = await ethers.getContractFactory("RewardConfig");
  const rewardConfig = await RewardConfig.deploy();
  await rewardConfig.waitForDeployment();
  const rewardConfigAddress = await rewardConfig.getAddress();
  console.log("✅ RewardConfig deployed to:", rewardConfigAddress);

  // Deploy Artist contract
  console.log("\n🎨 Deploying Artist contract...");
  const Artist = await ethers.getContractFactory("Artist");
  const artist = await Artist.deploy();
  await artist.waitForDeployment();
  const artistAddress = await artist.getAddress();
  console.log("✅ Artist deployed to:", artistAddress);

  // Deploy Ticket contract
  console.log("\n🎫 Deploying Ticket contract...");
  const Ticket = await ethers.getContractFactory("Ticket");
  const ticket = await Ticket.deploy(deployer.address);
  await ticket.waitForDeployment();
  const ticketAddress = await ticket.getAddress();
  console.log("✅ Ticket deployed to:", ticketAddress);

  // Deploy Organizator contract
  console.log("\n🏢 Deploying Organizator contract...");
  const Organizator = await ethers.getContractFactory("Organizator");
  const organizator = await Organizator.deploy(deployer.address, [deployer.address]);
  await organizator.waitForDeployment();
  const organizatorAddress = await organizator.getAddress();
  console.log("✅ Organizator deployed to:", organizatorAddress);

  // Deploy EventManager
  console.log("\n📅 Deploying EventManager...");
  const EventManager = await ethers.getContractFactory("EventManager");
  const eventManager = await EventManager.deploy(
    artistAddress,
    ticketAddress,
    organizatorAddress,
    tickethicCoinAddress
  );
  await eventManager.waitForDeployment();
  const eventManagerAddress = await eventManager.getAddress();
  console.log("✅ EventManager deployed to:", eventManagerAddress);

  // Transfer ownership of TickethicCoin to EventManager
  console.log("\n🔐 Transferring TickethicCoin ownership to EventManager...");
  const transferTx = await tickethicCoin.transferOwnership(eventManagerAddress);
  await transferTx.wait();
  console.log("✅ Ownership transferred successfully");

  // Get network info
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  // Prepare deployment data
  const deploymentData = {
    networks: {
      [chainId]: {
        chainId: chainId,
        name: network.name || `Chain ${chainId}`,
        rpcUrl: "", // Will be filled by user
        explorerUrl: "", // Will be filled by user
        contracts: {
          TickethicCoin: tickethicCoinAddress,
          Artist: artistAddress,
          Ticket: ticketAddress,
          Organizator: organizatorAddress,
          EventManager: eventManagerAddress,
          RewardConfig: rewardConfigAddress
        }
      }
    },
    deployment: {
      lastDeployed: new Date().toISOString(),
      deployer: deployer.address,
      version: "1.0.0"
    }
  };

  // Save deployment addresses
  const addressesFile = path.join(__dirname, "..", "contract-addresses.json");
  fs.writeFileSync(addressesFile, JSON.stringify(deploymentData, null, 2));
  console.log("\n💾 Contract addresses saved to:", addressesFile);

  // Display summary
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract addresses:");
  console.log("  TickethicCoin:", tickethicCoinAddress);
  console.log("  Artist:", artistAddress);
  console.log("  Ticket:", ticketAddress);
  console.log("  Organizator:", organizatorAddress);
  console.log("  EventManager:", eventManagerAddress);
  console.log("  RewardConfig:", rewardConfigAddress);

  console.log("\n🔗 Network:", network.name, `(Chain ID: ${chainId})`);
  console.log("👤 Deployer:", deployer.address);

  // Verify token balances
  console.log("\n💰 Token balances:");
  const rewardPoolBalance = await tickethicCoin.getRewardPoolBalance();
  console.log("  Reward Pool:", ethers.formatEther(rewardPoolBalance), "TTC");
  
  for (const creator of creators) {
    const balance = await tickethicCoin.balanceOf(creator);
    console.log(`  Creator ${creator}:`, ethers.formatEther(balance), "TTC");
  }

  console.log("\n✅ All contracts deployed and configured successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
