import { Copy, ExternalLink, LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";

import { Address } from "@/components/address";
import { AddressAvatar } from "@/components/address-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard, getAddressExplorerLink } from "@/lib/utils";

interface WalletDropdownMenuProps {
  address: `0x${string}`;
}

export const WalletDropdownMenu = ({ address }: WalletDropdownMenuProps) => {
  const { disconnect } = useDisconnect();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <AddressAvatar address={address} />
          <Address address={address} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => copyToClipboard(address)}>
          <Copy className="mr-2 size-4" />
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={getAddressExplorerLink(address)} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 size-4" />
            See in explorer
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => disconnect()}>
          <LogOut className="mr-2 size-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
