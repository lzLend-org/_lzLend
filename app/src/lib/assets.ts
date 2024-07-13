import {
  arbitrumSepolia,
  baseSepolia,
  mainnet,
  morphHolesky,
  scrollSepolia,
  sepolia,
  zircuitTestnet,
} from "viem/chains";

import { Asset, ChainId } from "@/lib/types";

export const WBTC: Omit<Asset, "address"> = {
  name: "Wrapped Bitcoin",
  symbol: "WBTC",
  decimals: 18,
  oraclePriceIndex: 0,
};

export const WETH: Omit<Asset, "address"> = {
  name: "Wrapped Ethereum",
  symbol: "WETH",
  decimals: 18,
  oraclePriceIndex: 1,
};

export const assets: Record<ChainId, Asset[]> = {
  [mainnet.id]: [
    {
      ...WBTC,
      address: "0x0000000000000000000000000000000000000000",
    },
    {
      ...WETH,
      address: "0x0000000000000000000000000000000000000000",
    },
  ],
  [sepolia.id]: [
    {
      ...WBTC,
      address: "0x0000000000000000000000000000000000000000",
    },
    {
      ...WETH,
      address: "0x0000000000000000000000000000000000000000",
    },
  ],
  [arbitrumSepolia.id]: [
    {
      ...WBTC,
      address: "0x973a89f4a741C48D9E46f362861945FE7c06F121",
    },
    {
      ...WETH,
      address: "0x49682Be434B2125EAEDF0e33DbBE60E89c26Fda4",
    },
  ],
  [baseSepolia.id]: [
    {
      ...WBTC,
      address: "0x0000000000000000000000000000000000000000",
    },
    {
      ...WETH,
      address: "0x0000000000000000000000000000000000000000",
    },
  ],
  [scrollSepolia.id]: [
    {
      ...WBTC,
      address: "0x0000000000000000000000000000000000000000",
    },
    {
      ...WETH,
      address: "0x0000000000000000000000000000000000000000",
    },
  ],
  [morphHolesky.id]: [
    {
      ...WBTC,
      address: "0x0000000000000000000000000000000000000000",
    },
    {
      ...WETH,
      address: "0x0000000000000000000000000000000000000000",
    },
  ],
  [zircuitTestnet.id]: [
    {
      ...WBTC,
      address: "0xc7A913fa52b5dcAD23D17D137c5c1436F4376ea5",
    },
    {
      ...WETH,
      address: "0xECD07d9801e4DD8C87d5f2443CD27b5cF0317F69",
    },
  ],
};
