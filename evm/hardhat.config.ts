import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const AMOY_RPC_URL = process.env.AMOY_RPC_URL || "";
const AMOY_PRIVATE_KEY = process.env.AMOY_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  networks: {
    localhost: {
      type: "hardhat",
    },
    amoy: {
      type: "http",
      url: AMOY_RPC_URL,
      accounts: AMOY_PRIVATE_KEY ? [AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};

export default config;
