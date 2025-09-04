'use client'
import { useDisconnect, useAppKitNetwork } from '@reown/appkit/react'
import { networks } from '@/config'
import { useWriteContract, useAccount } from 'wagmi'
import { parseAbi } from 'viem'
import React, { useState } from 'react'

// Replace with your deployed Artist contract address
const TICKETHIC_CONTRACT_ADDRESS = '0xYourArtistContractAddressHere'

// Minimal ABI for mintArtist(address to, string artistName, string artistMetadataURI)
const ARTIST_ABI = parseAbi([
  'function mintArtist(address to, string artistName, string artistMetadataURI) returns (uint256)'
])

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useAppKitNetwork();
  const { address } = useAccount();

  const { writeContractAsync, isPending } = useWriteContract();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [artistMetadataURI, setArtistMetadataURI] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUpClick = () => {
    setDialogOpen(true);
    setArtistName('');
    setArtistMetadataURI('');
    setError(null);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setArtistName('');
    setArtistMetadataURI('');
    setError(null);
  };

  const handleSignUpArtist = async () => {
    setError(null);
    if (!artistName || !artistMetadataURI) {
      setError('Please provide both artist name and IPFS URI.');
      return;
    }
    try {
      await writeContractAsync({
        address: TICKETHIC_CONTRACT_ADDRESS,
        abi: ARTIST_ABI,
        functionName: 'mintArtist',
        args: [address, artistName, artistMetadataURI],
      });
      alert('Artist NFT minted!');
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to sign up artist:", error);
      setError('Failed to mint Artist NFT');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSignUpClick}>Sign up as Artist</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={() => switchNetwork(networks[1]) }>Switch</button>

      {dialogOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 320 }}>
            <h2>Register as Artist</h2>
            <div>
              <label>
                Artist Name:<br />
                <input
                  type="text"
                  value={artistName}
                  onChange={e => setArtistName(e.target.value)}
                  style={{ width: '100%', height: 38, borderRadius: 8, padding: 8}}
                  disabled={isPending}
                />
              </label>
            </div>
            <div style={{ marginTop: 12 }}>
              <label>
                IPFS Metadata URI:<br />
                <input
                  type="text"
                  value={artistMetadataURI}
                  onChange={e => setArtistMetadataURI(e.target.value)}
                  style={{ width: '100%', height: 38, borderRadius: 8, padding: 8}}
                  disabled={isPending}
                />
              </label>
            </div>
            {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button onClick={handleSignUpArtist} disabled={isPending}>
                {isPending ? 'Signing up...' : 'Sign up as Artist'}
              </button>
              <button onClick={handleDialogCancel} disabled={isPending}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
