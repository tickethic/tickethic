'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractAddresses } from '@/config'
import { useWallet } from '@/hooks/useWallet'
import { useState } from 'react'

// Artist ABI - Current deployed version
const ARTIST_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "artistName", "type": "string"},
      {"internalType": "string", "name": "artistMetadataURI", "type": "string"}
    ],
    "name": "mintArtist",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export interface ArtistRegistrationData {
  name: string
  description?: string
  genre?: string
  socialLinks?: {
    website?: string
    twitter?: string
    instagram?: string
    spotify?: string
  }
  imageUrl?: string
}

export function useArtistRegistration() {
  const { address } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const mintArtist = async (artistData: ArtistRegistrationData, customIpfsUrl?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Use custom IPFS URL if provided, otherwise generate a placeholder
      const metadataURI = customIpfsUrl || `ipfs://artist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Note: This will fail because the contract has onlyOwner modifier
      // The user needs to contact the contract owner to mint an artist
      if (!address) {
        throw new Error('Wallet non connecté')
      }
      
      writeContract({
        address: contractAddresses.Artist,
        abi: ARTIST_ABI,
        functionName: 'mintArtist',
        args: [address, artistData.name, metadataURI], // This will fail due to onlyOwner
      })

    } catch (err) {
      console.error('Error minting artist:', err)
      setError('Seul le propriétaire du contrat peut créer des artistes. Contactez l\'administrateur.')
    } finally {
      setIsLoading(false)
    }
  }

  // Update success/error states based on transaction status
  if (isSuccess && !success) {
    setSuccess('Artiste créé avec succès !')
  }

  return {
    mintArtist,
    isLoading: isLoading || isPending || isConfirming,
    error,
    success,
    hash,
    isSuccess
  }
}
