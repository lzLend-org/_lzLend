"use client";

// import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { SettingsModal } from "@/components/settings-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { WalletStatus } from "@/components/wallet/wallet-status";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="container flex h-20 items-center justify-between">
      <Logo />

      <div className="flex items-center gap-2 duration-100 animate-in fade-in">
        <nav className="mr-2 hidden items-center gap-5 md:flex">
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
        <Button onClick={() => setIsModalOpen(true)} variant={"outline"} size="icon">
          <Settings className="size-5 group-disabled:opacity-30" strokeWidth={1.6} />
        </Button>
        <ThemeToggle />
        <SettingsModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        <WalletStatus />
        {/* <DynamicWidget innerButtonComponent={<>Login</>} /> */}
        {/* <ChainSwitch /> */}
      </div>
    </header>
  );
}
