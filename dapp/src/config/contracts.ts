// Deployed contract addresses on Polygon Amoy
export const CONTRACT_ADDRESSES = {
  // Main contracts (updated after redeployment with new Artist contract)
  ARTIST: '0xC3dA080Ecf60d29f50eB838519e068eB15Cd573f',
  ORGANIZATOR: '0xB3A3D8164c1Fe87F7E9771f87eb1BFc074c2d06e',
  TICKET: '0x7DA7651cF179792985728151c9B336d966810Ae5',
  EVENT: '0x65B96123e53081D16F3405C4Db54a0b5fc492f4A',
  
  // EventManager contract
  EVENT_MANAGER: '0xb566702544055969Ef08983F745Faf092F2f1976',
} as const;

// Contract ABIs (extracted from deployed contracts)
export const CONTRACT_ABIS = {
  ARTIST: [
    'function mintArtist(string artistName, string artistMetadataURI) returns (uint256)',
    'function ownerOf(uint256 artistId) returns (address)',
    'function getArtistInfo(uint256 artistId) returns (string name, string metadataURI)',
    'function getAllArtistIds() returns (uint256[])',
    'function getArtistName(uint256 artistId) returns (string)',
    'function getTotalArtists() returns (uint256)',
    'function getArtistDetails(uint256 artistId) returns (string name, address owner, string metadataURI)',
    'function hasAddressMintedArtist(address userAddress) returns (bool)',
    'function getArtistIdByAddress(address userAddress) returns (uint256)',
    'function hasMintedArtist(address) returns (bool)',
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
