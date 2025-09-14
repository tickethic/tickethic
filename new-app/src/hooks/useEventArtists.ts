'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'

const EVENT_ABI = [
  {
    "inputs": [],
    "name": "getArtistIds",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getArtistShares",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const ARTIST_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getArtistInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "image", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface EventArtist {
  id: number
  name: string
  share: number
}

export function useEventArtists(eventAddress: string) {
  const { data: artistIds } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistIds',
  })

  const { data: artistShares } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistShares',
  })

  // Fetch artist details for each artist ID
  const artistDetails = []
  if (artistIds && artistShares) {
    for (let i = 0; i < artistIds.length; i++) {
      const artistId = Number(artistIds[i])
      const share = Math.round(Number(artistShares[i]) / 100) // Convert from basis points to percentage
      
      // We'll fetch the artist name via API call instead of direct contract call
      // to avoid multiple useReadContract calls in a loop
      artistDetails.push({
        id: artistId,
        name: `Artiste #${artistId}`, // Placeholder, will be replaced by API call
        share: share
      })
    }
  }

  return {
    artists: artistDetails,
    isLoading: !artistIds || !artistShares,
    totalArtists: artistIds?.length || 0
  }
}
