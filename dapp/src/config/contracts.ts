// Deployed contract addresses on Polygon Amoy
export const CONTRACT_ADDRESSES = {
  // Main contracts (updated after redeployment)
  ARTIST: '0x93E458156a0Ee3f186FbD3756b372eCc94603a7a',
  ORGANIZATOR: '0x7953AE167f8F87FA5485b8F6C47613239A95Bde3',
  TICKET: '0x3FB0863307fF2CAacC8F31DAdcFE4216cD055e41',
  EVENT: '0x73E5eca7D5C9f6B8B254Ed8C0ac9c296EBB9E01D',
  
  // EventManager contract
  EVENT_MANAGER: '0x7ab8BE1dE5740B4d27752944Bf92Bff510D0D363',
} as const;

// Contract ABIs (extracted from deployed contracts)
export const CONTRACT_ABIS = {
  ARTIST: [
    'function mintArtist(address to, string artistName, string artistMetadataURI) returns (uint256)',
    'function ownerOf(uint256 artistId) returns (address)',
    'function getArtistInfo(uint256 artistId) returns (string name, string metadataURI)',
    'function getAllArtistIds() returns (uint256[])',
    'function getArtistName(uint256 artistId) returns (string)',
    'function getTotalArtists() returns (uint256)',
    'function getArtistDetails(uint256 artistId) returns (string name, address owner, string metadataURI)',
  ],
  EVENT: [
    'function buyTicket() payable',
    'function checkIn(uint256 tokenId)',
    'function isValid(uint256 tokenId) view returns (bool)',
    'function organizer() view returns (address)',
    'function date() view returns (uint256)',
    'function ticketPrice() view returns (uint256)',
    'function totalTickets() view returns (uint256)',
    'function soldTickets() view returns (uint256)',
    'function getArtistIds() view returns (uint256[] memory)',
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
  EVENT_MANAGER: [
    'function createEvent(uint256[] _artistIds, uint256[] _artistShares, address _organizer, uint256 _date, string _metadataURI, uint256 _ticketPrice, uint256 _totalTickets) returns (uint256 eventId, address eventAddress)',
    'function getEventAddress(uint256 _eventId) returns (address)',
    'function getTotalEvents() returns (uint256)',
    'function getEventInfo(uint256 _eventId) returns (address eventAddress, address organizer, uint256 date, uint256 ticketPrice, uint256 totalTickets, uint256 soldTickets)',
    'function getAllEvents() returns (address[])',
  ],
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  CHAIN_ID: 80002, // Polygon Amoy
  CHAIN_NAME: 'Polygon Amoy',
};
