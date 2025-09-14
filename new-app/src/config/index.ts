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

// Contract addresses - will throw error if environment variables are missing
export const contractAddresses = {
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT!,
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT!,
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT!,
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT!,
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT!
} as const

// Validate that all required environment variables are present
const requiredEnvVars = [
  'NEXT_PUBLIC_ARTIST_CONTRACT',
  'NEXT_PUBLIC_ORGANIZATOR_CONTRACT', 
  'NEXT_PUBLIC_TICKET_CONTRACT',
  'NEXT_PUBLIC_EVENT_CONTRACT',
  'NEXT_PUBLIC_EVENT_MANAGER_CONTRACT'
] as const

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
}
