'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { useBuyTicketTest } from '@/hooks/useBuyTicketTest'
import { useContractRelations } from '@/hooks/useContractRelations'
import { useTicketOwner } from '@/hooks/useTicketOwner'
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
  },
  {
    "inputs": [],
    "name": "getTicketContract",
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

const TICKET_ABI = [
  {
    "inputs": [],
    "name": "nextTicketId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

interface BuyTicketDebuggerProps {
  eventAddress: string
}

export function BuyTicketDebugger({ eventAddress }: BuyTicketDebuggerProps) {
  const [testResult, setTestResult] = useState<string>('')
  
  // Read all event data
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

  const { data: eventTicketContract } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getTicketContract',
  })

  // Read artist owner
  const { data: artistOwner, error: artistOwnerError } = useReadContract({
    address: contractAddresses.Artist as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'ownerOf',
    args: artistIds && artistIds.length > 0 ? [artistIds[0]] : [0n],
    query: { enabled: !!(artistIds && artistIds.length > 0) }
  })

  // Read ticket contract
  const { data: nextTicketId, error: ticketError } = useReadContract({
    address: contractAddresses.Ticket as `0x${string}`,
    abi: TICKET_ABI,
    functionName: 'nextTicketId',
  })

  const { testBuyTicket, error, isPending, isConfirmed } = useBuyTicketTest()
  const contractRelations = useContractRelations(eventAddress)
  const ticketOwner = useTicketOwner()

  const runDiagnostic = () => {
    const now = Math.floor(Date.now() / 1000)
    const eventDate = date ? Number(date) : 0
    const isEventInFuture = eventDate > now
    const isSoldOut = soldTickets && totalTickets ? Number(soldTickets) >= Number(totalTickets) : false
    const hasValidOrganizer = organizer && organizer !== '0x0000000000000000000000000000000000000000'
    const hasValidArtist = artistOwner && artistOwner !== '0x0000000000000000000000000000000000000000'
    const hasValidPrice = ticketPrice && Number(ticketPrice) > 0

    let diagnostic = '=== DIAGNOSTIC REPORT ===\n'
    diagnostic += `Event Address: ${eventAddress}\n`
    diagnostic += `Organizer: ${organizer} ${hasValidOrganizer ? '✅' : '❌'}\n`
    diagnostic += `Ticket Price: ${ticketPrice} (${ticketPrice ? (Number(ticketPrice) / 1e18).toString() + ' ETH' : 'N/A'}) ${hasValidPrice ? '✅' : '❌'}\n`
    diagnostic += `Total Tickets: ${totalTickets}\n`
    diagnostic += `Sold Tickets: ${soldTickets}\n`
    diagnostic += `Remaining: ${totalTickets && soldTickets ? Number(totalTickets) - Number(soldTickets) : 'N/A'}\n`
    diagnostic += `Event Date: ${eventDate} (${new Date(eventDate * 1000).toLocaleString()})\n`
    diagnostic += `Current Time: ${now} (${new Date(now * 1000).toLocaleString()})\n`
    diagnostic += `Is Future: ${isEventInFuture} ${isEventInFuture ? '✅' : '❌'}\n`
    diagnostic += `Is Sold Out: ${isSoldOut} ${isSoldOut ? '❌' : '✅'}\n`
    diagnostic += `Artist IDs: ${artistIds}\n`
    diagnostic += `Artist Shares: ${artistShares}\n`
    diagnostic += `Artist Owner: ${artistOwner} ${hasValidArtist ? '✅' : '❌'}\n`
    diagnostic += `Artist Owner Error: ${artistOwnerError ? artistOwnerError.message : 'None'}\n`
    diagnostic += `Event Ticket Contract: ${eventTicketContract}\n`
    diagnostic += `Next Ticket ID: ${nextTicketId}\n`
    diagnostic += `Ticket Error: ${ticketError ? ticketError.message : 'None'}\n`
    diagnostic += '\n=== CONTRACT RELATIONS ===\n'
    diagnostic += `Ticket Owner: ${contractRelations.ticketOwner}\n`
    diagnostic += `Is Event Ticket Owner: ${contractRelations.isEventTicketOwner ? '✅' : '❌'}\n`
    diagnostic += `Artist Owner (ID 1): ${contractRelations.artistOwner}\n`
    diagnostic += `Event Organizer: ${contractRelations.eventOrganizer}\n`
    diagnostic += `Has Valid Relations: ${contractRelations.hasValidRelations ? '✅' : '❌'}\n`
    diagnostic += '\n=== TICKET CONTRACT OWNERSHIP ===\n'
    diagnostic += `Ticket Contract: ${contractAddresses.Ticket}\n`
    diagnostic += `Ticket Owner: ${ticketOwner.owner}\n`
    diagnostic += `Ticket Owner Error: ${ticketOwner.error ? ticketOwner.error.message : 'None'}\n`
    diagnostic += '\n=== VALIDATION CHECKS ===\n'
    diagnostic += `Event in future: ${isEventInFuture ? 'PASS' : 'FAIL'}\n`
    diagnostic += `Not sold out: ${!isSoldOut ? 'PASS' : 'FAIL'}\n`
    diagnostic += `Valid organizer: ${hasValidOrganizer ? 'PASS' : 'FAIL'}\n`
    diagnostic += `Valid artist: ${hasValidArtist ? 'PASS' : 'FAIL'}\n`
    diagnostic += `Valid price: ${hasValidPrice ? 'PASS' : 'FAIL'}\n`
    diagnostic += `Ticket contract OK: ${!ticketError ? 'PASS' : 'FAIL'}\n`
    diagnostic += `Event is Ticket owner: ${contractRelations.isEventTicketOwner ? 'PASS' : 'FAIL'}\n`
    diagnostic += `Valid contract relations: ${contractRelations.hasValidRelations ? 'PASS' : 'FAIL'}\n`

    setTestResult(diagnostic)
  }

  const handleTestBuy = async () => {
    if (!ticketPrice) {
      setTestResult('Error: No ticket price available')
      return
    }

    try {
      await testBuyTicket(eventAddress, ticketPrice)
      setTestResult(prev => prev + '\n\n=== BUY TICKET TEST ===\nTransaction submitted successfully!')
    } catch (err) {
      setTestResult(prev => prev + `\n\n=== BUY TICKET ERROR ===\n${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 Buy Ticket Debugger</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={runDiagnostic}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
        >
          Run Diagnostic
        </button>
        <button
          onClick={handleTestBuy}
          disabled={isPending || !ticketPrice}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {isPending ? 'Testing...' : 'Test Buy Ticket'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <h4 className="font-semibold text-red-800">Transaction Error:</h4>
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      )}

      {isConfirmed && (
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
          <h4 className="font-semibold text-green-800">Transaction Confirmed!</h4>
          <p className="text-green-700 text-sm">The buy ticket transaction was successful.</p>
        </div>
      )}

      {testResult && (
        <div className="bg-white border border-gray-300 rounded p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Diagnostic Result:</h4>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  )
}
