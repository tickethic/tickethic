// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Artist.sol";
import "./Ticket.sol";
import "./Organizator.sol";
import "./TickethicCoin.sol";
import "./RewardConfig.sol";

contract EventWithConfigurableRewards is Ownable {
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
    TickethicCoin public tickethicCoin;
    RewardConfig public rewardConfig;

    // Verificators management
    mapping(address => bool) public verificators;
    event VerificatorAdded(address indexed verificator);
    event VerificatorRemoved(address indexed verificator);

    // Événements pour les récompenses
    event BuyerRewarded(address indexed buyer, uint256 amount, uint256 ticketId);
    event ArtistRewarded(address indexed artist, uint256 amount, uint256 ticketId);
    event OrganizerRewarded(address indexed organizer, uint256 amount, uint256 ticketId);
    event ValidatorRewarded(address indexed validator, uint256 amount, uint256 ticketId);

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
        address _organizatorContract,
        address _tickethicCoin,
        address _rewardConfig
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
        tickethicCoin = TickethicCoin(_tickethicCoin);
        rewardConfig = RewardConfig(_rewardConfig);
        
        // Optionally, organizer is a verificator by default
        verificators[_organizer] = true;
    }

    function buyTicket() external payable {
        require(block.timestamp < date, "Event already happened");
        require(soldTickets < totalTickets, "Sold out");
        require(msg.value == ticketPrice, "Incorrect ETH sent");

        uint256 tokenId = ticketContract.mintTicket(msg.sender, metadataURI);
        soldTickets++;

        // Split payment among artists and organizer
        uint256 totalSent = 0;
        for (uint256 i = 0; i < artistIds.length; i++) {
            address artistOwner = artistContract.ownerOf(artistIds[i]);
            uint256 artistAmount = (msg.value * artistShares[i]) / 100;
            totalSent += artistAmount;
            payable(artistOwner).transfer(artistAmount);
        }
        uint256 organizerAmount = msg.value - totalSent;
        payable(organizer).transfer(organizerAmount);

        // Distribuer les récompenses en tokens (avec montants configurables)
        _distributeTicketRewards(msg.sender, tokenId);
    }

    function _distributeTicketRewards(address _buyer, uint256 _ticketId) internal {
        // Récupérer les montants actuels depuis RewardConfig
        (
            uint256 buyerReward,
            uint256 artistReward,
            uint256 organizerReward,
            uint256 validatorReward
        ) = rewardConfig.getCurrentRewards();

        // Récompenser l'acheteur
        try tickethicCoin.distributeReward(_buyer, buyerReward, "Ticket Purchase") {
            emit BuyerRewarded(_buyer, buyerReward, _ticketId);
        } catch {
            // Si la distribution échoue, on continue (pas de revert)
        }

        // Récompenser chaque artiste
        for (uint256 i = 0; i < artistIds.length; i++) {
            address artistOwner = artistContract.ownerOf(artistIds[i]);
            try tickethicCoin.distributeReward(artistOwner, artistReward, "Artist Participation") {
                emit ArtistRewarded(artistOwner, artistReward, _ticketId);
            } catch {
                // Si la distribution échoue, on continue
            }
        }

        // Récompenser l'organisateur
        try tickethicCoin.distributeReward(organizer, organizerReward, "Event Organization") {
            emit OrganizerRewarded(organizer, organizerReward, _ticketId);
        } catch {
            // Si la distribution échoue, on continue
        }
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

        // Récupérer le montant actuel de récompense pour les validateurs
        (,,, uint256 validatorReward) = rewardConfig.getCurrentRewards();

        // Récompenser le validateur
        try tickethicCoin.distributeReward(msg.sender, validatorReward, "Ticket Validation") {
            emit ValidatorRewarded(msg.sender, validatorReward, tokenId);
        } catch {
            // Si la distribution échoue, on continue (le check-in reste valide)
        }
    }

    function isValid(uint256 tokenId) external view returns (bool) {
        return !usedTickets[tokenId];
    }

    function getArtistIds() external view returns (uint256[] memory) {
        return artistIds;
    }

    // Fonctions pour récupérer les informations de récompenses (dynamiques)
    function getCurrentRewardAmounts() external view returns (
        uint256 buyerReward,
        uint256 artistReward,
        uint256 organizerReward,
        uint256 validatorReward
    ) {
        return rewardConfig.getCurrentRewards();
    }

    function getTotalRewardsPerTicket() external view returns (uint256) {
        return rewardConfig.calculateTotalRewardsPerTicket(artistIds.length);
    }

    function getEstimatedTotalRewards() external view returns (uint256) {
        return rewardConfig.calculateTotalRewardsForEvent(totalTickets, artistIds.length);
    }

    // Fonction pour récupérer l'adresse du contrat de configuration
    function getRewardConfigAddress() external view returns (address) {
        return address(rewardConfig);
    }
}
