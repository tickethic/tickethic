// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TickethicCoin is ERC20, Ownable, ERC20Burnable {
    // Total supply: 1,000,000,000 tokens (1 billion)
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;
    
    // Token distribution
    uint256 public constant FOUNDERS_SHARE = 200_000_000 * 10**18; // 20% for founders
    uint256 public constant REWARD_POOL = 800_000_000 * 10**18;    // 80% for rewards
    
    // Multisig wallet for founders
    address public foundersMultisig;
    
    // Reward pool
    uint256 public rewardPoolBalance;
    
    // Events
    event FoundersMultisigUpdated(address indexed oldMultisig, address indexed newMultisig);
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    event RewardPoolRefilled(uint256 amount);
    
    constructor(
        address _foundersMultisig
    ) ERC20("TickethicCoin", "TTC") Ownable(msg.sender) {
        require(_foundersMultisig != address(0), "Invalid founders multisig address");
        
        foundersMultisig = _foundersMultisig;
        
        // Mint tokens for founders multisig (20%)
        _mint(foundersMultisig, FOUNDERS_SHARE);
        
        // Mint tokens for reward pool (80%)
        _mint(address(this), REWARD_POOL);
        rewardPoolBalance = REWARD_POOL;
        
        emit RewardPoolRefilled(REWARD_POOL);
    }
    
    /**
     * @dev Update founders multisig wallet (only owner)
     */
    function updateFoundersMultisig(address _newMultisig) external onlyOwner {
        require(_newMultisig != address(0), "Invalid multisig address");
        require(_newMultisig != foundersMultisig, "Same multisig address");
        
        address oldMultisig = foundersMultisig;
        foundersMultisig = _newMultisig;
        
        // Transfer all founder tokens to new multisig
        uint256 founderBalance = balanceOf(oldMultisig);
        if (founderBalance > 0) {
            _transfer(oldMultisig, _newMultisig, founderBalance);
        }
        
        emit FoundersMultisigUpdated(oldMultisig, _newMultisig);
    }
    
    /**
     * @dev Distribute rewards (only authorized contracts)
     */
    function distributeReward(
        address _recipient, 
        uint256 _amount, 
        string memory _reason
    ) external onlyOwner {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");
        require(_amount <= rewardPoolBalance, "Insufficient reward pool balance");
        require(_amount <= balanceOf(address(this)), "Insufficient contract balance");
        
        rewardPoolBalance -= _amount;
        _transfer(address(this), _recipient, _amount);
        
        emit RewardDistributed(_recipient, _amount, _reason);
    }
    
    /**
     * @dev Distribute multiple rewards
     */
    function distributeRewards(
        address[] memory _recipients,
        uint256[] memory _amounts,
        string memory _reason
    ) external onlyOwner {
        require(_recipients.length == _amounts.length, "Arrays length mismatch");
        require(_recipients.length > 0, "Empty arrays");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }
        
        require(totalAmount <= rewardPoolBalance, "Insufficient reward pool balance");
        require(totalAmount <= balanceOf(address(this)), "Insufficient contract balance");
        
        rewardPoolBalance -= totalAmount;
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "Invalid recipient");
            require(_amounts[i] > 0, "Amount must be greater than 0");
            
            _transfer(address(this), _recipients[i], _amounts[i]);
            emit RewardDistributed(_recipients[i], _amounts[i], _reason);
        }
    }
    
    /**
     * @dev Get reward pool balance
     */
    function getRewardPoolBalance() external view returns (uint256) {
        return rewardPoolBalance;
    }
    
    /**
     * @dev Get founders multisig address
     */
    function getFoundersMultisig() external view returns (address) {
        return foundersMultisig;
    }
    
    /**
     * @dev Check if an address is the founders multisig
     */
    function isFoundersMultisig(address _address) external view returns (bool) {
        return _address == foundersMultisig;
    }
}
