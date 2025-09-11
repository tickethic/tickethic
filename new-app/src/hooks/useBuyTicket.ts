'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractAddresses } from '@/config'

// Event ABI for buying tickets
const EVENT_ABI = [
  {
    "inputs": [],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

export interface BuyTicketParams {
  eventAddress: string
  ticketPrice: bigint
  buyerInfo: {
    walletAddress: string
  }
}

export function useBuyTicket() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  })

  // Extract ticket ID from transaction receipt
  const ticketId = receipt?.logs?.find(log => {
    try {
      // Look for TicketPurchased event
      return log.topics[0] === '0x...' // Event signature for TicketPurchased
    } catch {
      return false
    }
  })?.data ? BigInt(receipt.logs[0].data) : null

  const buyTicket = async (params: BuyTicketParams) => {
    try {
      // Call the buyTicket function on the Event contract
      writeContract({
        address: params.eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'buyTicket',
        args: [],
        value: params.ticketPrice, // Send ETH as payment
        gas: 500000n, // Set a higher gas limit
      })
    } catch (err) {
      console.error('Error buying ticket:', err)
      throw err
    }
  }

  return {
    buyTicket,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    receipt,
    ticketId
  }
}
