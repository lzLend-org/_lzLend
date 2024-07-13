import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";

import { srcPoolAbi } from "@/lib/abis/src-pool";
import { getPools } from "@/lib/pools";
import { Loan } from "@/lib/types";
import { config } from "@/lib/wagmi";

type UseLoansOptions = Omit<
  UseQueryOptions<unknown, Error, Loan[], ReadonlyArray<unknown>>,
  "queryKey" | "queryFn"
> & {
  owner: `0x${string}`;
};

export function useLoans(params?: UseLoansOptions) {
  const { owner } = params || {};

  return useQuery<Loan[]>({
    queryKey: ["user-loans", owner],
    queryFn: async () => {
      const pools = await getPools({ owner });

      const results = await readContracts(config, {
        contracts: pools.map(
          (pool) =>
            ({
              address: pool.address,
              abi: srcPoolAbi,
              chainId: pool.chainId,
              functionName: "loans",
              args: [owner],
            }) as const,
        ),
      });

      const loans: (Loan | null)[] = results.map((result, index) => {
        const pool = pools[index];
        if (!result.result) return null;

        return {
          chainId: pool.chainId,
          asset: pool.asset,
          amount: result.result[0],
          collateralChainId: pool.collateralChainId,
          collateralAsset: pool.collateralAsset,
          collateralAmount: result.result[1],
          apr: pool.apr,
          startDate: result.result[2],
          owner: result.result[3],
        };
      });

      return loans.filter((loan): loan is Loan => loan !== null);
    },
  });
}
