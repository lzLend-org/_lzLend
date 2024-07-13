"use client";

import { useConnect, useConnectors } from "wagmi";

import { Button } from "@/components/ui/button";
// import { WalletDropdownMenu } from "@/components/wallet/wallet-dropdown";

export const WalletStatus = () => {
  // const { address, isConnected } = useAccount();

  const connectors = useConnectors();
  const { connect } = useConnect();

  console.log("connectors: ", connectors);

  // return (
  //   <ConnectButton.Custom>
  //     {({ account, chain, openConnectModal }) => {
  //       const connected = account && chain;

  //       if (connected && address) {
  //         return <WalletDropdownMenu address={address} />;
  //       }

  //       return <Button onClick={openConnectModal}>Connect Wallet</Button>;
  //     }}
  //   </ConnectButton.Custom>
  // );

  return (
    <div>
      <Button
        onClick={() =>
          connect({
            connector: connectors[0],
          })
        }
      >
        Connect
      </Button>
    </div>
  );
};
