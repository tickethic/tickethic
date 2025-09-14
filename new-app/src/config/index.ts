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
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT || "0x9B04268174D1044D4CddF393Ffc565FfA9e3B806",
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT || "0x1e9798f47dcaAD79D176D386b9Ce1372DB355aFd",
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT || "0x2905062CAE74D089214Dc171f143EB1069E1d372",
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "0xbE7722828277A6A02Ce8734Fcb6C8D5228Fef4bE",
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT || "0x538ef0FE00f3cf0E82B61A84ec3997Ac565D3A2B"
} as const
