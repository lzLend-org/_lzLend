import { arbitrumSepolia, baseSepolia, mainnet, sepolia } from "viem/chains";

import { ChainId } from "@/lib/types";

export const addresses: Record<string, []> = {};

export const POOL_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [sepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [arbitrumSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [baseSepolia.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};
