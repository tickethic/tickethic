// Adresses des contrats déployés sur Polygon Amoy
export const CONTRACT_ADDRESSES = {
  // Contrats principaux
  ARTIST: '0xE1C58Db7162b2B32b05d7cd549C017D1EF439ECf',
  ORGANIZATOR: '0xA8D1c6e15058b7D984a8e5CF3b47cB227724339A',
  TICKET: '0xf2566f305eb91798CD9952adb4683433F49B9300',
  EVENT: '0xf9f621310b6E8fce37307155647C1d5bfa54F0D4',
  
  // Nouveaux contrats avec tokens
  TICKETHIC_COIN: '0x...', // À remplacer après déploiement
  EVENT_MANAGER: '0x...',  // À remplacer après déploiement
} as const;

// ABI des contrats (extraits des contrats déployés)
export const CONTRACT_ABIS = {
  ARTIST: [
    'function mintArtist(address to, string artistName, string artistMetadataURI) returns (uint256)',
    'function getArtistInfo(uint256 artistId) returns (string name, string metadataURI)',
    'function ownerOf(uint256 tokenId) returns (address)',
  ],
  EVENT: [
    'function buyTicket() payable',
    'function checkIn(uint256 tokenId)',
    'function isValid(uint256 tokenId) returns (bool)',
    'function getArtistIds() returns (uint256[])',
    'function addVerificator(address verificator)',
    'function removeVerificator(address verificator)',
  ],
  TICKET: [
    'function mintTicket(address to, string memory metadataURI) returns (uint256)',
    'function ownerOf(uint256 tokenId) returns (address)',
    'function balanceOf(address owner) returns (uint256)',
  ],
  ORGANIZATOR: [
    'function isOrganizator(address account) returns (bool)',
    'function addOrganizator(address newOrganizator)',
    'function removeOrganizator(address organizator)',
  ],
  TICKETHIC_COIN: [
    'function balanceOf(address account) returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function getRewardPoolBalance() returns (uint256)',
    'function getFoundersMultisig() returns (address)',
    'function isFoundersMultisig(address _address) returns (bool)',
  ],
  EVENT_MANAGER: [
    'function createEvent(uint256[] _artistIds, uint256[] _artistShares, address _organizer, uint256 _date, string _metadataURI, uint256 _ticketPrice, uint256 _totalTickets) returns (uint256 eventId, address eventAddress)',
    'function getEventAddress(uint256 _eventId) returns (address)',
    'function getTotalEvents() returns (uint256)',
    'function getEventInfo(uint256 _eventId) returns (address eventAddress, address organizer, uint256 date, uint256 ticketPrice, uint256 totalTickets, uint256 soldTickets)',
  ],
} as const;

// Configuration du réseau
export const NETWORK_CONFIG = {
  CHAIN_ID: 80002, // Polygon Amoy
  CHAIN_NAME: 'Polygon Amoy',
  RPC_URL: 'https://rpc-amoy.polygon.technology',
} as const;
