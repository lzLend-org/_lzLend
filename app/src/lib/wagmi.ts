import { http } from "viem";
import { arbitrumSepolia, baseSepolia, mainnet, scrollSepolia, sepolia } from "viem/chains";
import { createConfig } from "wagmi";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrumSepolia, baseSepolia, scrollSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [scrollSepolia.id]: http(),
  },
});
