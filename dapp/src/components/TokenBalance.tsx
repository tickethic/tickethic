'use client'
import { useReadContract, useAccount } from 'wagmi'
import { parseAbi } from 'viem'
import React from 'react'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/config/contracts'

const TICKETHIC_COIN_ABI = parseAbi(CONTRACT_ABIS.TICKETHIC_COIN);

export const TokenBalance = () => {
  const { address } = useAccount();

  // Lire le solde de tokens de l'utilisateur
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.TICKETHIC_COIN,
    abi: TICKETHIC_COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Lire le solde du pool de récompenses
  const { data: rewardPoolBalance, isLoading: poolLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.TICKETHIC_COIN,
    abi: TICKETHIC_COIN_ABI,
    functionName: 'getRewardPoolBalance',
  });

  // Vérifier si l'utilisateur est un créateur
  const { data: isCreator, isLoading: creatorLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.TICKETHIC_COIN,
    abi: TICKETHIC_COIN_ABI,
    functionName: 'checkIsCreator',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  if (!address) {
    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>🪙 TickethicCoin</h3>
        <p>Connect your wallet to see your token balance</p>
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
      <h3>🪙 TickethicCoin (TTC)</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Your balance:</h4>
        {balanceLoading ? (
          <p>Loading...</p>
        ) : (
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
            {balance ? (Number(balance) / 1e18).toFixed(2) : '0.00'} TTC
          </p>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>Available reward pool:</h4>
        {poolLoading ? (
          <p>Loading...</p>
        ) : (
          <p style={{ fontSize: '16px', color: '#28a745' }}>
            {rewardPoolBalance ? (Number(rewardPoolBalance) / 1e18).toFixed(2) : '0.00'} TTC
          </p>
        )}
      </div>

      {creatorLoading ? (
        <p>Checking creator status...</p>
      ) : isCreator ? (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          <strong>🎨 You are a platform creator!</strong>
        </div>
      ) : null}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
        <h4>💡 How to earn TTC:</h4>
        <ul>
          <li><strong>Buy a ticket:</strong> +10 TTC</li>
          <li><strong>Be an artist:</strong> +5 TTC per ticket sold</li>
          <li><strong>Organize an event:</strong> +5 TTC per ticket sold</li>
          <li><strong>Validate a ticket:</strong> +2 TTC per validation</li>
        </ul>
      </div>
    </div>
  );
};
