import { ethers } from "hardhat";
import fs from 'fs';
import path from 'path';

async function main() {
  console.log("🚀 Starting Tickethic deployment with EventManager...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

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

  // Deploy Event contract with sample data
  console.log("\n📅 Deploying sample Event contract...");
  const Event = await ethers.getContractFactory("Event");
  const artistIds = [1, 2, 3]; // These will be minted after deployment
  const artistShares = [40, 30, 20]; // 90% to artists, 10% to organizer
  const eventDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
  const metadataURI = "ipfs://event-metadata";
  const ticketPrice = ethers.parseEther("1"); // 1 ETH
  const totalTickets = 100;

  const event = await Event.deploy(
    artistAddress,
    artistIds,
    artistShares,
    deployer.address, // organizer
    eventDate,
    metadataURI,
    ticketPrice,
    totalTickets,
    ticketAddress,
    organizatorAddress
  );
  await event.waitForDeployment();
  const eventAddress = await event.getAddress();
  console.log("✅ Event deployed to:", eventAddress);

  // Deploy EventManager
  console.log("\n📋 Deploying EventManager...");
  const EventManager = await ethers.getContractFactory("EventManager");
  const eventManager = await EventManager.deploy(
    artistAddress,
    ticketAddress,
    organizatorAddress
  );
  await eventManager.waitForDeployment();
  const eventManagerAddress = await eventManager.getAddress();
  console.log("✅ EventManager deployed to:", eventManagerAddress);

  // Get network info
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  // Prepare deployment data
  const deploymentData = {
    networks: {
      [chainId]: {
        chainId: chainId,
        name: network.name || `Chain ${chainId}`,
        contracts: {
          Artist: artistAddress,
          Ticket: ticketAddress,
          Organizator: organizatorAddress,
          Event: eventAddress,
          EventManager: eventManagerAddress
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
  const addressesPath = path.resolve(__dirname, '../contract-addresses.json');
  fs.writeFileSync(addressesPath, JSON.stringify(deploymentData, null, 2));
  console.log("\n💾 Contract addresses saved to:", addressesPath);

  // Display summary
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract addresses:");
  console.log("  Artist:", artistAddress);
  console.log("  Ticket:", ticketAddress);
  console.log("  Organizator:", organizatorAddress);
  console.log("  Event:", eventAddress);
  console.log("  EventManager:", eventManagerAddress);

  console.log("\n🔗 Network:", network.name, `(Chain ID: ${chainId})`);
  console.log("👤 Deployer:", deployer.address);

  console.log("\n✅ All contracts deployed and configured successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
