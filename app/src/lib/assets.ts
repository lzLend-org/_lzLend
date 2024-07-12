import { mainnet, sepolia } from "viem/chains";

export interface Asset {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
}

const eth: Asset = {
  name: "Ethereum",
  symbol: "ETH",
  address: "0x0000000000000000000000000000000000000000",
  decimals: 18,
};

export const assets: Record<string, Asset[]> = {
  [mainnet.id]: [
    eth,
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
  ],
  [sepolia.id]: [
    eth,
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
  ],
};
