import { mainnet, sepolia } from "viem/chains";

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
};
