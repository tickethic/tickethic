'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { useEventInfo, useEventMetadata } from '@/hooks/useEvents'
import { CheckoutForm } from '@/components/CheckoutForm'
import { EventArtistsList } from '@/components/EventArtistsList'
import { Calendar, MapPin, Users, Ticket, Clock, ArrowLeft } from 'lucide-react'

export function CheckoutPageClient() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useWallet()
  const eventId = Number(params.eventId)
  
  const { eventInfo, isLoading } = useEventInfo(eventId)
  const { metadataURI, artistIds, artistShares } = useEventMetadata(eventInfo?.[0] || '')
  
  const [eventName, setEventName] = useState<string>('')
  const [eventDescription, setEventDescription] = useState<string>('')
  const [eventImage, setEventImage] = useState<string>('')
  const [eventLocation, setEventLocation] = useState<string>('')
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)

  // Fetch event metadata
  useEffect(() => {
    if (metadataURI && metadataURI !== '') {
      setIsLoadingMetadata(true)
      
      // Utiliser les appels IPFS directs
      const fetchMetadata = async () => {
        try {
          const { fetchMetadata } = await import('@/lib/ipfs')
          const data = await fetchMetadata(metadataURI)
          setEventName(data.name || `Événement #${eventId}`)
          setEventDescription(data.description || '')
          setEventImage(data.image || '')
          setEventLocation(data.location || '')
        } catch (error) {
          console.error('Error fetching event metadata:', error)
          setEventName(`Événement #${eventId}`)
        } finally {
          setIsLoadingMetadata(false)
        }
      }
      
      fetchMetadata()
    } else {
      setEventName(`Événement #${eventId}`)
    }
  }, [metadataURI, eventId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!eventInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Événement non trouvé</h1>
          <p className="text-gray-600 mb-8">L'événement que vous recherchez n'existe pas.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux événements
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLoadingMetadata ? 'Chargement...' : (eventName || `Événement #${eventId}`)}
          </h1>
          
          {eventDescription && (
            <p className="text-gray-600 text-lg">{eventDescription}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Détails de l'événement</h2>
            
            {/* Event Image */}
            {eventImage && (
              <div className="mb-6">
                <img 
                  src={eventImage} 
                  alt={eventName || `Événement #${eventId}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Event Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">
                    {eventDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {eventDate.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>

              {eventLocation && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{eventLocation}</span>
                </div>
              )}

              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-3" />
                <span>Organisateur: {formatAddress(organizer)}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Ticket className="w-5 h-5 mr-3" />
                <span>
                  {soldTickets.toString()} / {totalTickets.toString()} billets vendus
                </span>
              </div>
            </div>

            {/* Artists */}
            {artistIds && artistIds.length > 0 && (
              <div className="mb-6">
                <EventArtistsList eventAddress={eventAddress} />
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Prix du billet</div>
                <div className="text-2xl font-bold text-purple-600">{formattedPrice}</div>
              </div>
              <div className="text-right">
                {isPastEvent ? (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    Terminé
                  </span>
                ) : isSoldOut ? (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                    Complet
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                    Disponible
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {!isConnected ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Connectez votre wallet
                </h3>
                <p className="text-gray-600 mb-6">
                  Vous devez connecter votre wallet pour acheter un billet.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
                >
                  Retour à l'accueil
                </button>
              </div>
            ) : isPastEvent ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Événement terminé
                </h3>
                <p className="text-gray-600 mb-6">
                  Cet événement est déjà terminé.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
                >
                  Voir d'autres événements
                </button>
              </div>
            ) : isSoldOut ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Événement complet
                </h3>
                <p className="text-gray-600 mb-6">
                  Tous les billets ont été vendus.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
                >
                  Voir d'autres événements
                </button>
              </div>
            ) : (
              <CheckoutForm
                eventId={eventId}
                eventAddress={eventAddress}
                ticketPrice={ticketPrice}
                totalTickets={totalTickets}
                soldTickets={soldTickets}
                eventName={eventName || `Événement #${eventId}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
