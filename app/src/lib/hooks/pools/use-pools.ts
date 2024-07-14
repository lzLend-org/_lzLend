import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { getPools } from "@/lib/pools";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { Pool } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

type UsePoolsOptions = Omit<
  UseQueryOptions<unknown, Error, Pool[], ReadonlyArray<unknown>>,
  "queryKey" | "queryFn"
> & {
  owner?: `0x${string}`;
};

export function usePools(params?: UsePoolsOptions) {
  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  const { owner } = params || {};

  return useQuery<Pool[]>({
    queryKey: ["pools", owner, isDerivedAccountEnabled],
    queryFn: async () => {
      let ownerAddress = owner;

      if (owner && isDerivedAccountEnabled) {
        ownerAddress = deriveAccountFromUid(owner).address;
      }

      return getPools({ owner: ownerAddress });
    },
  });
}
