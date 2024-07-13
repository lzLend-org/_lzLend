import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { createWalletClient, http, createPublicClient } from "viem";
import { useAccount, useChains } from "wagmi";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { toast } from "@/components/ui/use-toast";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId, Loan } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

// export const getRepaySchema = (max: number) =>
//   z.object({
//     amount: z.number().positive().lte(max),
//   });

// export type RepayData = z.infer<ReturnType<typeof getRepaySchema>>;

type UseRepayOptions = Omit<UseMutationOptions<string, Error, {}, unknown>, "mutationFn"> & {
  loan: Loan;
};

export function useRepay({ loan, ...options }: UseRepayOptions) {
  const chains = useChains();
  const { address } = useAccount();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  return useMutation({
    mutationFn: async () => {
      // return "0xd368d878588a0ff60ce504d22b09c3fc7864ce678b6927d696606062637964b3";
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
      return await walletClient.writeContract(request);
    },
    ...options,
    onSuccess(txnHash, variables, context) {
      const chain = chains.find((chain) => chain.id === loan.pool.chainId);
      if (!chain) return;

      toast({
        title: "Borrow Successfull!",
        description: (
          <p>
            Your borrow was successfull.
            {/* <a
              href={getExplorerTransactionUrl(chainId, txnHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Blockscout
            </a> */}
          </p>
        ),
        action: <TransactionLinkButton chainId={chain.id as ChainId} txnHash={txnHash} />,
        variant: "default",
      });
      options?.onSuccess?.(txnHash, variables, context);
    },
    onError(error, variables, context) {
      toast({
        title: "Deposit Failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
  });
}
