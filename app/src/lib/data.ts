import { mainnet } from "viem/chains";

import { ETH, USDC } from "@/lib/assets";
import { Loan, Pool } from "@/lib/types";

export const pools: Pool[] = [
  {
    chainId: mainnet.id,
    asset: ETH,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
];

export const loans: Loan[] = [
  {
    amount: BigInt(100000000000000),
    collateralAmount: BigInt(80000000000000),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    pool: pools[0],
  },
  {
    amount: BigInt(100000000000000),
    collateralAmount: BigInt(80000000000000),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    pool: pools[0],
  },
  {
    amount: BigInt(100000000000000),
    collateralAmount: BigInt(80000000000000),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    pool: pools[0],
  },
  {
    amount: BigInt(100000000000000),
    collateralAmount: BigInt(80000000000000),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    pool: pools[0],
  },
  {
    amount: BigInt(100000000000000),
    collateralAmount: BigInt(80000000000000),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    pool: pools[0],
  },
];