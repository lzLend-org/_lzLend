import { getChains, readContracts } from "@wagmi/core";

import { poolSrcFactoryAbi } from "@/lib/abis/pool-src-factory";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import { POOL_SRC_FACTORY_ADDRESS } from "@/lib/addresses";
import { assets } from "@/lib/assets";
import { LAYERZERO_ENDPOINT_CONFIG } from "@/lib/layerzero";
import { ChainId, Pool } from "@/lib/types";
import { config } from "@/lib/wagmi";

const allPoolFactories = Object.entries(POOL_SRC_FACTORY_ADDRESS).map(
  ([chainId, address]) =>
    ({
      address,
      chainId: parseInt(chainId) as ChainId,
      abi: poolSrcFactoryAbi,
    }) as const,
);

export interface GetPoolsParams {
  owner?: `0x${string}`;
}

export async function getPoolsMetadata(
  poolAddresses: { chainId: ChainId; address: `0x${string}` }[],
) {
  const chains = getChains(config);

  const poolMetadataResults = await readContracts(config, {
    contracts: poolAddresses.map(
      (poolAddress) =>
        ({
          address: poolAddress.address,
          abi: srcPoolAbi,
          chainId: poolAddress.chainId,
          functionName: "getPoolMetadata",
        }) as const,
    ),
  });

  console.log("poolMetadataResults: ", poolMetadataResults);

  const srcPools: (Pool | null)[] = poolMetadataResults.map((result, index) => {
    const poolMetadata = result.result;
    if (!poolMetadata) return null;

    // console.log("poolMetadata: ", poolMetadata);

    const chainId = (chains.find((chain) => chain.id === poolAddresses[index].chainId)?.id ||
      chains[0].id) as ChainId;

    const asset = assets[chainId].find(
      (asset) => asset.address.toLowerCase() === poolMetadata.poolToken.toLowerCase(),
    );
    if (!asset) return null;

    // console.log("Asset: ", asset);

    const entry = Object.entries(LAYERZERO_ENDPOINT_CONFIG).find(
      ([, config]) => config.id === poolMetadata.dstChainId,
    );
    if (!entry) return null;
    const collateralChainId = parseInt(entry[0]) as ChainId;

    // console.log("collateralChainId: ", collateralChainId);

    const collateralAsset = assets[collateralChainId as ChainId].find(
      (asset) => asset.address.toLowerCase() === poolMetadata.collateralToken.toLowerCase(),
    );
    if (!collateralAsset) return null;

    return {
      chainId,
      asset,
      amount: poolMetadata.poolBalance,
      owner: poolMetadata.poolOwner,
      address: poolAddresses[index].address,
      dstPoolAddress: poolMetadata.dstPoolAddress,
      apr: poolMetadata.apr,
      expireDate: poolMetadata.expiry,
      collateralChainId,
      collateralAsset,
      ltv: poolMetadata.ltv,
    };
  });

  console.log("Src Pools: ", srcPools);

  return srcPools.filter((pool): pool is Pool => pool !== null && pool.amount > BigInt(0));
}

export async function getPools(params?: GetPoolsParams): Promise<Pool[]> {
  const { owner } = params || {};

  const poolResults = await readContracts(config, {
    contracts: allPoolFactories.map(
      (poolFactory) =>
        ({
          address: poolFactory.address,
          abi: poolFactory.abi,
          chainId: poolFactory.chainId,
          functionName: owner ? "getSrcPoolsByOwner" : "getAllSrcPools",
          args: owner ? [owner] : undefined,
        }) as const,
    ),
  });

  console.log("poolResults", poolResults);

  // console.log("poolResults: ", poolResults);

  const poolAddresses: { chainId: ChainId; address: `0x${string}` }[] = [];

  poolResults.forEach((result, index) => {
    result.result?.forEach((poolAddress) => {
      poolAddresses.push({
        chainId: allPoolFactories[index].chainId,
        address: poolAddress,
      });
    });
  });

  console.log("poolAddresses: ", poolAddresses);

  return getPoolsMetadata(poolAddresses);
}

export async function getListedPools() {
  const poolResults = await readContracts(config, {
    contracts: allPoolFactories.map(
      (poolFactory) =>
        ({
          address: poolFactory.address,
          abi: poolFactory.abi,
          chainId: poolFactory.chainId,
          functionName: "getListedSrcPools",
        }) as const,
    ),
  });

  console.log("poolResults", poolResults);

  const poolAddresses: { chainId: ChainId; address: `0x${string}` }[] = [];

  poolResults.forEach((result, index) => {
    result.result?.forEach((poolAddress) => {
      poolAddresses.push({
        chainId: allPoolFactories[index].chainId,
        address: poolAddress,
      });
    });
  });

  return getPoolsMetadata(poolAddresses);
}
