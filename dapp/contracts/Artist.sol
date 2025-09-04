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
}