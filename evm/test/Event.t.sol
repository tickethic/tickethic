// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/Event.sol";
import "../contracts/Artist.sol";
import "../contracts/Ticket.sol";
import "../contracts/Organizator.sol";

contract EventTest is Test {
    Event private eventContract;
    Artist private artistContract;
    Ticket private ticketContract;
    Organizator private organizatorContract;

    address owner = address(this);
    address organizer = address(0xB1);
    address buyer = address(0xC1);

    address artist1 = address(0xA1);
    address artist2 = address(0xA2);
    address artist3 = address(0xA3);

    uint256 ticketPrice = 1 ether;
    uint256 totalTickets = 2;

    uint256[] artistIds;
    uint256[] artistShares;

    function setUp() public {
        // Deploy Artist and Ticket contracts
        artistContract = new Artist();
        ticketContract = new Ticket(address(this));

        // Mint 3 artists
        uint256 id1 = artistContract.mintArtist(artist1, "Artist1", "ipfs://artist1");
        uint256 id2 = artistContract.mintArtist(artist2, "Artist2", "ipfs://artist2");
        uint256 id3 = artistContract.mintArtist(artist3, "Artist3", "ipfs://artist3");

        artistIds = [id1, id2, id3];
        artistShares = [40, 30, 20]; // 90% to artists, 10% to organizer

        // Deploy Organizator contract and add organizer
        address[] memory initialOrganizators = new address[](1);
        initialOrganizators[0] = organizer;
        organizatorContract = new Organizator(owner, initialOrganizators);

        // Deploy Event contract
        eventContract = new Event(
            address(artistContract),
            artistIds,
            artistShares,
            organizer,
            block.timestamp + 1 days,
            "ipfs://metadata",
            ticketPrice,
            totalTickets,
            address(ticketContract),
            address(organizatorContract)
        );

        // Make Event contract the owner of Ticket contract for minting
        ticketContract.transferOwnership(address(eventContract));

        // Fund buyer with ETH
        vm.deal(buyer, 10 ether);
    }

    function testBuyTicketAndSplitPayment() public {
        uint256 a1Before = artist1.balance;
        uint256 a2Before = artist2.balance;
        uint256 a3Before = artist3.balance;
        uint256 orgBefore = organizer.balance;

        vm.prank(buyer);
        eventContract.buyTicket{value: ticketPrice}();

        assertEq(ticketContract.balanceOf(buyer), 1, "Buyer should own 1 ticket");

        uint256 a1After = artist1.balance;
        uint256 a2After = artist2.balance;
        uint256 a3After = artist3.balance;
        uint256 orgAfter = organizer.balance;

        assertEq(a1After - a1Before, (ticketPrice * 40) / 100, "Artist1 should get 40%");
        assertEq(a2After - a2Before, (ticketPrice * 30) / 100, "Artist2 should get 30%");
        assertEq(a3After - a3Before, (ticketPrice * 20) / 100, "Artist3 should get 20%");
        assertEq(orgAfter - orgBefore, (ticketPrice * 10) / 100, "Organizer should get 10%");
    }

    function testCheckInOnceOnly() public {
        vm.prank(buyer);
        eventContract.buyTicket{value: ticketPrice}();

        // Only organizer can check in
        vm.expectRevert("Only organizer can check in");
        vm.prank(buyer);
        eventContract.checkIn(1);

        // Organizer checks in
        vm.prank(organizer);
        eventContract.checkIn(1);
        assertTrue(eventContract.usedTickets(1), "Ticket should be marked as used");

        // Cannot check in twice
        vm.expectRevert("Already used");
        vm.prank(organizer);
        eventContract.checkIn(1);
    }

    function testCannotExceedTotalTickets() public {
        vm.prank(buyer);
        eventContract.buyTicket{value: ticketPrice}();

        vm.prank(buyer);
        eventContract.buyTicket{value: ticketPrice}();

        // All tickets sold out
        vm.expectRevert("Sold out");
        vm.prank(buyer);
        eventContract.buyTicket{value: ticketPrice}();
    }
}