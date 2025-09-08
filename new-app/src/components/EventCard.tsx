'use client'

import { Calendar, MapPin, Users, Ticket, Clock } from 'lucide-react'
import { useEventInfo, useEventMetadata } from '@/hooks/useEvents'
import { useState, useEffect } from 'react'

interface EventCardProps {
  eventId: number
}

export function EventCard({ eventId }: EventCardProps) {
  const { eventInfo, isLoading } = useEventInfo(eventId)
  const { metadataURI, artistIds } = useEventMetadata(eventInfo?.[0] || '')
  const [eventName, setEventName] = useState<string>('')
  const [eventDescription, setEventDescription] = useState<string>('')
  const [eventImage, setEventImage] = useState<string>('')
  const [eventLocation, setEventLocation] = useState<string>('')
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)

  // Fetch event metadata when metadataURI is available
  useEffect(() => {
    if (metadataURI && metadataURI !== '') {
      console.log(`EventCard ${eventId}: Fetching metadata for URI:`, metadataURI)
      setIsLoadingMetadata(true)
      
      // Fetch metadata from API
      fetch(`/api/event-metadata?uri=${encodeURIComponent(metadataURI)}`)
        .then(response => response.json())
        .then(data => {
          console.log(`EventCard ${eventId}: Received metadata:`, data)
          setEventName(data.name || `Événement #${eventId}`)
          setEventDescription(data.description || '')
          setEventImage(data.image || '')
          setEventLocation(data.location || '')
        })
        .catch(error => {
          console.error('Error fetching event metadata:', error)
          setEventName(`Événement #${eventId}`)
          setEventDescription('')
          setEventImage('')
          setEventLocation('')
        })
        .finally(() => {
          setIsLoadingMetadata(false)
        })
    } else {
      setEventName(`Événement #${eventId}`)
    }
  }, [metadataURI, eventId])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    )
  }

  if (!eventInfo) {
    return null
  }

  const [eventAddress, organizer, date, ticketPrice, totalTickets, soldTickets] = eventInfo

  // Format date
  const eventDate = new Date(Number(date) * 1000)
  const isPastEvent = eventDate < new Date()
  const isSoldOut = soldTickets >= totalTickets

  // Format price (assuming price is in wei)
  const priceInEth = Number(ticketPrice) / 1e18
  const formattedPrice = priceInEth > 0 ? `${priceInEth.toFixed(4)} ETH` : 'Gratuit'

  // Format address
  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
      isPastEvent ? 'opacity-60' : ''
    }`}>
      {/* Event Image */}
      {eventImage && (
        <div className="h-48 bg-gray-200">
          <img 
            src={eventImage} 
            alt={eventName || `Événement #${eventId}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {isLoadingMetadata ? 'Chargement...' : (eventName || `Événement #${eventId}`)}
        </h3>

        {/* Event Description */}
        {eventDescription && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {eventDescription}
          </p>
        )}

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{eventDate.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{eventDate.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>Organisateur: {formatAddress(organizer)}</span>
        </div>

        {eventLocation && (
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{eventLocation}</span>
          </div>
        )}

        {artistIds && artistIds.length > 0 && (
          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2" />
            <span>{artistIds.length} artiste{artistIds.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Ticket Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {soldTickets.toString()} / {totalTickets.toString()} billets vendus
        </div>
        <div className="text-lg font-bold text-purple-600">
          {formattedPrice}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${totalTickets > 0 ? (Number(soldTickets) / Number(totalTickets)) * 100 : 0}%` 
          }}
        ></div>
      </div>

      {/* Status and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {isPastEvent && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              Terminé
            </span>
          )}
          {isSoldOut && !isPastEvent && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
              Complet
            </span>
          )}
          {!isPastEvent && !isSoldOut && (
            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
              Disponible
            </span>
          )}
        </div>

        {!isPastEvent && !isSoldOut && (
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
            Acheter un billet
          </button>
        )}
      </div>

      {/* Metadata URI if available */}
      {metadataURI && (
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Métadonnées: {metadataURI}
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
