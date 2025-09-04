// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Organizator is Ownable {
    mapping(address => bool) public isOrganizator;

    event OrganizatorAdded(address indexed organizator);
    event OrganizatorRemoved(address indexed organizator);

    constructor(address initialOwner, address[] memory initialOrganizators) Ownable(initialOwner) {
        for (uint256 i = 0; i < initialOrganizators.length; i++) {
            isOrganizator[initialOrganizators[i]] = true;
            emit OrganizatorAdded(initialOrganizators[i]);
        }
    }

    function addOrganizator(address organizator) external onlyOwner {
        isOrganizator[organizator] = true;
        emit OrganizatorAdded(organizator);
    }

    function removeOrganizator(address organizator) external onlyOwner {
        isOrganizator[organizator] = false;
        emit OrganizatorRemoved(organizator);
    }
}