'use client'
import { useWriteContract, useAccount, useReadContract } from 'wagmi'
import { parseAbi } from 'viem'
import React, { useState } from 'react'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/config/contracts'

const TICKETHIC_COIN_ABI = parseAbi(CONTRACT_ABIS.TICKETHIC_COIN);

export const FoundersMultisigManager = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [newMultisigAddress, setNewMultisigAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Read current founders multisig
  const { data: currentMultisig, isLoading: multisigLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.TICKETHIC_COIN,
    abi: TICKETHIC_COIN_ABI,
    functionName: 'getFoundersMultisig',
  });

  // Check if current user is the owner (can update multisig)
  const { data: isOwner, isLoading: ownerLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.TICKETHIC_COIN,
    abi: TICKETHIC_COIN_ABI,
    functionName: 'owner',
  });

  const handleUpdateMultisig = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      if (!newMultisigAddress) {
        setError('Please enter a multisig address');
        return;
      }

      if (!address) {
        setError('Please connect your wallet');
        return;
      }

      if (address !== isOwner) {
        setError('Only the contract owner can update the founders multisig');
        return;
      }

      await writeContractAsync({
        address: CONTRACT_ADDRESSES.TICKETHIC_COIN,
        abi: TICKETHIC_COIN_ABI,
        functionName: 'updateFoundersMultisig',
        args: [newMultisigAddress],
      });

      setSuccess('Founders multisig updated successfully!');
      setNewMultisigAddress('');
      
    } catch (error) {
      console.error("Error updating founders multisig:", error);
      setError('Error updating founders multisig: ' + (error as Error).message);
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
        <h3>🏛️ Founders Multisig Management</h3>
        <p>Connect your wallet to manage the founders multisig</p>
      </div>
    );
  }

  if (ownerLoading) {
    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>🏛️ Founders Multisig Management</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (address !== isOwner) {
    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>🏛️ Founders Multisig Management</h3>
        <p>Only the contract owner can manage the founders multisig</p>
        <p style={{ fontSize: '14px', color: '#6c757d' }}>
          Current owner: {isOwner}
        </p>
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
      <h3>🏛️ Founders Multisig Management</h3>
      
      {/* Display current multisig */}
      <div style={{ marginBottom: '20px' }}>
        <h4>📋 Current founders multisig:</h4>
        {multisigLoading ? (
          <p>Loading...</p>
        ) : (
          <p style={{ 
            fontFamily: 'monospace', 
            backgroundColor: '#e9ecef', 
            padding: '8px', 
            borderRadius: '4px',
            wordBreak: 'break-all'
          }}>
            {currentMultisig}
          </p>
        )}
      </div>

      {/* Update multisig form */}
      <div style={{ marginBottom: '20px' }}>
        <h4>✏️ Update founders multisig:</h4>
        <div style={{ marginBottom: '10px' }}>
          <label>
            New multisig address:<br />
            <input
              type="text"
              value={newMultisigAddress}
              onChange={e => setNewMultisigAddress(e.target.value)}
              style={{ 
                width: '100%', 
                height: '38px', 
                borderRadius: '8px', 
                padding: '8px',
                fontFamily: 'monospace'
              }}
              placeholder="0x..."
              disabled={isPending}
            />
          </label>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

        <button 
          onClick={handleUpdateMultisig} 
          disabled={isPending}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: isPending ? 'not-allowed' : 'pointer'
          }}
        >
          {isPending ? 'Updating...' : 'Update Multisig'}
        </button>
      </div>

      {/* Information */}
      <div style={{ fontSize: '14px', color: '#6c757d' }}>
        <h4>⚠️ Important:</h4>
        <ul>
          <li>This will transfer all founder tokens (200M TTC) to the new multisig</li>
          <li>The new multisig address must be a valid contract address</li>
          <li>This action cannot be undone</li>
          <li>Make sure the new multisig is properly configured before updating</li>
        </ul>
      </div>
    </div>
  );
};
