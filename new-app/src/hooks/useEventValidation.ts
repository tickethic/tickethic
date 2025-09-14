'use client'

import { useReadContract } from 'wagmi'

const EVENT_ABI = [
  {
    "inputs": [],
    "name": "artistIds",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "artistShares",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "organizer",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const ARTIST_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useEventValidation(eventAddress: string) {
  const { data: artistIds } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'artistIds',
  })

  const { data: artistShares } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'artistShares',
  })

  const { data: organizer } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'organizer',
  })

  // Check if organizer address is valid (not zero address)
  const isOrganizerValid = organizer && organizer !== '0x0000000000000000000000000000000000000000'

  // Check if artists exist and have valid owners
  const hasValidArtists = artistIds && artistIds.length > 0

  const validationErrors = []
  if (!isOrganizerValid) {
    validationErrors.push('Adresse organisateur invalide')
  }
  if (!hasValidArtists) {
    validationErrors.push('Aucun artiste configuré')
  }

  return {
    isEventValid: isOrganizerValid && hasValidArtists,
    validationErrors,
    artistIds: artistIds || [],
    artistShares: artistShares || [],
    organizer
  }
}
