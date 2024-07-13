"use client";

// import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletStatus } from "@/components/wallet/wallet-status";

export function Header() {
  return (
    <header className="container flex h-20 items-center justify-between">
      <Logo />

      <div className="flex items-center gap-4 duration-100 animate-in fade-in">
        <nav className="hidden items-center gap-5 md:flex">
          <Link
            href="/"
            className="flex cursor-pointer items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/pools"
            className="flex cursor-pointer items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            Pools
          </Link>
          <Link
            href="/marketplace"
            className="flex cursor-pointer items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            Marketplace
          </Link>
        </nav>
        <ThemeToggle />
        {/* <DynamicWidget innerButtonComponent={<>Login</>} /> */}
        <WalletStatus />
        {/* <ChainSwitch /> */}
      </div>
    </header>
  );
}
