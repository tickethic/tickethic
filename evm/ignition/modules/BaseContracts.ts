import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BaseContractsModule = buildModule("BaseContractsModule", (m) => {
  // Deploy Artist contract
  const artist = m.contract("Artist");

  // Deploy Ticket contract with deployer as initial owner
  const ticket = m.contract("Ticket", [m.getAccount(0)]);

  // Deploy Organizator contract with deployer as owner and initial organizers
  const initialOrganizers = [m.getAccount(0)]; // Use the same account as deployer and organizer
  const organizator = m.contract("Organizator", [m.getAccount(0), initialOrganizers]);

  return { artist, ticket, organizator };
});

export default BaseContractsModule;
