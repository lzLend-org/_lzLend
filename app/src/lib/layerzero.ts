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

export const LAYERZERO_ENDPOINT_CONFIG: Record<
  ChainId,
  {
    id: number;
    address: `0x${string}`;
  }
> = {
  [mainnet.id]: {
    id: 30101,
    address: "0x1a44076050125825900e736c501f859c50fE728c",
  },
  [sepolia.id]: {
    id: 40161,
    address: "0x6EDCE65403992e310A62460808c4b910D972f10f",
  },
  [arbitrumSepolia.id]: {
    id: 40231,
    address: "0x6EDCE65403992e310A62460808c4b910D972f10f",
  },
  [baseSepolia.id]: {
    id: 40245,
    address: "0x6EDCE65403992e310A62460808c4b910D972f10f",
  },
  [scrollSepolia.id]: {
    id: 40170,
    address: "0x6EDCE65403992e310A62460808c4b910D972f10f",
  },
  [morphHolesky.id]: {
    id: 40290,
    address: "0x6EDCE65403992e310A62460808c4b910D972f10f",
  },
  [zircuitTestnet.id]: {
    id: 40275,
    address: "0x6EDCE65403992e310A62460808c4b910D972f10f",
  },
};
