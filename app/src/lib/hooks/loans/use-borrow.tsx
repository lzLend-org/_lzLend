import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { createWalletClient, http, createPublicClient, parseUnits } from "viem";
import { useAccount, useChains } from "wagmi";
import { z } from "zod";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { toast } from "@/components/ui/use-toast";
import { dstPoolAbi } from "@/lib/abis/dst-pool";
import { assets } from "@/lib/assets";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId, Pool } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

export const getBorrowSchema = (max: number) =>
  z.object({
    collateralAmount: z.number().positive().lte(max),
    // collateralAsset: z.string().min(1),
  });

export type BorrowData = z.infer<ReturnType<typeof getBorrowSchema>>;

type UseBorrowOptions = Omit<
  UseMutationOptions<string, Error, BorrowData, unknown>,
  "mutationFn"
> & { pool: Pool };

export function useBorrow({ pool, ...options }: UseBorrowOptions) {
  const chains = useChains();
  const { address } = useAccount();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  return useMutation({
    mutationFn: async ({
      collateralAmount,
      // collateralAsset
    }: BorrowData) => {
      // return "0xd368d878588a0ff60ce504d22b09c3fc7864ce678b6927d696606062637964b3";
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
      // const borrowAsset = assets[collateralChain.id as ChainId].find(
      //   (a) => a.address === pool.asset.address,
      // );
      // if (!borrowAsset) throw Error("Borrow asset not found");

      // const borrowAmount = parseUnits(amount.toString(), borrowAsset.decimals);
      // const collateralAmount = (borrowAmount / pool.ltv) * BigInt(10000);

      const collateralAsset = assets[collateralChain.id as ChainId].find(
        (a) => a.address === pool.collateralAsset.address,
      );
      if (!collateralAsset) throw Error("Collateral asset not found");

      const parsedCollateralAmount = parseUnits(
        collateralAmount.toString(),
        collateralAsset.decimals,
      );

      const { request } = await publicClient.simulateContract({
        account,
        address: pool.dstPoolAddress,
        abi: dstPoolAbi,
        functionName: "takeLoan",
        args: [parsedCollateralAmount],
      });
      return await walletClient.writeContract(request);
    },
    ...options,
    onSuccess(txnHash, variables, context) {
      const collateralChain = chains.find((chain) => chain.id === pool.collateralChainId);
      if (!collateralChain) return;

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
        action: <TransactionLinkButton chainId={collateralChain.id as ChainId} txnHash={txnHash} />,
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
