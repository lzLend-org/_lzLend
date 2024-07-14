"use client";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { env } from "@/env.mjs";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

// const cssOverrides = `
// .dynamic-shadow-dom {
//   --dynamic-font-family-primary: "General Sans", sans-serif;
//   --dynamic-connect-button-background-hover: #eee !important;
// }

// button {
//   height: 40px;
// }
// `;

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DynamicContextProvider
        settings={{
          environmentId: env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
          // cssOverrides,
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </ThemeProvider>
  );
}
