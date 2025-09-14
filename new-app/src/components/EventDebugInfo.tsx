'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'

// Event ABI for debugging
const EVENT_ABI = [
  {
    "inputs": [],
    "name": "date",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
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
    "name": "soldTickets",
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
    "name": "organizer",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
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

interface EventDebugInfoProps {
  eventAddress: string
}

export function EventDebugInfo({ eventAddress }: EventDebugInfoProps) {
  const { data: date, error: dateError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'date',
  })

  const { data: ticketPrice } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'ticketPrice',
  })

  const { data: soldTickets, error: soldTicketsError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'soldTickets',
  })

  const { data: totalTickets, error: totalTicketsError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'totalTickets',
  })

  const { data: organizer } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'organizer',
  })

  const { data: artistIds, error: artistIdsError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistIds',
  })

  const { data: artistShares, error: artistSharesError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistShares',
  })

  const now = Math.floor(Date.now() / 1000)
  const eventDate = date ? Number(date) : 0
  const isEventInFuture = eventDate > now
  const isSoldOut = soldTickets && totalTickets ? Number(soldTickets) >= Number(totalTickets) : false
  const remainingTickets = soldTickets && totalTickets ? Number(totalTickets) - Number(soldTickets) : 0

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Debug Info - Event Contract</h3>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <strong>Event Address:</strong>
          <div className="font-mono break-all">{eventAddress}</div>
        </div>
        
        <div>
          <strong>Organizer:</strong>
          <div className="font-mono break-all">{organizer ? `${organizer.slice(0, 6)}...${organizer.slice(-4)}` : 'Loading...'}</div>
        </div>
        
        <div>
          <strong>Event Date:</strong>
          <div className={isEventInFuture ? 'text-green-600' : 'text-red-600'}>
            {eventDate ? new Date(eventDate * 1000).toLocaleString() : 'Loading...'}
            {isEventInFuture ? ' ✅' : ' ❌ (Past)'}
          </div>
        </div>
        
        <div>
          <strong>Current Time:</strong>
          <div>{new Date(now * 1000).toLocaleString()}</div>
        </div>
        
        <div>
          <strong>Ticket Price:</strong>
          <div className="font-mono">
            {ticketPrice ? `${(Number(ticketPrice) / 1e18).toFixed(4)} ETH` : 'Loading...'}
          </div>
        </div>
        
        <div>
          <strong>Tickets Status:</strong>
          <div className={isSoldOut ? 'text-red-600' : 'text-green-600'}>
            {soldTickets && totalTickets ? `${Number(soldTickets)}/${Number(totalTickets)}` : 'Loading...'}
            {isSoldOut ? ' ❌ (Sold Out)' : ' ✅'}
          </div>
        </div>
        
        <div>
          <strong>Remaining:</strong>
          <div className={remainingTickets > 0 ? 'text-green-600' : 'text-red-600'}>
            {remainingTickets} tickets
          </div>
        </div>
        
        <div>
          <strong>Artists:</strong>
          <div>
            {artistIds && artistShares ? 
              `${artistIds.length} artists (${artistShares.map(s => Number(s)).join(', ')}% shares)` : 
              'Loading...'
            }
          </div>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
        <strong className="text-yellow-800">Possible Issues:</strong>
        <ul className="text-yellow-700 text-xs mt-1 space-y-1">
          {!isEventInFuture && <li>• Event date is in the past</li>}
          {isSoldOut && <li>• All tickets are sold out</li>}
          {remainingTickets === 0 && !isSoldOut && <li>• No tickets available</li>}
          {artistIds && artistIds.length === 0 && <li>• No artists configured</li>}
          {artistShares && artistShares.some(s => Number(s) === 0) && <li>• Some artists have 0% share</li>}
        </ul>
      </div>

      {/* Contract Errors */}
      {(dateError || soldTicketsError || totalTicketsError || artistIdsError || artistSharesError) && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <strong className="text-red-800">Contract Errors:</strong>
          <ul className="text-red-700 text-xs mt-1 space-y-1">
            {dateError && <li>• Date error: {dateError.message}</li>}
            {soldTicketsError && <li>• Sold tickets error: {soldTicketsError.message}</li>}
            {totalTicketsError && <li>• Total tickets error: {totalTicketsError.message}</li>}
            {artistIdsError && <li>• Artist IDs error: {artistIdsError.message}</li>}
            {artistSharesError && <li>• Artist shares error: {artistSharesError.message}</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
