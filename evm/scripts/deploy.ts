import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1️⃣ Artist
  const Artist = await hre.ethers.getContractFactory("Artist");
  const artist = await Artist.deploy();
  await artist.deployed();
  console.log("✅ Artist deployed at:", artist.address);

  // 2️⃣ Ticket
  const Ticket = await hre.ethers.getContractFactory("Ticket");
  const ticket = await Ticket.deploy(deployer.address); // owner
  await ticket.deployed();
  console.log("✅ Ticket deployed at:", ticket.address);

  // 3️⃣ Organizator
  const Organizator = await hre.ethers.getContractFactory("Organizator");
  const organizator = await Organizator.deploy(deployer.address, [deployer.address]);
  await organizator.deployed();
  console.log("✅ Organizator deployed at:", organizator.address);

  // 4️⃣ Event
  const Event = await hre.ethers.getContractFactory("Event");
  const event = await Event.deploy(
    artist.address,          // artistContract
    [1,2,3],                 // artistIds
    [40,30,20],              // artistShares
    deployer.address,        // organizer
    Math.floor(Date.now() / 1000) + 86400, // timestamp +1 day
    "ipfs://metadata",       // metadata URI
    hre.ethers.parseEther("1"),  // ticketPrice 1 ETH
    2,                       // totalTickets
    ticket.address,          // ticketContract
    organizator.address      // organizatorContract
  );
  await event.deployed();
  console.log("✅ EventTicketing deployed at:", event.address);

  console.log("\n🎉 All contracts deployed successfully!");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
