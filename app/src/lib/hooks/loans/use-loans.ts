import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { useAtomValue } from "jotai";

import { srcPoolAbi } from "@/lib/abis/src-pool";
import { getPools } from "@/lib/pools";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { Loan } from "@/lib/types";
// import { deriveAccountFromUid } from "@/lib/utils";
import { deriveAccountFromUid } from "@/lib/utils";
import { config } from "@/lib/wagmi";

type UseLoansOptions = Omit<
  UseQueryOptions<unknown, Error, Loan[], ReadonlyArray<unknown>>,
  "queryKey" | "queryFn"
> & {
  owner?: `0x${string}`;
};

export function useLoans(params?: UseLoansOptions) {
  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  const { owner } = params || {};

  return useQuery<Loan[]>({
    queryKey: ["user-loans", owner, isDerivedAccountEnabled],
    queryFn: async () => {
      let ownerAddress = owner;

      if (owner && isDerivedAccountEnabled) {
        ownerAddress = deriveAccountFromUid(owner).address;
      }

      const pools = await getPools();

      // console.log("Loan Pools: ", pools);

      const results = await readContracts(config, {
        contracts: pools.map(
          (pool) =>
            ({
              address: pool.address,
              abi: srcPoolAbi,
              chainId: pool.chainId,
              functionName: "loans",
              args: [ownerAddress],
            }) as const,
        ),
      });

      // console.log("Results: ", results);

      const loans: (Loan | null)[] = results.map((result, index) => {
        const pool = pools[index];
        if (!result.result) return null;

        // console.log("Result: ", result);

        return {
          amount: result.result[0],
          collateralAmount: result.result[1],
          startDate: result.result[2],
          owner: result.result[3],
          pool,
          // chainId: pool.chainId,
          // asset: pool.asset,
          // collateralChainId: pool.collateralChainId,
          // collateralAsset: pool.collateralAsset,
          // apr: pool.apr,
        };
      });

      // console.log("Loans: ", loans);

      return loans.filter((loan): loan is Loan => loan !== null && loan.amount > BigInt(0));
    },
  });
}
