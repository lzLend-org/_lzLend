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

export const addresses: Record<string, []> = {};

export const POOL_SRC_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [sepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [arbitrumSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [baseSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [scrollSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [morphHolesky.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  // [zircuitTestnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};

export const POOL_DST_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [sepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [arbitrumSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [baseSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [scrollSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [morphHolesky.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  // [zircuitTestnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};

export const ORACLE_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [sepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [arbitrumSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [baseSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [scrollSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [morphHolesky.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  // [zircuitTestnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};
