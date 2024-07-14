import {
  arbitrumSepolia,
  baseSepolia,
  // mainnet,
  morphHolesky,
  scrollSepolia,
  // sepolia,
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

export const USDC: Omit<Asset, "address"> = {
  name: "USD Coin",
  symbol: "USDC",
  decimals: 18,
  oraclePriceIndex: 2,
};

export const assets: Record<ChainId, Asset[]> = {
  // [mainnet.id]: [
  //   {
  //     ...WBTC,
  //     address: "0x0000000000000000000000000000000000000000",
  //   },
  //   {
  //     ...WETH,
  //     address: "0x0000000000000000000000000000000000000000",
  //   },
  // ],
  // [sepolia.id]: [
  //   {
  //     ...WBTC,
  //     address: "0x0000000000000000000000000000000000000000",
  //   },
  //   {
  //     ...WETH,
  //     address: "0x0000000000000000000000000000000000000000",
  //   },
  // ],
  [arbitrumSepolia.id]: [
    {
      ...WBTC,
      address: "0xe2ebd792e2d994e3a5aeb9fd1b0a18b0ae180f67",
    },
    {
      ...WETH,
      address: "0xac67cf8ea391ad381f7533c451b2da009717bd02",
    },
    {
      ...USDC,
      address: "0x15d0640f905aa6d8790da19635b8ae9037519b71",
    },
  ],
  [baseSepolia.id]: [
    {
      ...WBTC,
      address: "0xefe4c42b30c5829e8ac71385c2d44cbc0545b50f",
    },
    {
      ...WETH,
      address: "0x2511aac2823d68351a2e8e7c28200a095becf276",
    },
    {
      ...USDC,
      address: "0x15e00f073322da8c03fe2dd15fae7013c0945e53",
    },
  ],
  [scrollSepolia.id]: [
    {
      ...WBTC,
      address: "0x973a89f4a741c48d9e46f362861945fe7c06f121",
    },
    {
      ...WETH,
      address: "0xc7a913fa52b5dcad23d17d137c5c1436f4376ea5",
    },
    {
      ...USDC,
      address: "0x49682be434b2125eaedf0e33dbbe60e89c26fda4",
    },
  ],
  [morphHolesky.id]: [
    {
      ...WBTC,
      address: "0xefe4c42b30c5829e8ac71385c2d44cbc0545b50f",
    },
    {
      ...WETH,
      address: "0x15e00f073322da8c03fe2dd15fae7013c0945e53",
    },
    {
      ...USDC,
      address: "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6",
    },
  ],
  [zircuitTestnet.id]: [
    {
      ...WBTC,
      address: "0xac67cf8ea391ad381f7533c451b2da009717bd02",
    },
    {
      ...WETH,
      address: "0x1da1d4bca50490fbe77ace98dbbfd383fe1cb909",
    },
    {
      ...USDC,
      address: "0x7d4de01164f6cbac7590d7b9592d5a8e37a18e8c",
    },
  ],
};
