import { ChevronDownIcon } from "lucide-react";
import { useChainId, useChains, useSwitchChain } from "wagmi";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const ChainSwitch = () => {
  const chainId = useChainId();
  const chains = useChains();
  const { switchChain } = useSwitchChain();

  const currentChain = chains.find((chain) => chain.id === chainId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          {currentChain?.name || "Unsupported network"}
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() =>
              switchChain({
                // @ts-ignore
                chainId: chain.id,
              })
            }
          >
            {chain.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
