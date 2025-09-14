'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'

const TICKET_ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useTicketOwner() {
  const { data: owner, error, isLoading } = useReadContract({
    address: contractAddresses.Ticket as `0x${string}`,
    abi: TICKET_ABI,
    functionName: 'owner',
  })

  console.log('=== TICKET OWNER DEBUG ===')
  console.log('Ticket Contract:', contractAddresses.Ticket)
  console.log('Ticket Owner:', owner)
  console.log('Error:', error)
  console.log('==========================')

  return { owner, error, isLoading }
}
