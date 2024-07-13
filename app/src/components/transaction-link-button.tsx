import { Button } from "@/components/ui/button";
import { getExplorerTransactionUrl } from "@/lib/explorer";
import { ChainId } from "@/lib/types";

interface TransactionLinkButtonProps {
  chainId: ChainId;
  txnHash: `0x${string}`;
}

export function TransactionLinkButton({ chainId, txnHash }: TransactionLinkButtonProps) {
  return (
    <Button size={"sm"}>
      <a
        href={getExplorerTransactionUrl(chainId, txnHash)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs"
      >
        See on Blockscout
      </a>
    </Button>
  );
}
