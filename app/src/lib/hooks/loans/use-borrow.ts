import { useMutation } from "@tanstack/react-query";
import { createWalletClient, http, createPublicClient } from "viem";
import { useAccount, useChains } from "wagmi";
import { z } from "zod";

import { dstPoolAbi } from "@/lib/abis/dst-pool";
import { Pool } from "@/lib/types";
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

  return useMutation({
    mutationFn: async ({
      amount,
      // collateralAsset
    }: BorrowData) => {
      if (!address) throw Error("Address not found");

      const chain = chains.find((chain) => chain.id === pool.collateralChainId);
      if (!chain) throw Error("Chain not found");

      const derivedAccount = deriveAccountFromUid(address);

      const walletClient = createWalletClient({
        account: derivedAccount,
        chain,
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      /* Borrow */
      const dstPoolAddress = "0x"; // TODO: get dst pool address

      const { request } = await publicClient.simulateContract({
        account: derivedAccount,
        address: dstPoolAddress,
        abi: dstPoolAbi,
        functionName: "takeLoan",
        args: [BigInt(amount)],
      });
      await walletClient.writeContract(request);
    },
  });
}
