// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/Event.sol";

contract EventTest is Test {
    Event private eventContract;
    address artist = address(0xA1);
    address organizer = address(0xB1);
    address buyer = address(0xC1);

    uint256 ticketPrice = 1 ether;
    uint256 totalTickets = 2;

    function setUp() public {
        // deploy event with 70/30 split
        eventContract = new Event(
            artist,
            organizer,
            block.timestamp + 1 days,
            "ipfs://metadata",
            ticketPrice,
            totalTickets,
            70 // artistShare
        );

        // fund buyer with ETH
        vm.deal(buyer, 10 ether);
    }

    function testBuyTicketAndSplitPayment() public {
        uint256 artistBalanceBefore = artist.balance;
        uint256 organizerBalanceBefore = organizer.balance;

        vm.prank(buyer);
        eventContract.buyTicket{value: ticketPrice}();

        assertEq(eventContract.balanceOf(buyer), 1, "Buyer should own 1 ticket");

        uint256 artistBalanceAfter = artist.balance;
        uint256 organizerBalanceAfter = organizer.balance;

        assertEq(artistBalanceAfter - artistBalanceBefore, (ticketPrice * 70) / 100, "Artist should get 70%");
        assertEq(organizerBalanceAfter - organizerBalanceBefore, (ticketPrice * 30) / 100, "Organizer should get 30%");
    }

    function testOnlyOrganizerCanCheckIn() public {
        vm.prank(buyer);
        eventContract.buyTicket{value: ticketPrice}();

        // buyer tries to check in -> should fail
        vm.expectRevert("Only organizer can check in");
        vm.prank(buyer);
        eventContract.checkIn(1);

        // organizer can check in
        vm.prank(organizer);
        eventContract.checkIn(1);

        assertTrue(eventContract.usedTickets(1), "Ticket should be marked as used");
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
