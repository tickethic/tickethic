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
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT || "0x7B052c33b0891BC9712F0066227C960eE30241c4",
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT || "0x2477bfa765ce253dfbaaBc8c677506e095f2488B",
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT || "0xD184dE552Be7D6Af084f8741bF855174139c0c7A",
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "0xEcCDD59fFEB4144Ba0fC8543aD39e975544286D2",
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT || "0xA7217E509bCc131Ab16ed154d2eCB282B22fCDeb"
} as const
