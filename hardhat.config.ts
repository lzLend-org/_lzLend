import "@nomicfoundation/hardhat-toolbox-viem"
import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config"
import "./scripts/deploy"
import "./scripts/generate"
import "./scripts/push"
import "./scripts/peers"
import "hardhat-contract-sizer"

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.24" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },  
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://endpoints.omniatech.io/v1/eth/sepolia/public",
      accounts,
    },
    optimism_sepolia: {
      url: process.env.OPTIMISM_SEPOLIA_RPC_URL || "https://rpc.ankr.com/optimism_sepolia",
      accounts,
    },
    arbitrum_sepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
      accounts
    },
    zircuit_sepolia: {
      url: process.env.ZIRCUIT_SEPOLIA_RPC_URL || "https://zircuit1.p2pify.com",
      accounts
    },
    coston2: {
      url: process.env.COSTON2_RPC_URL || "https://coston2-api.flare.network/ext/C/rpc",
      accounts,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc.ankr.com/polygon_mumbai",
      accounts,
    },
    fuji: {
      url: process.env.FUJI_RPC_URL || "https://avalanche-fuji-c-chain-rpc.publicnode.com",
      accounts,
    },
    scroll_sepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC_URL || "https://sepolia-rpc.scroll.io",
      accounts
    },
    linea_sepolia: {
      url:
        process.env.LINEA_SEPOLIA_RPC_URL || `https://rpc.sepolia.linea.build`,
      accounts,
    },
  },
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY",
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  mocha: {
    timeout: 20000,
  },
  sourcify: {
    enabled: true,
  },
}

export default config
