'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractAddresses } from '@/config'

// Complete Event ABI for testing
const EVENT_ABI = [
  {
    "inputs": [],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
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

// Artist ABI for testing
const ARTIST_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Ticket ABI for testing
const TICKET_ABI = [
  {
    "inputs": [],
    "name": "nextTicketId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useBuyTicketTest() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  })

  const testBuyTicket = async (eventAddress: string, ticketPrice: bigint) => {
    try {
      console.log('=== DETAILED BUY TICKET TEST ===')
      console.log('Event Address:', eventAddress)
      console.log('Ticket Price (wei):', ticketPrice.toString())
      console.log('Ticket Price (ETH):', (Number(ticketPrice) / 1e18).toString())
      console.log('Gas Limit: 2,000,000')
      console.log('================================')
      
      // Try with maximum gas and detailed error handling
      writeContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'buyTicket',
        args: [],
        value: ticketPrice,
        gas: 2000000n, // Maximum gas limit
      })
    } catch (err) {
      console.error('=== BUY TICKET ERROR ===')
      console.error('Error:', err)
      console.error('Error type:', typeof err)
      console.error('Error message:', err instanceof Error ? err.message : 'Unknown error')
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack')
      console.error('Full error object:', JSON.stringify(err, null, 2))
      console.error('========================')
      throw err
    }
  }

  return {
    testBuyTicket,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    receipt
  }
}
