'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'

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
    "name": "getTicketContract",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const TICKET_ABI = [
  {
    "inputs": [],
    "name": "owner",
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

export function useContractRelations(eventAddress: string) {
  // Get the ticket contract address for this specific event
  const { data: eventTicketContract } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getTicketContract',
  })

  // Check if Event contract is owner of its specific Ticket contract
  const { data: ticketOwner } = useReadContract({
    address: eventTicketContract as `0x${string}`,
    abi: TICKET_ABI,
    functionName: 'owner',
    query: { enabled: !!eventTicketContract }
  })

  // Check if Event contract is owner of Artist contract
  const { data: artistOwner } = useReadContract({
    address: contractAddresses.Artist as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'ownerOf',
    args: [1n], // Test with artist ID 1
  })

  // Check Event organizer
  const { data: eventOrganizer } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'organizer',
  })

  const isEventTicketOwner = ticketOwner === eventAddress
  const isEventArtistOwner = artistOwner === eventAddress
  const isEventOrganizerValid = eventOrganizer && eventOrganizer !== '0x0000000000000000000000000000000000000000'

  console.log('=== CONTRACT RELATIONS DEBUG ===')
  console.log('Event Address:', eventAddress)
  console.log('Event Ticket Contract:', eventTicketContract)
  console.log('Ticket Owner:', ticketOwner)
  console.log('Is Event Ticket Owner:', isEventTicketOwner)
  console.log('Artist Owner (ID 1):', artistOwner)
  console.log('Is Event Artist Owner:', isEventArtistOwner)
  console.log('Event Organizer:', eventOrganizer)
  console.log('Is Event Organizer Valid:', isEventOrganizerValid)
  console.log('================================')

  return {
    eventTicketContract,
    ticketOwner,
    artistOwner,
    eventOrganizer,
    isEventTicketOwner,
    isEventArtistOwner,
    isEventOrganizerValid,
    hasValidRelations: isEventTicketOwner && isEventOrganizerValid
  }
}
