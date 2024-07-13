import { mainnet, sepolia } from "viem/chains";

import { ChainId } from "@/lib/types";

export const EXPLORER_URL: Record<ChainId, string> = {
  [mainnet.id]: "https://eth.blockscout.com",
  [sepolia.id]: "https://eth-sepolia.blockscout.com",
};

export function getExplorerAddressUrl(chainId: ChainId, address: string) {
  return `${EXPLORER_URL[chainId]}/address/${address}`;
}

export function getExplorerTransactionUrl(chainId: ChainId, txHash: string) {
  return `${EXPLORER_URL[chainId]}/tx/${txHash}`;
}
