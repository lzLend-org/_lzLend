"use client";

// import { ChainSwitch } from "@/components/chain-switch";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";

// import { ChainSwitch } from "@/components/chain-switch";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
// import { WalletStatus } from "@/components/wallet/wallet-status";
// import { WalletStatus } from "@/components/wallet/wallet-status";

export function Header() {
  const { isConnecting, isReconnecting } = useAccount();

  console.log("isConnecting", isConnecting);
  console.log("isReconnecting", isReconnecting);

  return (
    <header className="container flex h-20 items-center justify-between">
      <Logo />

      <div className="flex items-center gap-2 duration-100 animate-in fade-in">
        <ThemeToggle />
        <DynamicWidget />
        {/* <ChainSwitch /> */}
        {/* <WalletStatus /> */}
      </div>
    </header>
  );
}
