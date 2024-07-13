"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import { WalletDropdownMenu } from "@/components/wallet/wallet-dropdown";

export const WalletStatus = () => {
  const { address } = useAccount();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal }) => {
        const connected = account && chain;

        if (connected && address) {
          return <WalletDropdownMenu address={address} />;
        }

        return <Button onClick={openConnectModal}>Connect Wallet</Button>;
      }}
    </ConnectButton.Custom>
  );
};
