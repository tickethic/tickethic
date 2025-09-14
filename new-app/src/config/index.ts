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

// Contract addresses with fallbacks
export const contractAddresses = {
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT || "0x726D177E3F7f7e727Cbd4f109eD712fa5D09C989",
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT || "0x2BCBd0d867cccfEF9746C3400c16512460011407",
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT || "0x25F13fC9413d6969dBee5f686b20c71Aa2273505",
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "0x7a18BCd38346BBd2A99b7C1740270450e4Ef063b",
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT || "0xd23a1dF74d3E56D2B1aba069F2735FEe197F051f"
} as const
