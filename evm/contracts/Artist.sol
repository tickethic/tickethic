// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Artist is ERC721URIStorage, Ownable {
    uint256 public nextArtistId = 1;

    struct ArtistInfo {
        string name;
        string metadataURI;
    }

    mapping(uint256 => ArtistInfo) public artistInfos;

    constructor() ERC721("Artist", "ARTIST") Ownable(msg.sender) {}

    function mintArtist(
        address to,
        string memory artistName,
        string memory artistMetadataURI
    ) external onlyOwner returns (uint256) {
        uint256 artistId = nextArtistId++;
        _safeMint(to, artistId);
        _setTokenURI(artistId, artistMetadataURI);
        artistInfos[artistId] = ArtistInfo(artistName, artistMetadataURI);
        return artistId;
    }

    function getArtistInfo(uint256 artistId) external view returns (string memory name, string memory metadataURI) {
        ArtistInfo storage info = artistInfos[artistId];
        return (info.name, info.metadataURI);
    }

    /**
     * @dev Get all artist IDs that have been minted
     * @return Array of all artist IDs
     */
    function getAllArtistIds() external view returns (uint256[] memory) {
        uint256 totalArtists = nextArtistId - 1;
        uint256[] memory allArtists = new uint256[](totalArtists);
        
        for (uint256 i = 1; i < nextArtistId; i++) {
            allArtists[i - 1] = i;
        }
        
        return allArtists;
    }

    /**
     * @dev Get artist name by ID
     * @param artistId The artist ID
     * @return Artist name
     */
    function getArtistName(uint256 artistId) external view returns (string memory) {
        require(artistId > 0 && artistId < nextArtistId, "Artist does not exist");
        return artistInfos[artistId].name;
    }

    /**
     * @dev Get total number of artists minted
     * @return Total number of artists
     */
    function getTotalArtists() external view returns (uint256) {
        return nextArtistId - 1;
    }

    /**
     * @dev Get artist info by ID (name and owner address)
     * @param artistId The artist ID
     * @return name Artist name
     * @return owner Artist owner address
     * @return metadataURI Artist metadata URI
     */
    function getArtistDetails(uint256 artistId) external view returns (string memory name, address owner, string memory metadataURI) {
        require(artistId > 0 && artistId < nextArtistId, "Artist does not exist");
        ArtistInfo storage info = artistInfos[artistId];
        return (info.name, ownerOf(artistId), info.metadataURI);
    }
}