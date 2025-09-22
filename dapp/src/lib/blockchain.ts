// Utilitaires pour les appels blockchain directs
import { contractAddresses } from '@/config'

// Artist ABI
export const ARTIST_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "artistId", "type": "uint256"}],
    "name": "getArtist",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "metadataURI", "type": "string"},
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextArtistId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Event ABI
export const EVENT_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "eventId", "type": "uint256"}],
    "name": "getEvent",
    "outputs": [
      {"internalType": "address", "name": "eventAddress", "type": "address"},
      {"internalType": "address", "name": "organizer", "type": "address"},
      {"internalType": "uint256", "name": "date", "type": "uint256"},
      {"internalType": "uint256", "name": "ticketPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "totalTickets", "type": "uint256"},
      {"internalType": "uint256", "name": "soldTickets", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "eventId", "type": "uint256"}],
    "name": "getEventMetadata",
    "outputs": [
      {"internalType": "string", "name": "metadataURI", "type": "string"},
      {"internalType": "uint256[]", "name": "artistIds", "type": "uint256[]"},
      {"internalType": "uint256[]", "name": "artistShares", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// EventManager ABI
export const EVENT_MANAGER_ABI = [
  {
    "inputs": [],
    "name": "nextEventId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Ticket ABI
export const TICKET_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface ArtistInfo {
  id: number
  name: string
  metadataURI: string
  owner: string
}

export interface EventInfo {
  eventAddress: string
  organizer: string
  date: bigint
  ticketPrice: bigint
  totalTickets: bigint
  soldTickets: bigint
}

export interface EventMetadata {
  metadataURI: string
  artistIds: bigint[]
  artistShares: bigint[]
}

export interface TicketInfo {
  tokenId: bigint
  tokenURI: string
}

// Fonction pour récupérer les informations d'un artiste
export async function getArtistInfo(artistId: number, readContract: any): Promise<ArtistInfo | null> {
  try {
    const result = await readContract({
      address: contractAddresses.Artist,
      abi: ARTIST_ABI,
      functionName: 'getArtist',
      args: [BigInt(artistId)]
    })
    
    if (result && result.length >= 3) {
      return {
        id: artistId,
        name: result[0],
        metadataURI: result[1],
        owner: result[2]
      }
    }
    return null
  } catch (error) {
    console.error(`Error fetching artist ${artistId}:`, error)
    return null
  }
}

// Fonction pour récupérer toutes les informations des artistes
export async function getAllArtistsInfo(nextArtistId: bigint, readContract: any): Promise<ArtistInfo[]> {
  const artists: ArtistInfo[] = []
  const totalArtists = Number(nextArtistId)
  
  for (let i = 1; i < totalArtists; i++) {
    const artist = await getArtistInfo(i, readContract)
    if (artist) {
      artists.push(artist)
    }
  }
  
  return artists
}

// Fonction pour récupérer les informations d'un événement
export async function getEventInfo(eventId: number, readContract: any): Promise<EventInfo | null> {
  try {
    const result = await readContract({
      address: contractAddresses.Event,
      abi: EVENT_ABI,
      functionName: 'getEvent',
      args: [BigInt(eventId)]
    })
    
    if (result && result.length >= 6) {
      return {
        eventAddress: result[0],
        organizer: result[1],
        date: result[2],
        ticketPrice: result[3],
        totalTickets: result[4],
        soldTickets: result[5]
      }
    }
    return null
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error)
    return null
  }
}

// Fonction pour récupérer les métadonnées d'un événement
export async function getEventMetadata(eventId: number, readContract: any): Promise<EventMetadata | null> {
  try {
    const result = await readContract({
      address: contractAddresses.Event,
      abi: EVENT_ABI,
      functionName: 'getEventMetadata',
      args: [BigInt(eventId)]
    })
    
    if (result && result.length >= 3) {
      return {
        metadataURI: result[0],
        artistIds: result[1],
        artistShares: result[2]
      }
    }
    return null
  } catch (error) {
    console.error(`Error fetching event metadata ${eventId}:`, error)
    return null
  }
}

// Fonction pour récupérer les tickets d'un utilisateur
export async function getUserTickets(userAddress: string, readContract: any): Promise<TicketInfo[]> {
  try {
    const balance = await readContract({
      address: contractAddresses.Ticket,
      abi: TICKET_ABI,
      functionName: 'balanceOf',
      args: [userAddress]
    })
    
    const tickets: TicketInfo[] = []
    const tokenCount = Number(balance)
    
    for (let i = 0; i < tokenCount; i++) {
      try {
        const tokenId = await readContract({
          address: contractAddresses.Ticket,
          abi: TICKET_ABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [userAddress, BigInt(i)]
        })
        
        const tokenURI = await readContract({
          address: contractAddresses.Ticket,
          abi: TICKET_ABI,
          functionName: 'tokenURI',
          args: [tokenId]
        })
        
        tickets.push({
          tokenId,
          tokenURI
        })
      } catch (error) {
        console.error(`Error fetching ticket ${i} for user ${userAddress}:`, error)
        continue
      }
    }
    
    return tickets
  } catch (error) {
    console.error(`Error fetching user tickets for ${userAddress}:`, error)
    return []
  }
}
