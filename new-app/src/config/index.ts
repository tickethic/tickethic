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
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT || "0xbeb15C97531a350cd05D6D16FCFE32A27Ce51A88",
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT || "0x197E63ea5Ed134060d0F296c51201DF254256666",
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT || "0xCCBa1170bF3Da4B5d18242291Dfa286Ceb3c66Ea",
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "0x6Eb80Bf14e7aB4f7778Cc872aE07E4E2993e03c1",
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT || "0x201824aeB856cf87a5F1c7CcD29fCF0122eF3d9F"
} as const
