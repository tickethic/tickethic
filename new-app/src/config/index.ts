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
  Artist: "0xC3dA080Ecf60d29f50eB838519e068eB15Cd573f",
  Organizator: "0xB3A3D8164c1Fe87F7E9771f87eb1BFc074c2d06e",
  Ticket: "0x7DA7651cF179792985728151c9B336d966810Ae5",
  Event: "0x65B96123e53081D16F3405C4Db54a0b5fc492f4A",
  EventManager: "0xb566702544055969Ef08983F745Faf092F2f1976"
} as const
