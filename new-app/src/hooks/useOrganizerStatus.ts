'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'

// Organizator contract ABI
const ORGANIZATOR_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "organizator", "type": "address"}],
    "name": "isOrganizator",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useOrganizerStatus(address?: string) {
  const { data: isOrganizer, isLoading, error } = useReadContract({
    address: contractAddresses.Organizator,
    abi: ORGANIZATOR_ABI,
    functionName: 'isOrganizator',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    }
  })

  return {
    isOrganizer: isOrganizer || false,
    isLoading,
    error
  }
}

