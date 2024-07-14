import {
  arbitrumSepolia,
  baseSepolia,
  // mainnet,
  morphHolesky,
  scrollSepolia,
  // sepolia,
  zircuitTestnet,
} from "viem/chains";

import { ChainId } from "@/lib/types";

export const addresses: Record<string, []> = {};

export const POOL_SRC_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  // [mainnet.id]: "0x",
  // [sepolia.id]: "0x",
  [arbitrumSepolia.id]: "0x8379c5f1577a1751a38fbe4fba867b774351100a",
  [baseSepolia.id]: "0x",
  [scrollSepolia.id]: "0x",
  [morphHolesky.id]: "0x",
  [zircuitTestnet.id]: "0xe2ebd792e2d994e3a5aeb9fd1b0a18b0ae180f67",
};

export const POOL_DST_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  // [mainnet.id]: "0x",
  // [sepolia.id]: "0x",
  [arbitrumSepolia.id]: "0x84bd941cc3c337578964250ce776c7670ad0e81d",
  [baseSepolia.id]: "0x",
  [scrollSepolia.id]: "0x",
  [morphHolesky.id]: "0x",
  [zircuitTestnet.id]: "0x8594d8016f5467e2c34c51cfc50457b1d78e6ff7",
};

export const ORACLE_ADDRESS: Record<ChainId, `0x${string}`> = {
  // [mainnet.id]: "0x",
  // [sepolia.id]: "0x",
  [arbitrumSepolia.id]: "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6",
  [baseSepolia.id]: "0x",
  [scrollSepolia.id]: "0x",
  [morphHolesky.id]: "0x",
  [zircuitTestnet.id]: "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6",
};
