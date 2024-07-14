import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  createWalletClient,
  http,
  createPublicClient,
  erc20Abi,
  encodeAbiParameters,
  formatEther,
} from "viem";
import { useAccount, useChains } from "wagmi";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { toast } from "@/components/ui/use-toast";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import { assets } from "@/lib/assets";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId, Loan } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

// export const getRepaySchema = (max: number) =>
//   z.object({
//     amount: z.number().positive().lte(max),
//   });

// export type RepayData = z.infer<ReturnType<typeof getRepaySchema>>;

type UseRepayOptions = Omit<UseMutationOptions<string, Error, void, unknown>, "mutationFn"> & {
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
      const userAddress = isDerivedAccountEnabled ? derivedAccount.address : address;

      const walletClient = createWalletClient({
        account,
        chain,
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      /* ------- Approve ------- */
      const poolAsset = assets[loan.pool.chainId as ChainId].find(
        (a) => a.address.toLowerCase() === loan.pool.asset.address.toLowerCase(),
      );
      if (!poolAsset) throw Error("Pool asset asset not found");

      const repayAmount = await publicClient.readContract({
        account,
        address: loan.pool.address,
        abi: srcPoolAbi,
        functionName: "getRepaymentAmount",
        args: [userAddress],
      });

      // console.log("Repay amount: ", repayAmount);

      const { request: approveRequest } = await publicClient.simulateContract({
        account,
        address: poolAsset.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [loan.pool.address, repayAmount * BigInt(10)],
      });
      const approveTxnHash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({
        hash: approveTxnHash,
      });

      toast({
        title: "Approved tokens",
        description: "Successfully approved tokens.",
        action: <TransactionLinkButton chainId={chain.id as ChainId} txnHash={approveTxnHash} />,
        variant: "default",
      });

      console.log("Approved token: ", approveTxnHash);

      /* ------- Get Quote ------- */
      const message = encodeAbiParameters([{ type: "address", name: "" }], [userAddress]);
      // const options = "0x0003010011010000000000000000000000000000fde8";
      const options = "0x0003010011010000000000000000000000000007a120";

      const quote = await publicClient.readContract({
        account,
        address: loan.pool.address,
        abi: srcPoolAbi,
        functionName: "quote",
        args: [message, options, false],
      });

      /* ------- Repay ------- */
      const value = quote.nativeFee;
      console.log("Value: ", formatEther(value));

      const { request } = await publicClient.simulateContract({
        account,
        address: loan.pool.address,
        abi: srcPoolAbi,
        functionName: "repayLoan",
        args: [options],
        value,
      });
      const repayTxnHash = await walletClient.writeContract(request);

      console.log("Repay: ", repayTxnHash);

      toast({
        title: "Repay Successfull!",
        description: "Your repay was successfull.",
        action: <TransactionLinkButton chainId={chain.id as ChainId} txnHash={repayTxnHash} />,
        variant: "default",
      });

      return repayTxnHash;
    },
    ...options,
    onSuccess(txnHash, variables, context) {
      options?.onSuccess?.(txnHash, variables, context);
    },
    onError(error, variables, context) {
      console.log("Error: ", error.message);

      toast({
        title: "Repay Failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
  });
}
