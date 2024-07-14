import { ChainIdParameter } from "@wagmi/core/internal";

import { config } from "@/lib/wagmi";

export interface Asset {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  oraclePriceIndex: number;
}

export interface Pool {
  chainId: ChainId;
  asset: Asset;
  amount: bigint;
  address: `0x${string}`;
  owner: `0x${string}`;
  collateralChainId: ChainId;
  collateralAsset: Asset;
  dstPoolAddress: `0x${string}`;
  apr: bigint;
  expireDate: bigint;
  ltv: bigint;
}

export interface Loan {
  amount: bigint;
  collateralAmount: bigint;
  startDate: bigint;
  owner: `0x${string}`;
  pool: Pool;
  // chainId: ChainId;
  // asset: Asset;
  // collateralChainId: ChainId;
  // collateralAsset: Asset;
  // apr: bigint;
}

export type ChainId = Exclude<ChainIdParameter<typeof config>["chainId"], undefined>;
