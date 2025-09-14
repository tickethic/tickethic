'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'

// Event ABI for debugging
const EVENT_ABI = [
  {
    "inputs": [],
    "name": "organizer",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ticketPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTickets",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "soldTickets",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "date",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
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

// Artist ABI for debugging
const ARTIST_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useContractDebug(eventAddress: string) {
  // Event contract data
  const { data: organizer } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'organizer',
  })

  const { data: ticketPrice } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'ticketPrice',
  })

  const { data: totalTickets } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'totalTickets',
  })

  const { data: soldTickets } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'soldTickets',
  })

  const { data: date } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'date',
  })

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

  // Artist contract data
  const { data: artistOwner, error: artistOwnerError } = useReadContract({
    address: contractAddresses.Artist as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'ownerOf',
    args: artistIds && artistIds.length > 0 ? [artistIds[0]] : [0n],
    query: { enabled: !!(artistIds && artistIds.length > 0) }
  })

  // Debug logging
  console.log('=== CONTRACT DEBUG ===')
  console.log('Event Address:', eventAddress)
  console.log('Organizer:', organizer)
  console.log('Ticket Price:', ticketPrice)
  console.log('Total Tickets:', totalTickets)
  console.log('Sold Tickets:', soldTickets)
  console.log('Date:', date)
  console.log('Artist IDs:', artistIds)
  console.log('Artist Shares:', artistShares)
  console.log('Artist Owner:', artistOwner)
  console.log('Artist Owner Error:', artistOwnerError)
  console.log('======================')

  // Validation checks
  const now = Math.floor(Date.now() / 1000)
  const eventDate = date ? Number(date) : 0
  const isEventInFuture = eventDate > now
  const isSoldOut = soldTickets && totalTickets ? Number(soldTickets) >= Number(totalTickets) : false
  const hasValidOrganizer = organizer && organizer !== '0x0000000000000000000000000000000000000000'
  const hasValidArtist = artistOwner && artistOwner !== '0x0000000000000000000000000000000000000000'
  const hasValidPrice = ticketPrice && Number(ticketPrice) > 0

  const validationErrors = []
  if (!isEventInFuture) validationErrors.push('Event already happened')
  if (isSoldOut) validationErrors.push('Event sold out')
  if (!hasValidOrganizer) validationErrors.push('Invalid organizer')
  if (!hasValidArtist) validationErrors.push('Invalid artist owner')
  if (!hasValidPrice) validationErrors.push('Invalid ticket price')

  return {
    organizer,
    ticketPrice,
    totalTickets,
    soldTickets,
    date,
    artistIds,
    artistShares,
    artistOwner,
    artistOwnerError,
    isEventInFuture,
    isSoldOut,
    hasValidOrganizer,
    hasValidArtist,
    hasValidPrice,
    validationErrors,
    isValid: validationErrors.length === 0
  }
}
