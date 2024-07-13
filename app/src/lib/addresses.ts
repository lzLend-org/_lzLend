import {
  arbitrumSepolia,
  baseSepolia,
  mainnet,
  morphHolesky,
  scrollSepolia,
  sepolia,
  zircuitTestnet,
} from "viem/chains";

import { ChainId } from "@/lib/types";

export const addresses: Record<string, []> = {};

export const POOL_SRC_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0x",
  [sepolia.id]: "0x",
  [arbitrumSepolia.id]: "0x15e00f073322da8c03fe2dd15fae7013c0945e53",
  [baseSepolia.id]: "0x",
  [scrollSepolia.id]: "0x",
  [morphHolesky.id]: "0x",
  [zircuitTestnet.id]: "0x617d0f12771e2c04b95a39dd658d74287f170bcd",
};

export const POOL_DST_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0x",
  [sepolia.id]: "0x",
  [arbitrumSepolia.id]: "0x2511aac2823d68351a2e8e7c28200a095becf276",
  [baseSepolia.id]: "0x",
  [scrollSepolia.id]: "0x",
  [morphHolesky.id]: "0x",
  [zircuitTestnet.id]: "0xe1b87465c94c246cfd177bbe0ff6e21e4061dde7",
};

export const ORACLE_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0x",
  [sepolia.id]: "0x",
  [arbitrumSepolia.id]: "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6",
  [baseSepolia.id]: "0x",
  [scrollSepolia.id]: "0x",
  [morphHolesky.id]: "0x",
  [zircuitTestnet.id]: "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6",
};
