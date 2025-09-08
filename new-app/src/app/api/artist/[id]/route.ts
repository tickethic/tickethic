import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

// Artist ABI
const ARTIST_ABI = [
  {
    "inputs": [],
    "name": "nextArtistId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "artistId", "type": "uint256"}],
    "name": "getArtistInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "metadataURI", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract addresses
const contractAddresses = {
  Artist: "0x31Da0B05B3537e9540B8b76C643BcB123428DA98",
  Organizator: "0x189441313F6ca0Ea2103b9a5F4bBC13fE02E6D8a",
  Ticket: "0x1e3119708Fb88FFAd1b5D7A3A030c1A76a7Dc70E",
  Event: "0x271D35FF1E6D8e41cfA451A39dE90bfdF85b44B1",
  EventManager: "0x9D04429C5ec6ea8dcdEe0f0D8D6E06e8d291ACcc"
} as const

// Create public client
const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = parseInt(params.id)
    
    if (isNaN(artistId) || artistId <= 0) {
      return NextResponse.json(
        { error: 'Invalid artist ID' },
        { status: 400 }
      )
    }

    // Get artist info from contract
    const [artistInfo, owner] = await Promise.all([
      publicClient.readContract({
        address: contractAddresses.Artist,
        abi: ARTIST_ABI,
        functionName: 'getArtistInfo',
        args: [BigInt(artistId)]
      }),
      publicClient.readContract({
        address: contractAddresses.Artist,
        abi: ARTIST_ABI,
        functionName: 'ownerOf',
        args: [BigInt(artistId)]
      })
    ])

    const artistData = {
      id: artistId,
      name: artistInfo[0],
      metadataURI: artistInfo[1],
      owner: owner
    }

    return NextResponse.json(artistData)
  } catch (error) {
    console.error('Error fetching artist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artist data' },
      { status: 500 }
    )
  }
}
