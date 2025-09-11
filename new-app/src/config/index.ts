import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { polygonAmoy } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "48bf2d8d1236d3befa190b22c42ef96b" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [polygonAmoy] as [AppKitNetwork, ...AppKitNetwork[]]

// Configuration pour Reown AppKit
export const appKitConfig = {
  projectId,
  networks,
  // Configuration pour éviter l'erreur "Invalid App Configuration"
  metadata: {
    name: 'Tickethic',
    description: 'Tickethic - Plateforme de tickets NFT',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://tickethic.ch',
    icons: ['https://tickethic.ch/favicon.ico']
  }
}

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
  metadata: appKitConfig.metadata
})

export const config = wagmiAdapter.wagmiConfig

// Contract addresses (updated to latest deployed versions)
export const contractAddresses = {
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT || "0xc21F137FecF80Cf9cBF7c4d65CaE56E78156f911",
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT || "0x1DD874A39Ff352741Ec585435747f94a5dbD20B5",
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT || "0x5C7ABd7b9049297135AD88b5781c0ED74eF821ed",
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "0x48888a4C7183033C6e8a832A85fcCf256a185F46",
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT || "0x7a4Bb066613A838F6fbd806f8Afdc26fffAfcaB1"
} as const
