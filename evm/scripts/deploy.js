const hre = require("hardhat");


async function main() {
const [deployer, manager] = await hre.ethers.getSigners();
console.log("Deploying with", deployer.address);


const Ticketing = await hre.ethers.getContractFactory("EventTicketing");
const ticket = await Ticketing.deploy("EventTickets","ETIX");
await ticket.deployed();
console.log("Ticketing deployed to", ticket.address);


// grant manager role to second account for convenience in tests
const EVENT_MANAGER = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EVENT_MANAGER"));
await ticket.connect(deployer).grantRole(EVENT_MANAGER, manager.address);
console.log("Granted EVENT_MANAGER to", manager.address);
}


main().catch((error) => {
console.error(error);
process.exitCode = 1;
});