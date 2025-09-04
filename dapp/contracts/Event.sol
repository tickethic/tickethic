// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Event is ERC721URIStorage, Ownable {
    address public artist;
    address public organizer;
    uint256 public date;
    string public metadataURI;
    uint256 public ticketPrice;
    uint256 public totalTickets;
    uint256 public soldTickets;

    uint256 public artistShare;    // percentage (e.g. 70 means 70%)
    uint256 public organizerShare; // percentage (e.g. 30 means 30%)

    uint256 private nextTicketId = 1;

    mapping(uint256 => bool) public usedTickets; // track checked-in tickets

    constructor(
        address _artist,
        address _organizer,
        uint256 _date,
        string memory _metadataURI,
        uint256 _ticketPrice,
        uint256 _totalTickets,
        uint256 _artistShare
    ) ERC721("EventTicket", "TIX") Ownable(_organizer) {
        require(_artistShare <= 100, "Invalid share");
        artist = _artist;
        organizer = _organizer;
        date = _date;
        metadataURI = _metadataURI;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
        artistShare = _artistShare;
        organizerShare = 100 - _artistShare;
    }

    /// @notice Buy a ticket
    function buyTicket() external payable {
        require(block.timestamp < date, "Event already happened");
        require(soldTickets < totalTickets, "Sold out");
        require(msg.value == ticketPrice, "Incorrect ETH sent");

        uint256 tokenId = nextTicketId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        soldTickets++;

        // split payment
        uint256 artistAmount = (msg.value * artistShare) / 100;
        uint256 organizerAmount = msg.value - artistAmount;

        payable(artist).transfer(artistAmount);
        payable(organizer).transfer(organizerAmount);
    }

    /// @notice Mark a ticket as used (only organizer)
    function checkIn(uint256 tokenId) external {
        require(msg.sender == organizer, "Only organizer can check in");
        ownerOf(tokenId); // Check if ticket does exist
        require(!usedTickets[tokenId], "Already used");

        usedTickets[tokenId] = true;
    }

    /// @notice Verify if a ticket is valid and unused
    function isValid(uint256 tokenId) external view returns (bool) {
        return !usedTickets[tokenId];
    }
}
