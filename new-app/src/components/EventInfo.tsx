'use client'

import { useReadContract } from 'wagmi'
import { contractAddresses } from '@/config'
import { EventArtistsList } from './EventArtistsList'

// Event ABI for reading event information
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

interface EventInfoProps {
  eventAddress: string
  date?: bigint
  ticketPrice?: bigint
  totalTickets?: bigint
  soldTickets?: bigint
  organizer?: string
  artistIds?: bigint[]
  artistShares?: bigint[]
}

export function EventInfo({ 
  eventAddress, 
  date: propDate, 
  ticketPrice: propTicketPrice, 
  totalTickets: propTotalTickets, 
  soldTickets: propSoldTickets, 
  organizer: propOrganizer,
  artistIds: propArtistIds,
  artistShares: propArtistShares
}: EventInfoProps) {
  // Use props if available, otherwise fetch from contract
  const { data: date, error: dateError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'date',
    query: { enabled: !propDate }
  })

  const { data: ticketPrice } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'ticketPrice',
    query: { enabled: !propTicketPrice }
  })

  const { data: soldTickets, error: soldTicketsError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'soldTickets',
    query: { enabled: !propSoldTickets }
  })

  const { data: totalTickets, error: totalTicketsError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'totalTickets',
    query: { enabled: !propTotalTickets }
  })

  const { data: organizer } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'organizer',
    query: { enabled: !propOrganizer }
  })

  const { data: artistIds, error: artistIdsError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistIds',
    query: { enabled: !propArtistIds }
  })

  const { data: artistShares, error: artistSharesError } = useReadContract({
    address: eventAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'getArtistShares',
    query: { enabled: !propArtistShares }
  })

  // Use props or fetched data
  const finalDate = propDate || date
  const finalTicketPrice = propTicketPrice || ticketPrice
  const finalSoldTickets = propSoldTickets || soldTickets
  const finalTotalTickets = propTotalTickets || totalTickets
  const finalOrganizer = propOrganizer || organizer
  const finalArtistIds = propArtistIds || artistIds
  const finalArtistShares = propArtistShares || artistShares

  const now = Math.floor(Date.now() / 1000)
  const eventDate = finalDate ? Number(finalDate) : 0
  const isEventInFuture = eventDate > now
  const isSoldOut = finalSoldTickets && finalTotalTickets ? Number(finalSoldTickets) >= Number(finalTotalTickets) : false
  const remainingTickets = finalSoldTickets && finalTotalTickets ? Number(finalTotalTickets) - Number(finalSoldTickets) : null
  const isLoadingTickets = !finalSoldTickets || !finalTotalTickets

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Informations de l'événement</h3>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <strong>Adresse du contrat :</strong>
          <div className="font-mono break-all">{eventAddress}</div>
        </div>
        
        <div>
          <strong>Organisateur :</strong>
          <div className="font-mono break-all">{finalOrganizer ? `${finalOrganizer.slice(0, 6)}...${finalOrganizer.slice(-4)}` : 'Chargement...'}</div>
        </div>
        
        <div className="col-span-2">
          <EventArtistsList eventAddress={eventAddress} />
        </div>
        
        <div>
          <strong>Date de l'événement :</strong>
          <div className={isEventInFuture ? 'text-green-600' : 'text-red-600'}>
            {eventDate ? new Date(eventDate * 1000).toLocaleString('fr-FR') : 'Chargement...'}
            {isEventInFuture ? ' ✅' : ' ❌ (Passé)'}
          </div>
        </div>
        
        <div>
          <strong>Heure actuelle :</strong>
          <div>{new Date(now * 1000).toLocaleString('fr-FR')}</div>
        </div>
        
        <div>
          <strong>Prix du billet :</strong>
          <div className="font-mono">
            {finalTicketPrice ? `${(Number(finalTicketPrice) / 1e18).toFixed(4)} ETH` : 'Chargement...'}
          </div>
        </div>
        
        <div>
          <strong>Statut des billets :</strong>
          <div className={isSoldOut ? 'text-red-600' : 'text-green-600'}>
            {finalSoldTickets && finalTotalTickets ? `${Number(finalSoldTickets)}/${Number(finalTotalTickets)}` : 'Chargement...'}
            {isSoldOut ? ' ❌ (Complet)' : ' ✅'}
          </div>
        </div>
        
        <div>
          <strong>Billets restants :</strong>
          <div className={isLoadingTickets ? 'text-gray-500' : (remainingTickets && remainingTickets > 0 ? 'text-green-600' : 'text-red-600')}>
            {isLoadingTickets ? 'Chargement...' : `${remainingTickets} billets`}
          </div>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
        <strong className="text-yellow-800">Problèmes potentiels :</strong>
        <ul className="text-yellow-700 text-xs mt-1 space-y-1">
          {!isEventInFuture && <li>• La date de l'événement est dans le passé</li>}
          {isSoldOut && <li>• Tous les billets sont vendus</li>}
          {remainingTickets === 0 && !isSoldOut && !isLoadingTickets && <li>• Aucun billet disponible</li>}
          {artistIds && artistIds.length === 0 && <li>• Aucun artiste configuré</li>}
          {artistShares && artistShares.some(s => Number(s) === 0) && <li>• Certains artistes ont 0% de parts</li>}
        </ul>
      </div>

      {/* Erreurs de contrat */}
      {(dateError || soldTicketsError || totalTicketsError || artistIdsError || artistSharesError) && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <strong className="text-red-800">Erreurs de contrat :</strong>
          <ul className="text-red-700 text-xs mt-1 space-y-1">
            {dateError && <li>• Erreur de date : {dateError.message}</li>}
            {soldTicketsError && <li>• Erreur billets vendus : {soldTicketsError.message}</li>}
            {totalTicketsError && <li>• Erreur total billets : {totalTicketsError.message}</li>}
            {artistIdsError && <li>• Erreur IDs artistes : {artistIdsError.message}</li>}
            {artistSharesError && <li>• Erreur parts artistes : {artistSharesError.message}</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
