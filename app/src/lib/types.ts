import { ChainIdParameter } from "@wagmi/core/internal";

import { config } from "@/lib/wagmi";

export interface Asset {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
}

export interface Deposit {
  chain: ChainId;
  asset: Asset;
  amount: number;
  owner: `0x${string}`;
  interestRate: string;
  unlockDate: number;
  collateralChainId: number;
  ltv: number;
}

export interface Loan {
  chain: string;
  asset: Asset;
  amount: number;
  collateralChain: string;
  collateralAsset: string;
  collateralAmount: string;
  interestRate: string;
}

export type ChainId = Exclude<ChainIdParameter<typeof config>["chainId"], undefined>;
