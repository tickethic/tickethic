'use client'
import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/config/contracts'
import { useState, useEffect } from 'react'

// Artist contract address and ABI
const ARTIST_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.ARTIST
const ARTIST_ABI = parseAbi(CONTRACT_ABIS.ARTIST)

interface Artist {
  id: number
  name: string
  owner: string
  metadataURI: string
}

interface ArtistListProps {
  onArtistSelect?: (artistId: number) => void
  selectedArtists?: number[]
  multiSelect?: boolean
}

export const ArtistList = ({ onArtistSelect, selectedArtists = [], multiSelect = false }: ArtistListProps) => {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get total number of artists
  const { data: totalArtists } = useReadContract({
    address: ARTIST_CONTRACT_ADDRESS,
    abi: ARTIST_ABI,
    functionName: 'getTotalArtists',
  })

  // Fetch all artists
  useEffect(() => {
    const fetchArtists = async () => {
      if (!totalArtists || totalArtists === BigInt(0)) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const artistPromises = []
        
        // Create promises for each artist using direct contract calls
        for (let i = 1; i <= Number(totalArtists); i++) {
          artistPromises.push(
            // For now, create mock data - in a real app you'd call the contract directly
            Promise.resolve({
              id: i,
              name: `Artist ${i}`,
              owner: '0x0000000000000000000000000000000000000000',
              metadataURI: `ipfs://artist${i}`
            })
          )
        }

        const artistData = await Promise.all(artistPromises)
        setArtists(artistData)
      } catch (err) {
        console.error('Error fetching artists:', err)
        setError('Failed to load artists')
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [totalArtists])

  const handleArtistClick = (artistId: number) => {
    if (onArtistSelect) {
      onArtistSelect(artistId)
    }
  }

  const isSelected = (artistId: number) => {
    return selectedArtists.includes(artistId)
  }

  if (loading) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Available Artists</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading artists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Available Artists</h3>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (artists.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Available Artists</h3>
        <div className="text-center py-8">
          <p className="text-gray-600">No artists registered yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Available Artists ({artists.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => handleArtistClick(artist.id)}
            className={`
              p-4 border rounded-lg cursor-pointer transition-all duration-200
              ${isSelected(artist.id) 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
              ${multiSelect ? 'hover:bg-gray-50' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{artist.name}</h4>
                <p className="text-sm text-gray-500">ID: {artist.id}</p>
                <p className="text-xs text-gray-400 truncate">
                  {artist.owner.slice(0, 6)}...{artist.owner.slice(-4)}
                </p>
              </div>
              {multiSelect && (
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  ${isSelected(artist.id) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {isSelected(artist.id) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
