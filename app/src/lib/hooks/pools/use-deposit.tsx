import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  createWalletClient,
  http,
  erc20Abi,
  createPublicClient,
  decodeEventLog,
  parseUnits,
} from "viem";
import { getTransactionReceipt } from "viem/actions";
import { useAccount, useChainId, useChains } from "wagmi";
import { z } from "zod";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { toast } from "@/components/ui/use-toast";
import { poolFactoryAbi } from "@/lib/abis/pool-factory";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import { POOL_FACTORY_ADDRESS } from "@/lib/addresses";
import { assets } from "@/lib/assets";
import { LAYERZERO_ENDPOINT_CONFIG } from "@/lib/layerzero";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId } from "@/lib/types";
import { APR_DECIMALS, LTV_DECIMALS, deriveAccountFromUid } from "@/lib/utils";

export const depositSchema = z.object({
  asset: z.string().min(1),
  amount: z.number().gt(0),
  interestRate: z.number().gt(0),
  daysLocked: z.number().gt(0),
  collateralChainId: z.number().gt(0),
  collateralAsset: z.string().min(1),
  ltv: z.number().gt(0).max(100),
});

export type DepositData = z.infer<typeof depositSchema>;

type UseDepositOptions = Omit<
  UseMutationOptions<string, Error, DepositData, unknown>,
  "mutationFn"
>;

export function useDeposit(options?: UseDepositOptions) {
  const chainId = useChainId();
  const chains = useChains();
  const { address } = useAccount();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

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
      // return "0xd368d878588a0ff60ce504d22b09c3fc7864ce678b6927d696606062637964b3";
      if (!address) throw Error("Address not found");

      const srcChain = chains.find((chain) => chain.id === chainId);
      if (!srcChain) throw Error("Chain not found");

      const derivedAccount = deriveAccountFromUid(address);
      const account = isDerivedAccountEnabled ? derivedAccount : undefined;

      const srcWalletClient = createWalletClient({
        account,
        chain: srcChain,
        transport: http(),
      });
      const srcPublicClient = createPublicClient({
        chain: srcChain,
        transport: http(),
      });

      /* ------- Deploy Destination Pool ------- */
      const dstChain = chains.find((chain) => chain.id === collateralChainId);
      if (!dstChain) throw Error("Chain not found");

      const dstWalletClient = createWalletClient({
        account,
        chain: dstChain,
        transport: http(),
      });
      const dstPublicClient = createPublicClient({
        chain: dstChain,
        transport: http(),
      });

      const layerZeroDstEndpoint = LAYERZERO_ENDPOINT_CONFIG[collateralChainId as ChainId];
      const layerZeroDstEndpointAddress = layerZeroDstEndpoint.address;
      const LayerZeroDstEndpointId = layerZeroDstEndpoint.id;
      const delegate = account?.address || address;

      const { request: deployDstPoolRequest } = await dstPublicClient.simulateContract({
        account,
        address: POOL_FACTORY_ADDRESS[chainId],
        abi: poolFactoryAbi,
        functionName: "deployDstPool",
        args: [
          layerZeroDstEndpointAddress,
          delegate,
          collateralAsset as `0x${string}`,
          LayerZeroDstEndpointId,
        ],
      });
      const deployDstTxnHash = await dstWalletClient.writeContract(deployDstPoolRequest);
      const receipt = await getTransactionReceipt(dstPublicClient, {
        hash: deployDstTxnHash,
      });

      let dstPoolAddress: `0x${string}` | undefined = undefined;

      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        const event = decodeEventLog({
          data: log.data,
          topics: log.topics,
          abi: poolFactoryAbi,
        });
        if (event.eventName === "DeployedDstPool") {
          dstPoolAddress = event.args.dstPoolAddress;
          break;
        }
      }

      if (!dstPoolAddress) throw Error("Destination pool address not found");

      toast({
        title: "Deployed destination pool",
        description: "Successfully deployed destination pool.",
        action: <TransactionLinkButton chainId={chainId} txnHash={deployDstTxnHash} />,
        variant: "default",
      });

      /* ------- Deploy Source Pool ------- */
      const layerZeroSrcEndpoint = LAYERZERO_ENDPOINT_CONFIG[chainId].address;
      const expireDate = BigInt(Date.now() / 1000 + 60 * 60 * 24 * daysLocked);
      const parsedLtv = parseUnits(ltv.toString(), LTV_DECIMALS);
      const parsedApr = parseUnits(interestRate.toString(), APR_DECIMALS);

      const { request: deploySrcPoolRequest } = await srcPublicClient.simulateContract({
        account,
        address: POOL_FACTORY_ADDRESS[chainId],
        abi: poolFactoryAbi,
        functionName: "deploySrcPool",
        args: [
          layerZeroSrcEndpoint,
          delegate,
          LayerZeroDstEndpointId,
          dstPoolAddress,
          asset as `0x${string}`,
          collateralAsset as `0x${string}`,
          parsedLtv,
          parsedApr,
          expireDate,
        ],
      });
      const deploySrcTxnHash = await srcWalletClient.writeContract(deploySrcPoolRequest);

      let srcPoolAddress: `0x${string}` | undefined = undefined;

      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        const event = decodeEventLog({
          data: log.data,
          topics: log.topics,
          abi: poolFactoryAbi,
        });
        if (event.eventName === "DeployedSrcPool") {
          dstPoolAddress = event.args.srcPoolAddress;
          break;
        }
      }

      if (!srcPoolAddress) throw Error("Source pool address not found");

      toast({
        title: "Deployed source pool",
        description: "Successfully deployed source pool.",
        action: <TransactionLinkButton chainId={chainId} txnHash={deploySrcTxnHash} />,
        variant: "default",
      });

      /* ------- Approve ------- */
      const depositAsset = assets[chainId].find((a) => a.symbol === asset);
      if (!depositAsset) throw Error("Deposit asset not found");

      const depositAmount = parseUnits(amount.toString(), depositAsset.decimals);
      const { request: approveRequest } = await srcPublicClient.simulateContract({
        account,
        address: asset as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [srcPoolAddress, depositAmount],
      });
      const approveTxnHash = await srcWalletClient.writeContract(approveRequest);

      toast({
        title: "Approved tokens",
        description: "Successfully approved tokens.",
        action: <TransactionLinkButton chainId={chainId} txnHash={approveTxnHash} />,
        variant: "default",
      });

      /* ------- Deposit -------*/
      const { request: depositRequest } = await srcPublicClient.simulateContract({
        account,
        address: srcPoolAddress,
        abi: srcPoolAbi,
        functionName: "deposit",
        args: [depositAmount],
      });
      return await srcWalletClient.writeContract(depositRequest);
    },
    onSuccess(txnHash, variables, context) {
      toast({
        title: "Deposit Successfull!",
        description: (
          <p>
            Your deposit was successfull.
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
        action: <TransactionLinkButton chainId={chainId} txnHash={txnHash} />,
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
    ...options,
  });
}
