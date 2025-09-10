import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { polygonAmoy } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "48bf2d8d1236d3befa190b22c42ef96b" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [polygonAmoy] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

// Contract addresses (updated to latest deployed versions)
export const contractAddresses = {
  Artist: process.env.NEXT_PUBLIC_ARTIST_CONTRACT || "0xC0a9A064450EE8f7Fd9A954b558A75027544D239",
  Organizator: process.env.NEXT_PUBLIC_ORGANIZATOR_CONTRACT || "0x80b24c6F73662097ab0849848AB467002EDe6756",
  Ticket: process.env.NEXT_PUBLIC_TICKET_CONTRACT || "0x1cD35f2051D8BE9727529f45797acaaD4BfD85bA",
  Event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "0xaa71da205cEE3C513BfD044129790B74442239Ed",
  EventManager: process.env.NEXT_PUBLIC_EVENT_MANAGER_CONTRACT || "0xb566702544055969Ef08983F745Faf092F2f1976"
} as const
