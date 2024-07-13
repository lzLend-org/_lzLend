import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { createWalletClient, http, createPublicClient } from "viem";
import { useAccount, useChains } from "wagmi";

import { srcPoolAbi } from "@/lib/abis/src-pool";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { Loan } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

// export const getRepaySchema = (max: number) =>
//   z.object({
//     amount: z.number().positive().lte(max),
//   });

// export type RepayData = z.infer<ReturnType<typeof getRepaySchema>>;

interface UseBorrowOptions {
  loan: Loan;
}

export function useRepay({ loan }: UseBorrowOptions) {
  const chains = useChains();
  const { address } = useAccount();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  return useMutation({
    mutationFn: async () => {
      if (!address) throw Error("Address not found");

      const chain = chains.find((chain) => chain.id === loan.pool.chainId);
      if (!chain) throw Error("Chain not found");

      const derivedAccount = deriveAccountFromUid(address);
      const account = isDerivedAccountEnabled ? derivedAccount : undefined;

      const walletClient = createWalletClient({
        account,
        chain,
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      /* Repay */
      const { request } = await publicClient.simulateContract({
        account,
        address: loan.pool.address,
        abi: srcPoolAbi,
        functionName: "repayLoan",
      });
      await walletClient.writeContract(request);
    },
  });
}
