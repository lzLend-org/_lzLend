export interface Asset {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
}

export interface Deposit {
  chain: string;
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
  amount: string;
  collateralChain: string;
  collateralAsset: string;
  collateralAmount: string;
  interestRate: string;
}
