"use client";

import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";

export const WalletStatus = () => {
  const { setShowAuthFlow } = useDynamicContext();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Button onClick={() => setShowAuthFlow(true)} variant={"accent"}>
        Login
      </Button>
    );
  }

  return <DynamicWidget />;
};
