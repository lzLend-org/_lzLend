import { parseUnits } from "viem";
import { useChains, useReadContract } from "wagmi";

import { srcPoolAbi } from "@/lib/abis/src-pool";
import { assets } from "@/lib/assets";
import { ChainId, Pool } from "@/lib/types";

interface UseGetBorrowAmountParams {
  pool: Pool;
  collateralAmount: number;
}

export function useGetBorrowAmount({ pool, collateralAmount }: UseGetBorrowAmountParams) {
  const chains = useChains();

  // const amount = isNaN(parseInt(collateralAmount.toString()) ? 0 : collateralAmount);

  const collateralChain = chains.find((chain) => chain.id === pool.collateralChainId);
  const collateralChainId = (collateralChain || chains[0]).id as ChainId;

  const collateralAsset = assets[collateralChainId].find(
    (a) => a.address === pool.collateralAsset.address,
  );

  const parsedCollateralAmount = parseUnits(
    collateralAmount.toString(),
    collateralAsset?.decimals || 18,
  );

  return useReadContract({
    abi: srcPoolAbi,
    functionName: "getLoanAmount",
    address: pool.address,
    args: [parsedCollateralAmount],
  });
}
