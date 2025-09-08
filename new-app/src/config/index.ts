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

// Contract addresses
export const contractAddresses = {
  Artist: "0x31Da0B05B3537e9540B8b76C643BcB123428DA98",
  Organizator: "0x189441313F6ca0Ea2103b9a5F4bBC13fE02E6D8a",
  Ticket: "0x1e3119708Fb88FFAd1b5D7A3A030c1A76a7Dc70E",
  Event: "0x271D35FF1E6D8e41cfA451A39dE90bfdF85b44B1",
  EventManager: "0x9D04429C5ec6ea8dcdEe0f0D8D6E06e8d291ACcc"
} as const
