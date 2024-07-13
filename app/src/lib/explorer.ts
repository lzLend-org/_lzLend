import {
  arbitrumSepolia,
  baseSepolia,
  mainnet,
  morphHolesky,
  scrollSepolia,
  sepolia,
  // zircuitTestnet,
} from "viem/chains";

import { ChainId } from "@/lib/types";

export const EXPLORER_URL: Record<ChainId, string> = {
  [mainnet.id]: "https://eth.blockscout.com",
  [sepolia.id]: "https://eth-sepolia.blockscout.com",
  [arbitrumSepolia.id]: "https://sepolia-explorer.arbitrum.io",
  [baseSepolia.id]: "https://base-sepolia.blockscout.com",
  [scrollSepolia.id]: "https://sepolia.scrollscan.com",
  [morphHolesky.id]: "https://explorer-testnet.morphl2.io/",
  // [zircuitTestnet.id]: "https://explorer.zircuit.com/",
};

export function getExplorerAddressUrl(chainId: ChainId, address: string) {
  return `${EXPLORER_URL[chainId]}/address/${address}`;
}

export function getExplorerTransactionUrl(chainId: ChainId, txHash: string) {
  return `${EXPLORER_URL[chainId]}/tx/${txHash}`;
}
