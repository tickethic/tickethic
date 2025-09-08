'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'
import { useState, useEffect } from 'react'

// Artist ABI
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

export interface ArtistInfo {
  id: number
  name: string
  metadataURI: string
  owner: string
}

export function useAllArtists() {
  const { totalArtists, isLoading: isLoadingTotal } = useTotalArtists()
  const [allArtists, setAllArtists] = useState<ArtistInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (totalArtists > 0) {
      setIsLoading(true)
      // Fetch all artists info from the real contract
      const fetchAllArtists = async () => {
        const artists: ArtistInfo[] = []
        
        for (let i = 1; i <= totalArtists; i++) {
          try {
            // TODO: Replace with real contract calls
            // For now, we'll create placeholder data until we implement the real contract calls
            // The real implementation should use wagmi's useReadContract for each artist
            artists.push({
              id: i,
              name: `Artiste #${i}`, // This will be replaced with real data from getArtistInfo
              metadataURI: `ipfs://artist-${i}`, // This will be replaced with real data from getArtistInfo
              owner: '0x...' // This will be replaced with real data from ownerOf
            })
          } catch (error) {
            console.error(`Error fetching artist ${i}:`, error)
          }
        }
        
        setAllArtists(artists)
        setIsLoading(false)
      }
      
      fetchAllArtists()
    }
  }, [totalArtists])

  return {
    allArtists,
    isLoading: isLoading || isLoadingTotal,
    totalArtists
  }
}

// Keep the original hook for backward compatibility
export function useTotalArtists() {
  const { data: nextArtistId, isLoading } = useReadContract({
    address: contractAddresses.Artist,
    abi: ARTIST_ABI,
    functionName: 'nextArtistId',
  })

  return {
    totalArtists: nextArtistId ? Number(nextArtistId) - 1 : 0,
    isLoading
  }
}
