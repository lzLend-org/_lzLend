import { mainnet, sepolia } from "viem/chains";

import { ChainId } from "@/lib/types";

export const LAYERZERO_ENDPOINT_ADDRESS: Record<ChainId, `0x${string}`> = {
  [mainnet.id]: "0x1a44076050125825900e736c501f859c50fE728c",
  [sepolia.id]: "0x6EDCE65403992e310A62460808c4b910D972f10f",
};
