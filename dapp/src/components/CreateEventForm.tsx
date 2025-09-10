'use client'
import { useState } from 'react'
import { useWriteContract, useAccount } from 'wagmi'
import { parseAbi } from 'viem'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/config/contracts'
import { ArtistList } from './ArtistList'

// EventManager contract address and ABI
const EVENT_MANAGER_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.EVENT_MANAGER
const EVENT_MANAGER_ABI = parseAbi(CONTRACT_ABIS.EVENT_MANAGER)

interface CreateEventFormProps {
  onEventCreated?: (eventId: number, eventAddress: string) => void
  onCancel?: () => void
}

export const CreateEventForm = ({ onEventCreated, onCancel }: CreateEventFormProps) => {
  const { address } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  // Form state
  const [selectedArtists, setSelectedArtists] = useState<number[]>([])
  const [artistShares, setArtistShares] = useState<{ [key: number]: number }>({})
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [totalTickets, setTotalTickets] = useState('')
  const [metadataURI, setMetadataURI] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleArtistSelect = (artistId: number) => {
    if (selectedArtists.includes(artistId)) {
      // Remove artist
      setSelectedArtists(prev => prev.filter(id => id !== artistId))
      setArtistShares(prev => {
        const newShares = { ...prev }
        delete newShares[artistId]
        return newShares
      })
    } else {
      // Add artist
      setSelectedArtists(prev => [...prev, artistId])
      setArtistShares(prev => ({
        ...prev,
        [artistId]: 0
      }))
    }
  }

  const handleShareChange = (artistId: number, share: number) => {
    setArtistShares(prev => ({
      ...prev,
      [artistId]: share
    }))
  }

  const calculateTotalShare = () => {
    return Object.values(artistShares).reduce((sum, share) => sum + share, 0)
  }

  const validateForm = () => {
    if (!eventName.trim()) {
      setError('Event name is required')
      return false
    }
    if (!eventDate) {
      setError('Event date is required')
      return false
    }
    if (new Date(eventDate) <= new Date()) {
      setError('Event date must be in the future')
      return false
    }
    if (!ticketPrice || parseFloat(ticketPrice) <= 0) {
      setError('Ticket price must be greater than 0')
      return false
    }
    if (!totalTickets || parseInt(totalTickets) <= 0) {
      setError('Total tickets must be greater than 0')
      return false
    }
    if (selectedArtists.length === 0) {
      setError('At least one artist must be selected')
      return false
    }
    if (calculateTotalShare() > 100) {
      setError('Total artist shares cannot exceed 100%')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    if (!address) {
      setError('Please connect your wallet')
      return
    }

    try {
      // Prepare artist IDs and shares arrays
      const artistIds = selectedArtists
      const shares = selectedArtists.map(id => artistShares[id] || 0)

      // Convert date to timestamp
      const eventTimestamp = Math.floor(new Date(eventDate).getTime() / 1000)

      // Convert ticket price to wei (assuming ETH)
      const ticketPriceWei = BigInt(Math.floor(parseFloat(ticketPrice) * 1e18))

      // Create event
      const result = await writeContractAsync({
        address: EVENT_MANAGER_CONTRACT_ADDRESS,
        abi: EVENT_MANAGER_ABI,
        functionName: 'createEvent',
        args: [
          artistIds,
          shares,
          address, // organizer
          BigInt(eventTimestamp),
          metadataURI || `ipfs://event-${Date.now()}`,
          ticketPriceWei,
          BigInt(parseInt(totalTickets))
        ]
      })

      // Extract event ID and address from result (this might need adjustment based on actual return format)
      console.log('Event created:', result)
      
      if (onEventCreated) {
        // Note: You might need to parse the result differently based on the actual return format
        onEventCreated(1, result as string) // Placeholder values
      }

      // Reset form
      setSelectedArtists([])
      setArtistShares({})
      setEventName('')
      setEventDescription('')
      setEventDate('')
      setTicketPrice('')
      setTotalTickets('')
      setMetadataURI('')

    } catch (error) {
      console.error('Failed to create event:', error)
      setError('Failed to create event. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event name"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date *
            </label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Price (ETH) *
            </label>
            <input
              type="number"
              step="0.001"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.1"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Tickets *
            </label>
            <input
              type="number"
              value={totalTickets}
              onChange={(e) => setTotalTickets(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Description
          </label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe your event..."
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metadata URI (IPFS)
          </label>
          <input
            type="text"
            value={metadataURI}
            onChange={(e) => setMetadataURI(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ipfs://..."
            disabled={isPending}
          />
        </div>

        {/* Artist Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Artists</h3>
          <ArtistList
            onArtistSelect={handleArtistSelect}
            selectedArtists={selectedArtists}
            multiSelect={true}
          />
        </div>

        {/* Artist Shares */}
        {selectedArtists.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Artist Revenue Shares (Total: {calculateTotalShare()}%)
            </h3>
            <div className="space-y-3">
              {selectedArtists.map(artistId => (
                <div key={artistId} className="flex items-center space-x-4">
                  <span className="w-32 text-sm">Artist {artistId}:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={artistShares[artistId] || 0}
                    onChange={(e) => handleShareChange(artistId, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    disabled={isPending}
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              ))}
            </div>
            {calculateTotalShare() > 100 && (
              <p className="text-red-600 text-sm mt-2">
                Total shares cannot exceed 100%
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isPending || calculateTotalShare() > 100}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating Event...' : 'Create Event'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
