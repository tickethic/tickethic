'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractAddresses } from '@/config'
import { useState } from 'react'

// Artist ABI
const ARTIST_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "artistName", "type": "string"},
      {"internalType": "string", "name": "artistMetadataURI", "type": "string"}
    ],
    "name": "mintArtist",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "userAddress", "type": "address"}],
    "name": "hasAddressMintedArtist",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface ArtistRegistrationData {
  name: string
  description: string
  genre: string
  socialLinks: {
    website?: string
    twitter?: string
    instagram?: string
    spotify?: string
  }
  imageUrl?: string
}

export function useArtistRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const mintArtist = async (artistData: ArtistRegistrationData) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Create metadata JSON
      const metadata = {
        name: artistData.name,
        description: artistData.description,
        genre: artistData.genre,
        socialLinks: artistData.socialLinks,
        image: artistData.imageUrl || '',
        attributes: [
          {
            trait_type: "Genre",
            value: artistData.genre
          },
          {
            trait_type: "Type",
            value: "Artist"
          }
        ]
      }

      // For now, we'll use a placeholder IPFS URI
      // In a real implementation, you would upload the metadata to IPFS first
      const metadataURI = `ipfs://artist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Call the mintArtist function
      writeContract({
        address: contractAddresses.Artist,
        abi: ARTIST_ABI,
        functionName: 'mintArtist',
        args: [artistData.name, metadataURI],
      })

    } catch (err) {
      console.error('Error minting artist:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création de l\'artiste')
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
