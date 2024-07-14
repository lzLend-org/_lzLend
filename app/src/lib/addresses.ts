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
  [arbitrumSepolia.id]: "0xc2a811bd4a74efd1cae3d6d6d5a0ad70d84487d3",
  [baseSepolia.id]: "0xaa9ef39d7739ae2906ced6c4786224059fbcdd38",
  [scrollSepolia.id]: "0x3b2cca1570d630052c4691489acf21db20811505",
  [morphHolesky.id]: "0x2511aac2823d68351a2e8e7c28200a095becf276",
  [zircuitTestnet.id]: "0xc380c51bf4095106d67cceafc1d9ebabc14d06c8",
};

export const POOL_DST_FACTORY_ADDRESS: Record<ChainId, `0x${string}`> = {
  [arbitrumSepolia.id]: "0xf6b63d895c09fc6d4042228347d693c4933e3a4b",
  [baseSepolia.id]: "0x29bd4a7bd7f7244ebb7792920d3321238abd7adf",
  [scrollSepolia.id]: "0x1ac2ddab17ca52683d8993d8c17597ba4f7993b7",
  [morphHolesky.id]: "0x617d0f12771e2c04b95a39dd658d74287f170bcd",
  [zircuitTestnet.id]: "0x9a4eb00c4bf1fb9a6f5fae6e9a439bf52c643760",
};

export const ORACLE_ADDRESS: Record<ChainId, `0x${string}`> = {
  [arbitrumSepolia.id]: "0x84e577145c04e5ba2eab9b6523eea4b1cc3a6b20",
  [baseSepolia.id]: "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69",
  [scrollSepolia.id]: "0x7d4de01164f6cbac7590d7b9592d5a8e37a18e8c",
  [morphHolesky.id]: "0x617d0f12771e2c04b95a39dd658d74287f170bcd", //
  [zircuitTestnet.id]: "0xf6b63d895c09fc6d4042228347d693c4933e3a4b",
};
