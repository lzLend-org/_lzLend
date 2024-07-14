import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { createWalletClient, http, createPublicClient } from "viem";
import { useAccount, useChains } from "wagmi";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { toast } from "@/components/ui/use-toast";
import { poolSrcFactoryAbi } from "@/lib/abis/pool-src-factory";
import { POOL_SRC_FACTORY_ADDRESS } from "@/lib/addresses";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId, Pool } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

type UseBuyPoolOptions = Omit<UseMutationOptions<string, Error, void, unknown>, "mutationFn"> & {
  pool: Pool;
};

export function useBuyPool({ pool, ...options }: UseBuyPoolOptions) {
  const chains = useChains();
  const { address } = useAccount();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  return useMutation({
    mutationFn: async () => {
      // return "0xd368d878588a0ff60ce504d22b09c3fc7864ce678b6927d696606062637964b3";
      if (!address) throw Error("Address not found");

      const derivedAccount = deriveAccountFromUid(address);
      const account = isDerivedAccountEnabled ? derivedAccount : address;

      const chain = chains.find((chain) => chain.id === pool.chainId);
      if (!chain) throw Error("Chain not found");

      const walletClient = createWalletClient({
        account,
        chain,
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      /* ------- List ------- */
      const { request } = await publicClient.simulateContract({
        account,
        address: POOL_SRC_FACTORY_ADDRESS[pool.chainId],
        abi: poolSrcFactoryAbi,
        functionName: "buySrcPool",
        args: [pool.address],
      });
      const txnHash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({
        hash: txnHash,
      });

      console.log("Bought: ", txnHash);

      return txnHash;
    },
    ...options,
    onSuccess(txnHash, variables, context) {
      const collateralChain = chains.find((chain) => chain.id === pool.collateralChainId);
      if (!collateralChain) return;

      toast({
        title: "Buy Successfull!",
        description: "Your buy was successfull",
        action: <TransactionLinkButton chainId={collateralChain.id as ChainId} txnHash={txnHash} />,
        variant: "default",
      });
      options?.onSuccess?.(txnHash, variables, context);
    },
    onError(error, variables, context) {
      console.log("Error: ", error.message);

      toast({
        title: "Buy Failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
  });
}
