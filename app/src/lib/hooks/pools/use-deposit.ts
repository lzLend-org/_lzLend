import { useMutation } from "@tanstack/react-query";
import { createWalletClient, http, erc20Abi, createPublicClient, decodeEventLog } from "viem";
import { getTransactionReceipt } from "viem/actions";
import { useAccount, useChainId, useChains } from "wagmi";
import { z } from "zod";

import { poolFactoryAbi } from "@/lib/abis/pool-factory";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import { POOL_FACTORY_ADDRESS } from "@/lib/addresses";
import { LAYERZERO_ENDPOINT_ADDRESS } from "@/lib/layerzero";
import { ChainId } from "@/lib/types";
import { deriveAccountFromUid } from "@/lib/utils";

export const depositSchema = z.object({
  asset: z.string().min(1),
  amount: z.number().gt(0),
  interestRate: z.number().gt(0),
  daysLocked: z.number().gt(0),
  collateralChainId: z.number().gt(0),
  collateralAsset: z.string().min(1),
  ltv: z.number().gt(0).max(1),
});

export type DepositData = z.infer<typeof depositSchema>;

// interface UseDepositOptions {
//   derivedAccount?: boolean;
// }

export function useDeposit() {
  const chainId = useChainId();
  const chains = useChains();
  const { address } = useAccount();

  return useMutation({
    mutationFn: async ({
      asset,
      amount,
      collateralChainId,
      collateralAsset,
      ltv,
      interestRate,
      daysLocked,
    }: DepositData) => {
      if (!address) throw Error("Address not found");

      const srcChain = chains.find((chain) => chain.id === chainId);
      if (!srcChain) throw Error("Chain not found");

      const derivedAccount = deriveAccountFromUid(address);

      const srcWalletClient = createWalletClient({
        account: derivedAccount,
        chain: srcChain,
        transport: http(),
      });
      const srcPublicClient = createPublicClient({
        chain: srcChain,
        transport: http(),
      });

      /* Deploy Source Pool */
      const layerZeroSrcEndpoint = LAYERZERO_ENDPOINT_ADDRESS[chainId];
      const delegate = derivedAccount.address;
      const expireDate = BigInt(Date.now() / 1000 + 60 * 60 * 24 * daysLocked);

      const { request: deploySrcPoolRequest } = await srcPublicClient.simulateContract({
        account: derivedAccount,
        address: POOL_FACTORY_ADDRESS[chainId],
        abi: poolFactoryAbi,
        functionName: "deploySrcPool",
        args: [
          layerZeroSrcEndpoint,
          delegate,
          collateralChainId,
          asset as `0x${string}`,
          collateralAsset as `0x${string}`,
          BigInt(ltv),
          BigInt(interestRate),
          expireDate,
        ],
      });
      await srcWalletClient.writeContract(deploySrcPoolRequest);

      /* Deploy Destination Pool */
      const dstChain = chains.find((chain) => chain.id === collateralChainId);
      if (!dstChain) throw Error("Chain not found");

      const dstWalletClient = createWalletClient({
        account: derivedAccount,
        chain: dstChain,
        transport: http(),
      });
      const dstPublicClient = createPublicClient({
        chain: dstChain,
        transport: http(),
      });

      const layerZeroDstEndpoint = LAYERZERO_ENDPOINT_ADDRESS[collateralChainId as ChainId];

      const { request: deployDstPoolRequest } = await dstPublicClient.simulateContract({
        account: derivedAccount,
        address: POOL_FACTORY_ADDRESS[chainId],
        abi: poolFactoryAbi,
        functionName: "deployDstPool",
        args: [layerZeroDstEndpoint, delegate, collateralAsset as `0x${string}`, collateralChainId],
      });
      const txnHash = await dstWalletClient.writeContract(deployDstPoolRequest);
      const receipt = await getTransactionReceipt(dstPublicClient, {
        hash: txnHash,
      });

      const log = receipt.logs[0];
      const event = decodeEventLog({
        data: log.data,
        topics: log.topics,
        abi: poolFactoryAbi,
      });

      // @ts-ignore
      const srcPoolAddress = event.args.srcPoolAddress;

      /* Approve */
      const { request: approveRequest } = await srcPublicClient.simulateContract({
        account: derivedAccount,
        address: asset as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [srcPoolAddress, BigInt(amount)],
      });
      await srcWalletClient.writeContract(approveRequest);

      /* Deposit */
      const { request: depositRequest } = await srcPublicClient.simulateContract({
        account: derivedAccount,
        address: srcPoolAddress,
        abi: srcPoolAbi,
        functionName: "deposit",
        args: [BigInt(amount)],
      });
      await srcWalletClient.writeContract(depositRequest);
    },
  });
}
