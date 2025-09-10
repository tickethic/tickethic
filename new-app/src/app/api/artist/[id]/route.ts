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

// Contract addresses from environment variables
const contractAddresses = {
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT || "0xC0a9A064450EE8f7Fd9A954b558A75027544D239",
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT || "0x80b24c6F73662097ab0849848AB467002EDe6756",
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT || "0x1cD35f2051D8BE9727529f45797acaaD4BfD85bA",
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "0xaa71da205cEE3C513BfD044129790B74442239Ed",
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT || "0xb566702544055969Ef08983F745Faf092F2f1976"
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
