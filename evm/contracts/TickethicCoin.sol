// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TickethicCoin is ERC20, Ownable, ERC20Burnable {
    // Total supply: 1,000,000,000 tokens (1 billion)
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;
    
    // Token distribution
    uint256 public constant CREATORS_SHARE = 200_000_000 * 10**18; // 20% for creators
    uint256 public constant REWARD_POOL = 800_000_000 * 10**18;    // 80% for rewards
    
    // Creator addresses (to be defined during deployment)
    address[] public creators;
    mapping(address => bool) public isCreator;
    
    // Reward pool
    uint256 public rewardPoolBalance;
    
    // Events
    event CreatorAdded(address indexed creator);
    event CreatorRemoved(address indexed creator);
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    event RewardPoolRefilled(uint256 amount);
    
    constructor(
        address[] memory _creators
    ) ERC20("TickethicCoin", "TTC") Ownable(msg.sender) {
        require(_creators.length > 0, "At least one creator required");
        
        // Initialize creators
        for (uint256 i = 0; i < _creators.length; i++) {
            require(_creators[i] != address(0), "Invalid creator address");
            creators.push(_creators[i]);
            isCreator[_creators[i]] = true;
            emit CreatorAdded(_creators[i]);
        }
        
        // Mint tokens for creators (20%)
        uint256 creatorTokensPerAddress = CREATORS_SHARE / _creators.length;
        for (uint256 i = 0; i < _creators.length; i++) {
            _mint(_creators[i], creatorTokensPerAddress);
        }
        
        // Mint tokens for reward pool (80%)
        _mint(address(this), REWARD_POOL);
        rewardPoolBalance = REWARD_POOL;
        
        emit RewardPoolRefilled(REWARD_POOL);
    }
    
    /**
     * @dev Add a new creator (only owner)
     */
    function addCreator(address _creator) external onlyOwner {
        require(_creator != address(0), "Invalid creator address");
        require(!isCreator[_creator], "Already a creator");
        
        creators.push(_creator);
        isCreator[_creator] = true;
        
        // Distribute a share of creator tokens
        uint256 newCreatorTokens = CREATORS_SHARE / (creators.length + 1);
        uint256 tokensToRedistribute = newCreatorTokens;
        
        // Redistribute tokens among all creators
        for (uint256 i = 0; i < creators.length - 1; i++) {
            _transfer(creators[i], _creator, newCreatorTokens / creators.length);
            tokensToRedistribute -= newCreatorTokens / creators.length;
        }
        
        _mint(_creator, tokensToRedistribute);
        
        emit CreatorAdded(_creator);
    }
    
    /**
     * @dev Remove a creator (only owner)
     */
    function removeCreator(address _creator) external onlyOwner {
        require(isCreator[_creator], "Not a creator");
        require(creators.length > 1, "Cannot remove the last creator");
        
        isCreator[_creator] = false;
        
        // Remove from list
        for (uint256 i = 0; i < creators.length; i++) {
            if (creators[i] == _creator) {
                creators[i] = creators[creators.length - 1];
                creators.pop();
                break;
            }
        }
        
        // Burn tokens of removed creator
        uint256 creatorBalance = balanceOf(_creator);
        if (creatorBalance > 0) {
            _burn(_creator, creatorBalance);
        }
        
        emit CreatorRemoved(_creator);
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
     * @dev Get creators list
     */
    function getCreators() external view returns (address[] memory) {
        return creators;
    }
    
    /**
     * @dev Get creators count
     */
    function getCreatorsCount() external view returns (uint256) {
        return creators.length;
    }
    
    /**
     * @dev Check if an address is a creator
     */
    function checkIsCreator(address _address) external view returns (bool) {
        return isCreator[_address];
    }
}
