import { ChainIdParameter } from "@wagmi/core/internal";

import { config } from "@/lib/wagmi";

export interface Asset {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
}

export interface Pool {
  chainId: ChainId;
  asset: Asset;
  amount: bigint;
  address: `0x${string}`;
  owner: `0x${string}`;
  collateralChainId: ChainId;
  collateralAsset: Asset;
  apr: bigint;
  expireDate: bigint;
  ltv: bigint;
}

export interface Loan {
  chainId: ChainId;
  asset: Asset;
  amount: bigint;
  collateralChainId: ChainId;
  collateralAsset: Asset;
  collateralAmount: bigint;
  apr: bigint;
  startDate: bigint;
  owner: `0x${string}`;
}

export type ChainId = Exclude<ChainIdParameter<typeof config>["chainId"], undefined>;
