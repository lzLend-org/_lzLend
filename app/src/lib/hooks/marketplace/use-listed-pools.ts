import { useQuery } from "@tanstack/react-query";

import { getListedPools } from "@/lib/pools";
import { Pool } from "@/lib/types";

// type UsePoolsOptions = Omit<
//   UseQueryOptions<unknown, Error, Pool[], ReadonlyArray<unknown>>,
//   "queryKey" | "queryFn"
// >;

export function useListedPools() {
  return useQuery<Pool[]>({
    queryKey: ["listed-pools"],
    queryFn: async () => {
      return getListedPools();
    },
  });
}
