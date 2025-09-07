// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardConfig is Ownable {
    // Structure pour stocker les montants de récompenses
    struct RewardAmounts {
        uint256 buyerReward;
        uint256 artistReward;
        uint256 organizerReward;
        uint256 validatorReward;
    }
    
    // Montants actuels des récompenses
    RewardAmounts public currentRewards;
    
    // Historique des changements
    mapping(uint256 => RewardAmounts) public rewardHistory;
    uint256 public historyCount;
    
    // Événements
    event RewardsUpdated(
        uint256 indexed version,
        uint256 buyerReward,
        uint256 artistReward,
        uint256 organizerReward,
        uint256 validatorReward
    );
    
    constructor() Ownable(msg.sender) {
        // Valeurs par défaut
        currentRewards = RewardAmounts({
            buyerReward: 10 * 10**18,    // 10 TTC
            artistReward: 5 * 10**18,    // 5 TTC
            organizerReward: 5 * 10**18, // 5 TTC
            validatorReward: 2 * 10**18  // 2 TTC
        });
        
        // Sauvegarder la version initiale
        rewardHistory[0] = currentRewards;
        historyCount = 1;
        
        emit RewardsUpdated(0, 10 * 10**18, 5 * 10**18, 5 * 10**18, 2 * 10**18);
    }
    
    /**
     * @dev Mettre à jour les montants de récompenses (seulement le owner)
     */
    function updateRewards(
        uint256 _buyerReward,
        uint256 _artistReward,
        uint256 _organizerReward,
        uint256 _validatorReward
    ) external onlyOwner {
        require(_buyerReward > 0, "Buyer reward must be greater than 0");
        require(_artistReward > 0, "Artist reward must be greater than 0");
        require(_organizerReward > 0, "Organizer reward must be greater than 0");
        require(_validatorReward > 0, "Validator reward must be greater than 0");
        
        // Mettre à jour les récompenses actuelles
        currentRewards = RewardAmounts({
            buyerReward: _buyerReward,
            artistReward: _artistReward,
            organizerReward: _organizerReward,
            validatorReward: _validatorReward
        });
        
        // Sauvegarder dans l'historique
        rewardHistory[historyCount] = currentRewards;
        historyCount++;
        
        emit RewardsUpdated(
            historyCount - 1,
            _buyerReward,
            _artistReward,
            _organizerReward,
            _validatorReward
        );
    }
    
    /**
     * @dev Récupérer les montants actuels
     */
    function getCurrentRewards() external view returns (
        uint256 buyerReward,
        uint256 artistReward,
        uint256 organizerReward,
        uint256 validatorReward
    ) {
        return (
            currentRewards.buyerReward,
            currentRewards.artistReward,
            currentRewards.organizerReward,
            currentRewards.validatorReward
        );
    }
    
    /**
     * @dev Récupérer l'historique des récompenses
     */
    function getRewardHistory(uint256 _version) external view returns (
        uint256 buyerReward,
        uint256 artistReward,
        uint256 organizerReward,
        uint256 validatorReward
    ) {
        require(_version < historyCount, "Version does not exist");
        RewardAmounts memory rewards = rewardHistory[_version];
        return (
            rewards.buyerReward,
            rewards.artistReward,
            rewards.organizerReward,
            rewards.validatorReward
        );
    }
    
    /**
     * @dev Récupérer le nombre total de versions
     */
    function getHistoryCount() external view returns (uint256) {
        return historyCount;
    }
    
    /**
     * @dev Calculer le coût total des récompenses pour un événement
     */
    function calculateTotalRewardsPerTicket(uint256 _artistCount) external view returns (uint256) {
        return currentRewards.buyerReward + 
               (currentRewards.artistReward * _artistCount) + 
               currentRewards.organizerReward;
    }
    
    /**
     * @dev Calculer le coût total des récompenses pour un événement complet
     */
    function calculateTotalRewardsForEvent(
        uint256 _ticketCount, 
        uint256 _artistCount
    ) external view returns (uint256) {
        uint256 rewardsPerTicket = this.calculateTotalRewardsPerTicket(_artistCount);
        return rewardsPerTicket * _ticketCount;
    }
}
