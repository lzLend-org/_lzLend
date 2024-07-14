import { UseMutationOptions, useMutation } from "@tanstack/react-query";
// import { getWalletClient } from "@wagmi/core";
import { useAtomValue } from "jotai";
import {
  createWalletClient,
  http,
  erc20Abi,
  createPublicClient,
  decodeEventLog,
  parseUnits,
} from "viem";
import { useAccount, useChainId, useChains } from "wagmi";
import { z } from "zod";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { toast } from "@/components/ui/use-toast";
import { dstPoolAbi } from "@/lib/abis/dst-pool";
import { poolDstFactoryAbi } from "@/lib/abis/pool-dst-factory";
import { poolSrcFactoryAbi } from "@/lib/abis/pool-src-factory";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import {
  ORACLE_ADDRESS,
  POOL_DST_FACTORY_ADDRESS,
  POOL_SRC_FACTORY_ADDRESS,
} from "@/lib/addresses";
import { assets } from "@/lib/assets";
import { LAYERZERO_ENDPOINT_CONFIG } from "@/lib/layerzero";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";
import { ChainId } from "@/lib/types";
import { APR_DECIMALS, LTV_DECIMALS, deriveAccountFromUid, padAddress } from "@/lib/utils";
// import { config } from "@/lib/wagmi";

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
  // const { data: walletClient } = useWalletClient();

  const isDerivedAccountEnabled = useAtomValue(isDerivedAccountEnabledAtom);

  return useMutation({
    mutationFn: async ({
      asset: loanAssetAddress,
      amount,
      collateralChainId,
      collateralAsset: collateralAssetAddress,
      ltv,
      interestRate,
      daysLocked,
    }: DepositData) => {
      // if (!walletClient) throw Error("Wallet client not found");

      // return "0xd368d878588a0ff60ce504d22b09c3fc7864ce678b6927d696606062637964b3";
      if (!address) throw Error("Address not found");

      const srcChain = chains.find((chain) => chain.id === chainId);
      if (!srcChain) throw Error("Chain not found");

      const derivedAccount = deriveAccountFromUid(address);
      const account = isDerivedAccountEnabled ? derivedAccount : address;
      const userAddress = isDerivedAccountEnabled ? derivedAccount.address : address;

      console.log("Account: ", account);

      // const defaultWalletClient = await getWalletClient(config);
      // const srcWalletClient = isDerivedAccountEnabled
      //   ? createWalletClient({
      //       account,
      //       chain: srcChain,
      //       transport: http(),
      //     })
      //   : defaultWalletClient;
      const srcWalletClient = createWalletClient({
        account,
        chain: srcChain,
        transport: http(),
      });

      // const addresses = await srcWalletClient.getAddresses();
      // console.log("Addresses: ", addresses);

      const srcPublicClient = createPublicClient({
        chain: srcChain,
        transport: http(),
      });

      /* ------- Deploy Destination Pool ------- */
      const dstChain = chains.find((chain) => chain.id === collateralChainId);
      if (!dstChain) throw Error("Chain not found");

      // const dstWalletClient = isDerivedAccountEnabled
      //   ? createWalletClient({
      //       account,
      //       chain: dstChain,
      //       transport: http(),
      //     })
      //   : defaultWalletClient;
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
      const layerZeroDstEndpointId = layerZeroDstEndpoint.id;

      const layerZeroSrcEndpoint = LAYERZERO_ENDPOINT_CONFIG[chainId];
      const layerZeroSrcEndpointId = layerZeroSrcEndpoint.id;
      const layerZeroSrcEndpointAddress = layerZeroSrcEndpoint.address;

      const { request: deployDstPoolRequest } = await dstPublicClient.simulateContract({
        account,
        address: POOL_DST_FACTORY_ADDRESS[collateralChainId as ChainId],
        abi: poolDstFactoryAbi,
        functionName: "deployDstPool",
        args: [
          layerZeroDstEndpointAddress,
          userAddress,
          collateralAssetAddress as `0x${string}`,
          layerZeroSrcEndpointId,
        ],
      });
      const deployDstTxnHash = await dstWalletClient.writeContract(deployDstPoolRequest);
      const deployDstReceipt = await dstPublicClient.waitForTransactionReceipt({
        hash: deployDstTxnHash,
      });

      const deployDstLog = deployDstReceipt.logs[2];
      const deployDstEvent = decodeEventLog({
        data: deployDstLog.data,
        topics: deployDstLog.topics,
        abi: poolDstFactoryAbi,
        eventName: "DeployedDstPool",
      });
      const dstPoolAddress = deployDstEvent.args.dstPoolAddress;

      // let dstPoolAddress: `0x${string}` | undefined = undefined;
      //
      // for (let i = 1; i < deployDstReceipt.logs.length; i++) {
      //   const log = deployDstReceipt.logs[i];
      //   console.log("Log: ", log);

      //   const event = decodeEventLog({
      //     data: log.data,
      //     topics: log.topics,
      //     abi: poolDstFactoryAbi,
      //     eventName: "DeployedDstPool",
      //   });

      //   if (event.eventName === "DeployedDstPool") {
      //     dstPoolAddress = event.args.dstPoolAddress;
      //     break;
      //   }
      // }
      //
      // if (!dstPoolAddress) throw Error("Destination pool address not found");

      toast({
        title: "Deployed destination pool",
        description: "Successfully deployed destination pool.",
        action: <TransactionLinkButton chainId={chainId} txnHash={deployDstTxnHash} />,
        variant: "default",
      });

      console.log("Deployed destination pool: ", dstPoolAddress, deployDstTxnHash);

      /* ------- Deploy Source Pool ------- */
      const expireDate = BigInt(Math.round(Date.now() / 1000 + 60 * 60 * 24 * daysLocked));
      const parsedLtv = parseUnits(ltv.toString(), LTV_DECIMALS);
      const parsedApr = parseUnits(interestRate.toString(), APR_DECIMALS);
      const oracleAddress = ORACLE_ADDRESS[chainId];

      const loanAsset = assets[chainId].find((a) => a.address === loanAssetAddress);
      if (!loanAsset) throw Error("Loan asset not found");

      const collateralAsset = assets[collateralChainId as ChainId].find(
        (a) => a.address === collateralAssetAddress,
      );
      if (!collateralAsset) throw Error("Collateral asset not found");

      const oraclePricesIndex = [
        BigInt(loanAsset.oraclePriceIndex),
        BigInt(collateralAsset.oraclePriceIndex),
      ];

      console.log("loanAssetAddress", loanAssetAddress);

      const { request: deploySrcPoolRequest } = await srcPublicClient.simulateContract({
        account,
        address: POOL_SRC_FACTORY_ADDRESS[chainId],
        abi: poolSrcFactoryAbi,
        functionName: "deploySrcPool",
        args: [
          layerZeroSrcEndpointAddress,
          userAddress,
          layerZeroDstEndpointId,
          dstPoolAddress,
          loanAssetAddress as `0x${string}`,
          oracleAddress,
          oraclePricesIndex,
          collateralAssetAddress as `0x${string}`,
          parsedLtv,
          parsedApr,
          expireDate,
        ],
      });
      const deploySrcTxnHash = await srcWalletClient.writeContract(deploySrcPoolRequest);
      const deploySrcReceipt = await srcPublicClient.waitForTransactionReceipt({
        hash: deploySrcTxnHash,
      });

      const deploySrcLog = deploySrcReceipt.logs[2];
      const deploySrcEvent = decodeEventLog({
        data: deploySrcLog.data,
        topics: deploySrcLog.topics,
        abi: poolSrcFactoryAbi,
        eventName: "DeployedSrcPool",
      });
      const srcPoolAddress = deploySrcEvent.args.srcPoolAddress;

      // let srcPoolAddress: `0x${string}` | undefined = undefined;

      // for (let i = 0; i < deploySrcReceipt.logs.length; i++) {
      //   const log = deploySrcReceipt.logs[i];
      //   const event = decodeEventLog({
      //     data: log.data,
      //     topics: log.topics,
      //     abi: poolSrcFactoryAbi,
      //   });
      //   if (event.eventName === "DeployedSrcPool") {
      //     srcPoolAddress = event.args.srcPoolAddress;
      //     break;
      //   }
      // }

      // if (!srcPoolAddress) throw Error("Source pool address not found");

      toast({
        title: "Deployed source pool",
        description: "Successfully deployed source pool.",
        action: <TransactionLinkButton chainId={chainId} txnHash={deploySrcTxnHash} />,
        variant: "default",
      });

      console.log("Deployed source pool: ", srcPoolAddress, deploySrcTxnHash);

      /* ------- Set Peer on Destination Pool ------- */
      const { request: setPeerOnDst } = await dstPublicClient.simulateContract({
        account,
        address: dstPoolAddress,
        abi: dstPoolAbi,
        functionName: "setPeer",
        args: [layerZeroSrcEndpointId, padAddress(srcPoolAddress)],
      });
      const setPeerOnDstTxnHash = await dstWalletClient.writeContract(setPeerOnDst);
      await dstPublicClient.waitForTransactionReceipt({
        hash: setPeerOnDstTxnHash,
      });

      toast({
        title: "Set peer on destination pool",
        description: "Successfully set peer on destination pool.",
        action: <TransactionLinkButton chainId={chainId} txnHash={setPeerOnDstTxnHash} />,
        variant: "default",
      });

      console.log("Set peer on destination pool: ", setPeerOnDstTxnHash);

      /* ------- Set Peer on Source Pool ------- */
      const { request: setPeerOnSrc } = await srcPublicClient.simulateContract({
        account,
        address: srcPoolAddress,
        abi: srcPoolAbi,
        functionName: "setPeer",
        args: [layerZeroDstEndpointId, padAddress(dstPoolAddress)],
      });
      const setPeerOnSrcTxnHash = await srcWalletClient.writeContract(setPeerOnSrc);
      await srcPublicClient.waitForTransactionReceipt({
        hash: setPeerOnSrcTxnHash,
      });

      toast({
        title: "Set peer on source pool",
        description: "Successfully set peer on source pool.",
        action: <TransactionLinkButton chainId={chainId} txnHash={setPeerOnSrcTxnHash} />,
        variant: "default",
      });

      console.log("Set peer on source pool: ", setPeerOnDstTxnHash);

      /* ------- Approve ------- */
      const depositAsset = assets[chainId].find((a) => a.address === loanAssetAddress);
      if (!depositAsset) throw Error("Deposit asset not found");

      const depositAmount = parseUnits(amount.toString(), depositAsset.decimals);
      const { request: approveRequest } = await srcPublicClient.simulateContract({
        account,
        address: loanAssetAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [srcPoolAddress, depositAmount],
      });
      const approveTxnHash = await srcWalletClient.writeContract(approveRequest);
      await srcPublicClient.waitForTransactionReceipt({
        hash: approveTxnHash,
      });

      toast({
        title: "Approved tokens",
        description: "Successfully approved tokens.",
        action: <TransactionLinkButton chainId={chainId} txnHash={approveTxnHash} />,
        variant: "default",
      });

      console.log("Approved token: ", approveTxnHash);

      /* ------- Deposit -------*/
      const { request: depositRequest } = await srcPublicClient.simulateContract({
        account,
        address: srcPoolAddress,
        abi: srcPoolAbi,
        functionName: "deposit",
        args: [depositAmount],
      });
      const depositTxnHash = await srcWalletClient.writeContract(depositRequest);
      await srcPublicClient.waitForTransactionReceipt({
        hash: depositTxnHash,
      });

      toast({
        title: "Deposit Successfull!",
        description: "Your deposit was successfull",
        action: <TransactionLinkButton chainId={chainId} txnHash={depositTxnHash} />,
        variant: "default",
      });

      return depositTxnHash;
    },
    onSuccess(txnHash, variables, context) {
      options?.onSuccess?.(txnHash, variables, context);
    },
    onError(error, variables, context) {
      console.log("Error: ", error.message);

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
