import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getPools } from "@/lib/pools";
import { Pool } from "@/lib/types";

type UsePoolsOptions = Omit<
  UseQueryOptions<unknown, Error, Pool[], ReadonlyArray<unknown>>,
  "queryKey" | "queryFn"
> & {
  owner?: `0x${string}`;
};

export function usePools(params?: UsePoolsOptions) {
  const { owner } = params || {};

  return useQuery<Pool[]>({
    queryKey: ["pools", owner],
    queryFn: async () => {
      return getPools({ owner });
    },
  });
}
