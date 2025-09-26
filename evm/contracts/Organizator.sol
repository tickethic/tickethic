// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Organizator is ERC721URIStorage, Ownable {
    uint256 public nextOrganizatorId = 1;

    struct OrganizatorInfo {
        string name;
        string metadataURI;
    }

    mapping(uint256 => OrganizatorInfo) public organizatorInfos;
    mapping(address => bool) public hasMintedOrganizator;

    constructor() ERC721("Organizator", "ORGANIZATOR") Ownable(msg.sender) {}

    function mintOrganizator(
        string memory organizatorName,
        string memory organizatorMetadataURI
    ) external returns (uint256) {
        require(!hasMintedOrganizator[msg.sender], "Address has already minted an organizator");
        
        uint256 organizatorId = nextOrganizatorId++;
        _safeMint(msg.sender, organizatorId);
        _setTokenURI(organizatorId, organizatorMetadataURI);
        organizatorInfos[organizatorId] = OrganizatorInfo(organizatorName, organizatorMetadataURI);
        hasMintedOrganizator[msg.sender] = true;
        
        return organizatorId;
    }

    function getOrganizatorInfo(uint256 organizatorId) external view returns (string memory name, string memory metadataURI) {
        OrganizatorInfo storage info = organizatorInfos[organizatorId];
        return (info.name, info.metadataURI);
    }

    /**
     * @dev Get all organizator IDs that have been minted
     * @return Array of all organizator IDs
     */
    function getAllOrganizatorIds() external view returns (uint256[] memory) {
        uint256 totalOrganizators = nextOrganizatorId - 1;
        uint256[] memory allOrganizators = new uint256[](totalOrganizators);
        
        for (uint256 i = 1; i < nextOrganizatorId; i++) {
            allOrganizators[i - 1] = i;
        }
        
        return allOrganizators;
    }

    /**
     * @dev Get organizator name by ID
     * @param organizatorId The organizator ID
     * @return Organizator name
     */
    function getOrganizatorName(uint256 organizatorId) external view returns (string memory) {
        require(organizatorId > 0 && organizatorId < nextOrganizatorId, "Organizator does not exist");
        return organizatorInfos[organizatorId].name;
    }

    /**
     * @dev Get total number of organizators minted
     * @return Total number of organizators
     */
    function getTotalOrganizators() external view returns (uint256) {
        return nextOrganizatorId - 1;
    }

    /**
     * @dev Get organizator info by ID (name and owner address)
     * @param organizatorId The organizator ID
     * @return name Organizator name
     * @return owner Organizator owner address
     * @return metadataURI Organizator metadata URI
     */
    function getOrganizatorDetails(uint256 organizatorId) external view returns (string memory name, address owner, string memory metadataURI) {
        require(organizatorId > 0 && organizatorId < nextOrganizatorId, "Organizator does not exist");
        OrganizatorInfo storage info = organizatorInfos[organizatorId];
        return (info.name, ownerOf(organizatorId), info.metadataURI);
    }

    /**
     * @dev Check if an address has already minted an organizator
     * @param userAddress The address to check
     * @return True if the address has minted an organizator, false otherwise
     */
    function hasAddressMintedOrganizator(address userAddress) external view returns (bool) {
        return hasMintedOrganizator[userAddress];
    }

    /**
     * @dev Get the organizator ID owned by a specific address (if any)
     * @param userAddress The address to check
     * @return organizatorId The organizator ID owned by the address, or 0 if none
     */
    function getOrganizatorIdByAddress(address userAddress) external view returns (uint256) {
        if (!hasMintedOrganizator[userAddress]) {
            return 0;
        }
        
        // Find the organizator ID owned by this address
        for (uint256 i = 1; i < nextOrganizatorId; i++) {
            if (ownerOf(i) == userAddress) {
                return i;
            }
        }
        
        return 0;
    }

    /**
     * @dev Check if an address owns an organizator NFT (is an organizator)
     * @param userAddress The address to check
     * @return True if the address owns an organizator NFT, false otherwise
     */
    function isOrganizator(address userAddress) external view returns (bool) {
        return hasMintedOrganizator[userAddress];
    }
}