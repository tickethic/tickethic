// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Artist.sol";
import "./Ticket.sol";
import "./Organizator.sol";
import "./EventWithRewards.sol";
import "./TickethicCoin.sol";

contract EventManager {
    Artist public artistContract;
    Ticket public ticketContract;
    Organizator public organizatorContract;
    TickethicCoin public tickethicCoin;
    
    // Mapping to store created events
    mapping(uint256 => address) public events;
    uint256 public nextEventId = 1;
    
    // Events
    event EventCreated(uint256 indexed eventId, address indexed eventAddress, address indexed organizer);
    
    constructor(
        address _artistContract,
        address _ticketContract,
        address _organizatorContract,
        address _tickethicCoin
    ) {
        artistContract = Artist(_artistContract);
        ticketContract = Ticket(_ticketContract);
        organizatorContract = Organizator(_organizatorContract);
        tickethicCoin = TickethicCoin(_tickethicCoin);
    }
    
    /**
     * @dev Create a new event
     * @param _artistIds IDs of artists participating in the event
     * @param _artistShares Revenue shares for each artist (in %)
     * @param _organizer Organizer address
     * @param _date Event date timestamp
     * @param _metadataURI Event metadata URI
     * @param _ticketPrice Ticket price in wei
     * @param _totalTickets Total number of tickets available
     * @return eventId ID of the newly created event
     * @return eventAddress Address of the deployed Event contract
     */
    function createEvent(
        uint256[] memory _artistIds,
        uint256[] memory _artistShares,
        address _organizer,
        uint256 _date,
        string memory _metadataURI,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) external returns (uint256 eventId, address eventAddress) {
        // Validations
        require(_artistIds.length == _artistShares.length, "Artists and shares length mismatch");
        require(_artistIds.length > 0, "At least one artist required");
        require(organizatorContract.isOrganizator(_organizer), "Organizer not registered");
        require(_date > block.timestamp, "Event date must be in the future");
        require(_ticketPrice > 0, "Ticket price must be greater than 0");
        require(_totalTickets > 0, "Total tickets must be greater than 0");
        
        // Verify that the sum of shares does not exceed 100%
        uint256 totalShare = 0;
        for (uint256 i = 0; i < _artistShares.length; i++) {
            totalShare += _artistShares[i];
        }
        require(totalShare <= 100, "Total artist share > 100");
        
        // Verify that all artists exist
        for (uint256 i = 0; i < _artistIds.length; i++) {
            try artistContract.ownerOf(_artistIds[i]) returns (address) {
                // Artist exists
            } catch {
                revert("Artist does not exist");
            }
        }
        
        // Create the new event with rewards
        EventWithRewards newEvent = new EventWithRewards(
            address(artistContract),
            _artistIds,
            _artistShares,
            _organizer,
            _date,
            _metadataURI,
            _ticketPrice,
            _totalTickets,
            address(ticketContract),
            address(organizatorContract),
            address(tickethicCoin)
        );
        
        // Store the event
        eventId = nextEventId++;
        events[eventId] = address(newEvent);
        
        // Emit the event
        emit EventCreated(eventId, address(newEvent), _organizer);
        
        return (eventId, address(newEvent));
    }
    
    /**
     * @dev Get event address by ID
     */
    function getEventAddress(uint256 _eventId) external view returns (address) {
        return events[_eventId];
    }
    
    /**
     * @dev Get total number of created events
     */
    function getTotalEvents() external view returns (uint256) {
        return nextEventId - 1;
    }
    
    /**
     * @dev Get event information
     */
    function getEventInfo(uint256 _eventId) external view returns (
        address eventAddress,
        address organizer,
        uint256 date,
        uint256 ticketPrice,
        uint256 totalTickets,
        uint256 soldTickets
    ) {
        require(events[_eventId] != address(0), "Event does not exist");
        
        EventWithRewards eventContract = EventWithRewards(events[_eventId]);
        return (
            events[_eventId],
            eventContract.organizer(),
            eventContract.date(),
            eventContract.ticketPrice(),
            eventContract.totalTickets(),
            eventContract.soldTickets()
        );
    }
}
