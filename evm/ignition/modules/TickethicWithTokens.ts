import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TickethicWithTokensModule = buildModule("TickethicWithTokensModule", (m) => {
  // Déployer le contrat TickethicCoin en premier
  // Remplacez ces adresses par les vôtres (créateurs de la plateforme)
  const creators = [
    m.getAccount(0), // Premier compte (déployeur)
    // Ajoutez d'autres adresses de créateurs si nécessaire
    // "0x...", // Adresse du créateur 2
    // "0x...", // Adresse du créateur 3
  ];

  const tickethicCoin = m.contract("TickethicCoin", [creators]);

  // Déployer Artist contract
  const artist = m.contract("Artist");

  // Déployer Ticket contract avec deployer comme initial owner
  const ticket = m.contract("Ticket", [m.getAccount(0)]);

  // Déployer Organizator contract avec deployer comme owner et initial organizers
  const initialOrganizers = [m.getAccount(0)]; // Use the same account as deployer and organizer
  const organizator = m.contract("Organizator", [m.getAccount(0), initialOrganizers]);

  // Déployer EventManager avec tous les contrats
  const eventManager = m.contract("EventManager", [
    artist,
    ticket,
    organizator,
    tickethicCoin,
  ]);

  // Donner les permissions à l'EventManager pour distribuer les récompenses
  // Note: L'EventManager doit être ajouté comme owner du TickethicCoin
  // Cela se fait via une transaction séparée après le déploiement

  return { 
    tickethicCoin, 
    artist, 
    ticket, 
    organizator, 
    eventManager 
  };
});

export default TickethicWithTokensModule;
