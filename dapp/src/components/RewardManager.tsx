'use client'
import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { parseAbi } from 'viem'
import React, { useState } from 'react'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/config/contracts'

// ABI pour RewardConfig
const REWARD_CONFIG_ABI = parseAbi([
  'function updateRewards(uint256 _buyerReward, uint256 _artistReward, uint256 _organizerReward, uint256 _validatorReward)',
  'function getCurrentRewards() returns (uint256 buyerReward, uint256 artistReward, uint256 organizerReward, uint256 validatorReward)',
  'function getRewardHistory(uint256 _version) returns (uint256 buyerReward, uint256 artistReward, uint256 organizerReward, uint256 validatorReward)',
  'function getHistoryCount() returns (uint256)',
  'function calculateTotalRewardsPerTicket(uint256 _artistCount) returns (uint256)',
  'function calculateTotalRewardsForEvent(uint256 _ticketCount, uint256 _artistCount) returns (uint256)'
]);

export const RewardManager = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  // État pour le formulaire de modification des récompenses
  const [rewardForm, setRewardForm] = useState({
    buyerReward: '',
    artistReward: '',
    organizerReward: '',
    validatorReward: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lire les récompenses actuelles
  const { data: currentRewards, isLoading: rewardsLoading } = useReadContract({
    address: '0x...', // Adresse du RewardConfig (à remplacer)
    abi: REWARD_CONFIG_ABI,
    functionName: 'getCurrentRewards',
  });

  // Lire l'historique des récompenses
  const { data: historyCount, isLoading: historyLoading } = useReadContract({
    address: '0x...', // Adresse du RewardConfig (à remplacer)
    abi: REWARD_CONFIG_ABI,
    functionName: 'getHistoryCount',
  });

  const handleUpdateRewards = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      // Validation des données
      const buyerReward = BigInt(parseFloat(rewardForm.buyerReward) * 1e18);
      const artistReward = BigInt(parseFloat(rewardForm.artistReward) * 1e18);
      const organizerReward = BigInt(parseFloat(rewardForm.organizerReward) * 1e18);
      const validatorReward = BigInt(parseFloat(rewardForm.validatorReward) * 1e18);

      if (buyerReward <= 0 || artistReward <= 0 || organizerReward <= 0 || validatorReward <= 0) {
        setError('Tous les montants doivent être supérieurs à 0');
        return;
      }

      // Appel au contrat RewardConfig pour mettre à jour les récompenses
      const result = await writeContractAsync({
        address: '0x...', // Adresse du RewardConfig (à remplacer)
        abi: REWARD_CONFIG_ABI,
        functionName: 'updateRewards',
        args: [buyerReward, artistReward, organizerReward, validatorReward],
      });

      setSuccess(`Rewards updated successfully! Transaction: ${result}`);
      
      // Reset form
      setRewardForm({
        buyerReward: '',
        artistReward: '',
        organizerReward: '',
        validatorReward: '',
      });
      
    } catch (error) {
      console.error("Error updating rewards:", error);
      setError('Error updating rewards: ' + (error as Error).message);
    }
  };

  if (!address) {
    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>⚙️ Gestion des récompenses</h3>
        <p>Connect your wallet to manage rewards</p>
      </div>
    );
  }

  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
        <h3>⚙️ TickethicCoin Reward Management</h3>
        
        {/* Display current rewards */}
        <div style={{ marginBottom: '20px' }}>
          <h4>📊 Current rewards:</h4>
          {rewardsLoading ? (
            <p>Loading...</p>
          ) : currentRewards ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>Buyer: <strong>{(Number(currentRewards[0]) / 1e18).toFixed(2)} TTC</strong></div>
              <div>Artist: <strong>{(Number(currentRewards[1]) / 1e18).toFixed(2)} TTC</strong></div>
              <div>Organizer: <strong>{(Number(currentRewards[2]) / 1e18).toFixed(2)} TTC</strong></div>
              <div>Validator: <strong>{(Number(currentRewards[3]) / 1e18).toFixed(2)} TTC</strong></div>
            </div>
          ) : (
            <p>Unable to load rewards</p>
          )}
        </div>

        {/* Modification form */}
        <div style={{ marginBottom: '20px' }}>
          <h4>✏️ Modify rewards:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label>
              Buyer reward (TTC):<br />
              <input
                type="number"
                step="0.1"
                value={rewardForm.buyerReward}
                onChange={e => setRewardForm({...rewardForm, buyerReward: e.target.value})}
                style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
                placeholder="10.0"
                disabled={isPending}
              />
            </label>
          </div>
          <div>
            <label>
              Artist reward (TTC):<br />
              <input
                type="number"
                step="0.1"
                value={rewardForm.artistReward}
                onChange={e => setRewardForm({...rewardForm, artistReward: e.target.value})}
                style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
                placeholder="5.0"
                disabled={isPending}
              />
            </label>
          </div>
          <div>
            <label>
              Organizer reward (TTC):<br />
              <input
                type="number"
                step="0.1"
                value={rewardForm.organizerReward}
                onChange={e => setRewardForm({...rewardForm, organizerReward: e.target.value})}
                style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
                placeholder="5.0"
                disabled={isPending}
              />
            </label>
          </div>
          <div>
            <label>
              Validator reward (TTC):<br />
              <input
                type="number"
                step="0.1"
                value={rewardForm.validatorReward}
                onChange={e => setRewardForm({...rewardForm, validatorReward: e.target.value})}
                style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
                placeholder="2.0"
                disabled={isPending}
              />
            </label>
          </div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

        <button 
          onClick={handleUpdateRewards} 
          disabled={isPending}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: isPending ? 'not-allowed' : 'pointer'
          }}
        >
          {isPending ? 'Updating...' : 'Update Rewards'}
        </button>
      </div>

      {/* History information */}
      <div style={{ fontSize: '14px', color: '#6c757d' }}>
        <h4>📈 History:</h4>
        {historyLoading ? (
          <p>Loading history...</p>
        ) : (
          <p>Number of modifications: {historyCount ? Number(historyCount) : 0}</p>
        )}
        <p><strong>Note:</strong> Only contract owners can modify rewards.</p>
      </div>
    </div>
  );
};
