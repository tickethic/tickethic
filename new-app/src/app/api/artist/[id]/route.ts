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
  Artist: "0xC3dA080Ecf60d29f50eB838519e068eB15Cd573f",
  Organizator: "0xB3A3D8164c1Fe87F7E9771f87eb1BFc074c2d06e",
  Ticket: "0x7DA7651cF179792985728151c9B336d966810Ae5",
  Event: "0x65B96123e53081D16F3405C4Db54a0b5fc492f4A",
  EventManager: "0xb566702544055969Ef08983F745Faf092F2f1976"
} as const

// Create public client
const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const artistId = parseInt(id)
    
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
