import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { mainnet } from "viem/chains";
import { useChains } from "wagmi";

import { poolFactoryAbi } from "@/lib/abis/pool-factory";
import { srcPoolAbi } from "@/lib/abis/src-pool";
import { POOL_FACTORY_ADDRESS } from "@/lib/addresses";
import { USDC } from "@/lib/assets";
import { ChainId, Deposit } from "@/lib/types";
import { config } from "@/lib/wagmi";

const allPoolFactories = Object.entries(POOL_FACTORY_ADDRESS).map(
  ([chainId, address]) =>
    ({
      address,
      chainId: parseInt(chainId) as ChainId,
      abi: poolFactoryAbi,
    }) as const,
);

interface UsePoolsParams {
  owner?: `0x${string}`;
}

export function usePools({ owner }: UsePoolsParams) {
  const chains = useChains();

  return useQuery<Deposit[]>({
    queryKey: ["pools"],
    queryFn: async () => {
      const results = await readContracts(config, {
        contracts: allPoolFactories.map((poolFactory) => ({
          address: poolFactory.address,
          abi: poolFactory.abi,
          chainId: poolFactory.chainId,
          functionName: owner ? "getAllSrcPools" : "getSrcPoolsByOwner",
          args: owner ? [owner] : undefined,
        })),
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
        contracts: poolAddresses.map((poolAddress) => ({
          address: poolAddress.address,
          abi: srcPoolAbi,
          chainId: poolAddress.chainId,
          functionName: "poolBalance",
        })),
      });

      const srcPools: Deposit[] = results2.map((result, index) => {
        const chain = (chains.find((chain) => chain.id === poolAddresses[index].chainId)?.id ||
          chains[0].id) as ChainId;

        return {
          chain,
          asset: USDC,
          amount: result.result as number,
          owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
          interestRate: "2%",
          unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 30,
          collateralChainId: mainnet.id,
          ltv: 0.5,
        };
      });

      return srcPools;
    },
  });
}
