'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'

// EventManager ABI - simplified version with the functions we need
const EVENT_MANAGER_ABI = [
  {
    "inputs": [],
    "name": "getTotalEvents",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_eventId", "type": "uint256"}],
    "name": "getEventInfo",
    "outputs": [
      {"internalType": "address", "name": "eventAddress", "type": "address"},
      {"internalType": "address", "name": "organizer", "type": "address"},
      {"internalType": "uint256", "name": "date", "type": "uint256"},
      {"internalType": "uint256", "name": "ticketPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "totalTickets", "type": "uint256"},
      {"internalType": "uint256", "name": "soldTickets", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_eventId", "type": "uint256"}],
    "name": "getEventAddress",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Event ABI - simplified version
const EVENT_ABI = [
  {
    "inputs": [],
    "name": "metadataURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
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

export interface EventInfo {
  id: number
  eventAddress: string
  organizer: string
  date: bigint
  ticketPrice: bigint
  totalTickets: bigint
  soldTickets: bigint
  metadataURI?: string
  artistIds?: bigint[]
}

export function useEvents() {
  // Get total number of events
  const { data: totalEvents, isLoading: isLoadingTotal } = useReadContract({
    address: contractAddresses.EventManager,
    abi: EVENT_MANAGER_ABI,
    functionName: 'getTotalEvents',
  })

  return {
    totalEvents: totalEvents ? Number(totalEvents) : 0,
    isLoadingTotal,
  }
}

export function useEventInfo(eventId: number) {
  const { data: eventInfo, isLoading } = useReadContract({
    address: contractAddresses.EventManager,
    abi: EVENT_MANAGER_ABI,
    functionName: 'getEventInfo',
    args: [BigInt(eventId)],
    query: {
      enabled: eventId > 0,
    }
  })

  return {
    eventInfo,
    isLoading,
  }
}

export function useEventMetadata(eventAddress: string) {
  const { data: metadataURI } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'metadataURI',
    query: {
      enabled: !!eventAddress && eventAddress !== '0x0000000000000000000000000000000000000000',
    }
  })

  const { data: artistIds } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistIds',
    query: {
      enabled: !!eventAddress && eventAddress !== '0x0000000000000000000000000000000000000000',
    }
  })

  const { data: artistShares } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistShares',
    query: {
      enabled: !!eventAddress && eventAddress !== '0x0000000000000000000000000000000000000000',
    }
  })

  return {
    metadataURI,
    artistIds,
    artistShares,
  }
}
