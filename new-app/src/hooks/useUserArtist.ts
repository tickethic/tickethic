'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'
import { useState, useEffect } from 'react'

// Artist ABI - Current deployed version
const ARTIST_ABI = [
  {
    "inputs": [],
    "name": "nextArtistId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "artistId", "type": "uint256"}],
    "name": "getArtistInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "metadataURI", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface UserArtistInfo {
  id: number
  name: string
  metadataURI: string
  owner: string
}

export function useUserArtist(userAddress?: string) {
  const [userArtist, setUserArtist] = useState<UserArtistInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the next artist ID to know how many artists exist
  const { data: nextArtistId, isLoading: isLoadingNextId } = useReadContract({
    address: contractAddresses.Artist,
    abi: ARTIST_ABI,
    functionName: 'nextArtistId',
    query: {
      enabled: !!userAddress
    }
  })

  useEffect(() => {
    if (!userAddress || !nextArtistId) {
      setUserArtist(null)
      setIsLoading(false)
      return
    }

    const findUserArtist = async () => {
      try {
        setIsLoading(true)
        
        // Check all existing artists to see if user owns one
        const totalArtists = Number(nextArtistId)
        
        for (let i = 1; i < totalArtists; i++) {
          try {
            // Check if this artist exists and get its owner
            const owner = await fetch(`/api/artist/${i}`)
              .then(res => res.json())
              .then(data => data.owner)
              .catch(() => null)
            
            if (owner && owner.toLowerCase() === userAddress.toLowerCase()) {
              // User owns this artist, get the artist info
              const artistInfo = await fetch(`/api/artist/${i}`)
                .then(res => res.json())
                .catch(() => null)
              
              if (artistInfo) {
                setUserArtist({
                  id: i,
                  name: artistInfo.name,
                  metadataURI: artistInfo.metadataURI,
                  owner: artistInfo.owner
                })
                break
              }
            }
          } catch (err) {
            // Artist doesn't exist or error, continue
            continue
          }
        }
        
        // If no artist found, userArtist remains null
      } catch (err) {
        console.error('Error finding user artist:', err)
        setError('Erreur lors de la recherche de votre profil artiste')
      } finally {
        setIsLoading(false)
      }
    }

    findUserArtist()
  }, [userAddress, nextArtistId])

  return {
    userArtist,
    hasMinted: !!userArtist,
    isLoading: isLoading || isLoadingNextId,
    error
  }
}