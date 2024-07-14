import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useAccount } from "wagmi";

import { getListedPools } from "@/lib/pools";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { Pool } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

// type UsePoolsOptions = Omit<
//   UseQueryOptions<unknown, Error, Pool[], ReadonlyArray<unknown>>,
//   "queryKey" | "queryFn"
// >;

export function useUserListedPools() {
  const { address } = useAccount();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  return useQuery<Pool[]>({
    queryKey: ["user-listed-pools", address],
    queryFn: async () => {
      if (!address) throw Error("Address not found");

      const derivedAccount = deriveAccountFromUid(address);
      const userAddress = isDerivedAccountEnabled ? derivedAccount.address : address;

      const listedPools = await getListedPools();

      return listedPools.filter((pool) => pool.owner === userAddress);
    },
  });
}
