import { getChains, readContracts } from "@wagmi/core";

import { poolFactoryAbi } from "@/lib/abis/pool-factory";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import { POOL_FACTORY_ADDRESS } from "@/lib/addresses";
import { USDC, assets } from "@/lib/assets";
import { ChainId, Pool } from "@/lib/types";
import { config } from "@/lib/wagmi";

const allPoolFactories = Object.entries(POOL_FACTORY_ADDRESS).map(
  ([chainId, address]) =>
    ({
      address,
      chainId: parseInt(chainId) as ChainId,
      abi: poolFactoryAbi,
    }) as const,
);

export interface GetPoolsParams {
  owner?: `0x${string}`;
}

export async function getPools(params?: GetPoolsParams): Promise<Pool[]> {
  const { owner } = params || {};

  const chains = getChains(config);

  const results = await readContracts(config, {
    contracts: allPoolFactories.map(
      (poolFactory) =>
        ({
          address: poolFactory.address,
          abi: poolFactory.abi,
          chainId: poolFactory.chainId,
          functionName: owner ? "getAllSrcPools" : "getSrcPoolsByOwner",
          args: owner ? [owner] : undefined,
        }) as const,
    ),
  });

  const poolAddresses: { chainId: ChainId; address: `0x${string}` }[] = [];

  results.forEach((result, index) => {
    result.result?.forEach((poolAddress) => {
      poolAddresses.push({
        chainId: allPoolFactories[index].chainId,
        address: poolAddress,
      });
    });
  });

  const results2 = await readContracts(config, {
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

  const srcPools: (Pool | null)[] = results2.map((result, index) => {
    const poolMetadata = result.result;
    if (!poolMetadata) return null;

    const chainId = (chains.find((chain) => chain.id === poolAddresses[index].chainId)?.id ||
      chains[0].id) as ChainId;

    const asset = assets[chainId].find((asset) => asset.address === poolMetadata.poolToken) || USDC;
    const collateralAsset =
      assets[chainId].find((asset) => asset.address === poolMetadata.collateralToken) || USDC;

    return {
      chainId,
      asset,
      amount: poolMetadata.poolBalance,
      owner: poolMetadata.poolOwner,
      address: poolAddresses[index].address,
      apr: poolMetadata.apr,
      expireDate: poolMetadata.expiry,
      collateralChainId: poolMetadata.dstChainId as ChainId,
      collateralAsset,
      ltv: poolMetadata.ltv,
    };
  });

  return srcPools.filter((pool): pool is Pool => pool !== null);
}
