// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Artist.sol";
import "./Ticket.sol";
import "./Organizator.sol";

contract Event is Ownable {
    address public organizer;
    uint256 public date;
    string public metadataURI;
    uint256 public ticketPrice;
    uint256 public totalTickets;
    uint256 public soldTickets;

    mapping(uint256 => bool) public usedTickets;

    Artist public artistContract;
    uint256[] public artistIds;
    uint256[] public artistShares;
    uint256 public organizerShare;

    Ticket public ticketContract;

    Organizator public organizatorContract;

    // Verificators management
    mapping(address => bool) public verificators;
    event VerificatorAdded(address indexed verificator);
    event VerificatorRemoved(address indexed verificator);

    constructor(
        address _artistContract,
        uint256[] memory _artistIds,
        uint256[] memory _artistShares,
        address _organizer,
        uint256 _date,
        string memory _metadataURI,
        uint256 _ticketPrice,
        uint256 _totalTickets,
        address _ticketContract,
        address _organizatorContract
    ) Ownable(_organizer) {
        require(_artistIds.length == _artistShares.length, "Artists and shares length mismatch");
        uint256 totalShare = 0;
        for (uint256 i = 0; i < _artistShares.length; i++) {
            totalShare += _artistShares[i];
        }
        require(totalShare <= 100, "Total artist share > 100");

        organizatorContract = Organizator(_organizatorContract);
        require(organizatorContract.isOrganizator(_organizer), "Organizer not registered");

        artistContract = Artist(_artistContract);
        artistIds = _artistIds;
        artistShares = _artistShares;
        organizer = _organizer;
        date = _date;
        metadataURI = _metadataURI;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
        organizerShare = 100 - totalShare;
        ticketContract = Ticket(_ticketContract);
    // Optionally, organizer is a verificator by default
    verificators[_organizer] = true;
    }

    function buyTicket() external payable {
        require(block.timestamp < date, "Event already happened");
        require(soldTickets < totalTickets, "Sold out");
        require(msg.value == ticketPrice, "Incorrect ETH sent");

        uint256 tokenId = ticketContract.mintTicket(msg.sender, metadataURI);
        soldTickets++;

        // split payment among artists and organizer
        uint256 totalSent = 0;
        for (uint256 i = 0; i < artistIds.length; i++) {
            address artistOwner = artistContract.ownerOf(artistIds[i]);
            uint256 artistAmount = (msg.value * artistShares[i]) / 100;
            totalSent += artistAmount;
            payable(artistOwner).transfer(artistAmount);
        }
        uint256 organizerAmount = msg.value - totalSent;
        payable(organizer).transfer(organizerAmount);
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can manage verificators");
        _;
    }

    function addVerificator(address verificator) external onlyOrganizer {
        verificators[verificator] = true;
        emit VerificatorAdded(verificator);
    }

    function removeVerificator(address verificator) external onlyOrganizer {
        verificators[verificator] = false;
        emit VerificatorRemoved(verificator);
    }

    modifier onlyVerificator() {
        require(verificators[msg.sender], "Not a verificator");
        _;
    }

    function checkIn(uint256 tokenId) external onlyVerificator {
        require(!usedTickets[tokenId], "Already used");
        require(ticketContract.ownerOf(tokenId) != address(0), "Invalid ticket");
        usedTickets[tokenId] = true;
    }

    function isValid(uint256 tokenId) external view returns (bool) {
        return !usedTickets[tokenId];
    }

    function getArtistIds() external view returns (uint256[] memory) {
        return artistIds;
    }

    function getArtistShares() external view returns (uint256[] memory) {
        return artistShares;
    }
}