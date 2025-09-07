import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventManagerModule = buildModule("EventManagerModule", (m) => {
  // Utiliser les adresses des contrats déjà déployés
  // Remplacez ces adresses par celles de vos contrats déployés
  const artistAddress = "0xE1C58Db7162b2B32b05d7cd549C017D1EF439ECf";
  const ticketAddress = "0xf2566f305eb91798CD9952adb4683433F49B9300";
  const organizatorAddress = "0xA8D1c6e15058b7D984a8e5CF3b47cB227724339A";

  // Déployer l'EventManager
  const eventManager = m.contract("EventManager", [
    artistAddress,
    ticketAddress,
    organizatorAddress,
  ]);

  return { eventManager };
});

export default EventManagerModule;
