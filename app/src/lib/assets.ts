import { mainnet, sepolia } from "viem/chains";

import { Asset } from "@/lib/types";

export const ETH: Asset = {
  name: "Ethereum",
  symbol: "ETH",
  address: "0x0000000000000000000000000000000000000000",
  decimals: 18,
};

export const USDC: Asset = {
  name: "USD Coin",
  symbol: "USDC",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  decimals: 6,
};

export const assets: Record<number, Asset[]> = {
  [mainnet.id]: [ETH, USDC],
  [sepolia.id]: [ETH, USDC],
};
