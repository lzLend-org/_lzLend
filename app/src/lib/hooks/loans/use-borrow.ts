import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { createWalletClient, http, createPublicClient, parseUnits } from "viem";
import { useAccount, useChains } from "wagmi";
import { z } from "zod";

import { dstPoolAbi } from "@/lib/abis/dst-pool";
import { assets } from "@/lib/assets";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId, Pool } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

export const getBorrowSchema = (max: number) =>
  z.object({
    amount: z.number().positive().lte(max),
    // collateralAsset: z.string().min(1),
  });

export type BorrowData = z.infer<ReturnType<typeof getBorrowSchema>>;

interface UseBorrowOptions {
  pool: Pool;
}

export function useBorrow({ pool }: UseBorrowOptions) {
  const chains = useChains();
  const { address } = useAccount();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  return useMutation({
    mutationFn: async ({
      amount,
      // collateralAsset
    }: BorrowData) => {
      if (!address) throw Error("Address not found");

      const collateralChain = chains.find((chain) => chain.id === pool.collateralChainId);
      if (!collateralChain) throw Error("Chain not found");

      const derivedAccount = deriveAccountFromUid(address);
      const account = isDerivedAccountEnabled ? derivedAccount : undefined;

      const walletClient = createWalletClient({
        account,
        chain: collateralChain,
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain: collateralChain,
        transport: http(),
      });

      /* Borrow */
      const borrowAsset = assets[collateralChain.id as ChainId].find(
        (a) => a.address === pool.collateralAsset.address,
      );
      if (!borrowAsset) throw Error("Deposit asset not found");

      const borrowAmount = parseUnits(amount.toString(), borrowAsset.decimals);
      const collateralAmount = (borrowAmount / pool.ltv) * BigInt(10000);

      const { request } = await publicClient.simulateContract({
        account,
        address: pool.dstPoolAddress,
        abi: dstPoolAbi,
        functionName: "takeLoan",
        args: [collateralAmount],
      });
      await walletClient.writeContract(request);
    },
  });
}
