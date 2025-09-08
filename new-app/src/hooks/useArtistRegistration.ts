'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractAddresses } from '@/config'
import { useState } from 'react'

// Artist ABI
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

  const submitArtistApplication = async (artistData: ArtistRegistrationData, userAddress: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Create metadata JSON for the application
      const metadata = {
        name: artistData.name,
        description: artistData.description,
        genre: artistData.genre,
        socialLinks: artistData.socialLinks,
        image: artistData.imageUrl || '',
        applicantAddress: userAddress,
        timestamp: new Date().toISOString(),
        attributes: [
          {
            trait_type: "Genre",
            value: artistData.genre
          },
          {
            trait_type: "Type",
            value: "Artist Application"
          }
        ]
      }

      // In a real implementation, you would:
      // 1. Upload metadata to IPFS
      // 2. Send the application to a backend service
      // 3. Store the application in a database
      // 4. Notify the contract owner
      
      // For now, we'll simulate the application submission
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      setSuccess('Demande d\'inscription soumise avec succès ! Elle sera examinée par l\'équipe.')

    } catch (err) {
      console.error('Error submitting artist application:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la soumission de la demande')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    submitArtistApplication,
    isLoading,
    error,
    success
  }
}
