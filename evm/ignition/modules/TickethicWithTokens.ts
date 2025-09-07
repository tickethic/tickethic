import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TickethicWithTokensModule = buildModule("TickethicWithTokensModule", (m) => {
  const deployer = m.getAccount(0);
  
  // For now, use deployer as founders multisig (can be updated later)
  // In production, replace with actual multisig wallet address
  const foundersMultisig = deployer; // TODO: Replace with actual multisig address

  // Deploy TickethicCoin with founders multisig
  const tickethicCoin = m.contract("TickethicCoin", [foundersMultisig]);

  // Deploy RewardConfig
  const initialBuyerReward = 10n * 10n**18n; // 10 TTC
  const initialArtistReward = 5n * 10n**18n;  // 5 TTC
  const initialOrganizerReward = 5n * 10n**18n; // 5 TTC
  const initialValidatorReward = 2n * 10n**18n; // 2 TTC
  const rewardConfig = m.contract("RewardConfig", [
    initialBuyerReward,
    initialArtistReward,
    initialOrganizerReward,
    initialValidatorReward
  ]);

  // Deploy Artist contract
  const artist = m.contract("Artist");

  // Deploy Ticket contract with deployer as initial owner
  const ticket = m.contract("Ticket", [deployer]);

  // Deploy Organizator contract with deployer as owner and initial organizers
  const initialOrganizers = [deployer];
  const organizator = m.contract("Organizator", [deployer, initialOrganizers]);

  // Deploy EventManager with all contracts
  const eventManager = m.contract("EventManager", [
    artist,
    ticket,
    organizator,
    tickethicCoin,
    rewardConfig
  ]);

  // Transfer ownership of Ticket to EventManager
  m.call(ticket, "transferOwnership", [eventManager]);

  return { 
    tickethicCoin, 
    rewardConfig,
    artist, 
    ticket, 
    organizator, 
    eventManager 
  };
});

export default TickethicWithTokensModule;
