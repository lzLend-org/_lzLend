import "@nomicfoundation/hardhat-toolbox-viem"
import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config"
import "./scripts/deploy"
import "./scripts/deployOracles"
import "./scripts/generate"
import "./scripts/interact"

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.24" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.ankr.com/eth_sepolia",
      accounts,
    },
    optimism_sepolia: {
      url: process.env.OPTIMISM_SEPOLIA_RPC_URL || "https://rpc.ankr.com/optimism_sepolia",
      accounts,
    },
    coston2: {
      url: process.env.COSTON2_RPC_URL || "https://coston2-api.flare.network/ext/C/rpc",
      accounts,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc.ankr.com/polygon_mumbai",
      accounts,
    },
    fiji: {
      url: process.env.FUJI_RPC_URL || "https://avalanche-fuji-c-chain-rpc.publicnode.com",
      accounts,
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
