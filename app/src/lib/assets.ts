import {
  arbitrumSepolia,
  baseSepolia,
  mainnet,
  morphHolesky,
  scrollSepolia,
  sepolia,
  // zircuitTestnet,
} from "viem/chains";

import { Asset, ChainId } from "@/lib/types";

export const BTC: Asset = {
  name: "Bitcoin",
  symbol: "BTC",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  decimals: 18,
  oraclePriceIndex: 0,
};

export const ETH: Asset = {
  name: "Ethereum",
  symbol: "ETH",
  address: "0x0000000000000000000000000000000000000000",
  decimals: 18,
  oraclePriceIndex: 1,
};

export const assets: Record<ChainId, Asset[]> = {
  [mainnet.id]: [BTC, ETH],
  [sepolia.id]: [BTC, ETH],
  [arbitrumSepolia.id]: [BTC, ETH],
  [baseSepolia.id]: [BTC, ETH],
  [scrollSepolia.id]: [BTC, ETH],
  [morphHolesky.id]: [BTC, ETH],
  // [zircuitTestnet.id]: [BTC, ETH],
};
