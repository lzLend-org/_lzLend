import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  createWalletClient,
  http,
  createPublicClient,
  parseUnits,
  erc20Abi,
  encodeAbiParameters,
  formatEther,
} from "viem";
import { useAccount, useChains } from "wagmi";
import { z } from "zod";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { dstPoolAbi } from "@/lib/abis/dst-pool";
import { assets } from "@/lib/assets";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId, Pool } from "@/lib/types";
import { cn, deriveAccountFromUid } from "@/lib/utils";

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
      if (!address) throw Error("Address not found");

      const collateralChain = chains.find((chain) => chain.id === pool.collateralChainId);
      if (!collateralChain) throw Error("Chain not found");

      const derivedAccount = deriveAccountFromUid(address);
      const account = isDerivedAccountEnabled ? derivedAccount : address;
      const userAddress = isDerivedAccountEnabled ? derivedAccount.address : address;

      console.log("address: ", address);
      console.log("userAddress: ", userAddress);
      console.log("pool: ", pool);

      const walletClient = createWalletClient({
        account,
        chain: collateralChain,
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain: collateralChain,
        transport: http(),
      });

      const dstChainId = await publicClient.readContract({
        account,
        address: pool.dstPoolAddress,
        abi: dstPoolAbi,
        functionName: "dstChainId",
      });
      console.log("dstChainId", dstChainId);

      /* ------- Approve ------- */
      const collateralAsset = assets[collateralChain.id as ChainId].find(
        (a) => a.address === pool.collateralAsset.address,
      );
      if (!collateralAsset) throw Error("Collateral asset not found");

      const parsedCollateralAmount = parseUnits(
        collateralAmount.toString(),
        collateralAsset.decimals,
      );

      const { request: approveRequest } = await publicClient.simulateContract({
        account,
        address: collateralAsset.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [pool.dstPoolAddress, parsedCollateralAmount],
      });
      const approveTxnHash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({
        hash: approveTxnHash,
      });

      toast({
        title: "Approved tokens",
        description: "Successfully approved tokens.",
        action: (
          <TransactionLinkButton chainId={collateralChain.id as ChainId} txnHash={approveTxnHash} />
        ),
        variant: "default",
      });

      console.log("Approved token: ", approveTxnHash);

      /* ------- Get Quote ------- */
      const message = encodeAbiParameters(
        [
          { type: "address", name: "" },
          { type: "uint256", name: "" },
        ],
        [userAddress, parsedCollateralAmount],
      );
      // const options = "0x0003010011010000000000000000000000000000fde8";
      const options = "0x0003010011010000000000000000000000000007a120";

      const quote = await publicClient.readContract({
        account,
        address: pool.dstPoolAddress,
        abi: dstPoolAbi,
        functionName: "quote",
        args: [message, options, false],
      });

      /* ------- Borrow ------- */
      // const borrowAsset = assets[collateralChain.id as ChainId].find(
      //   (a) => a.address === pool.asset.address,
      // );
      // if (!borrowAsset) throw Error("Borrow asset not found");

      // const borrowAmount = parseUnits(amount.toString(), borrowAsset.decimals);
      // const collateralAmount = (borrowAmount / pool.ltv) * BigInt(10000);

      const value = quote.nativeFee;
      console.log("Value: ", formatEther(value));

      const { request } = await publicClient.simulateContract({
        account,
        address: pool.dstPoolAddress,
        abi: dstPoolAbi,
        functionName: "takeLoan",
        args: [parsedCollateralAmount, options],
        value,
      });
      const txnHash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({
        hash: txnHash,
      });

      console.log("Borrowed: ", txnHash);

      return txnHash;
    },
    ...options,
    onSuccess(txnHash, variables, context) {
      const collateralChain = chains.find((chain) => chain.id === pool.collateralChainId);
      if (!collateralChain) return;

      toast({
        title: "Borrow Successfull!",
        description: "Your borrow was successfull",
        action: (
          <div className="flex flex-col gap-2">
            <TransactionLinkButton chainId={collateralChain.id as ChainId} txnHash={txnHash} />
            <a
              href={`https://testnet.layerzeroscan.com/tx/${txnHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "sm", variant: "accent" }), "text-sm")}
            >
              See on LayerZero
            </a>
          </div>
        ),
        variant: "default",
      });
      options?.onSuccess?.(txnHash, variables, context);
    },
    onError(error, variables, context) {
      console.log("Error: ", error.message);

      toast({
        title: "Borrow Failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
  });
}
