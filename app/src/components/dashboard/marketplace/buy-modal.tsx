// import { useChainId } from "wagmi";
import { formatUnits } from "viem";
import { useChains } from "wagmi";

import { Button } from "@/components/ui/button";
import { BaseDialogProps, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useBuyPool } from "@/lib/hooks/marketplace/use-buy-pool";
import { Pool } from "@/lib/types";
import { APR_DECIMALS, LTV_DECIMALS } from "@/lib/utils";

interface BuyModalProps extends BaseDialogProps {
  pool: Pool;
}

export function BuyModal({ pool, open, onOpenChange }: BuyModalProps) {
  const chains = useChains();

  const { mutate: buyPool, isPending } = useBuyPool({
    pool,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
      }}
      modal={true}
    >
      <DialogContent className="flex max-h-[90vh] max-w-md flex-col px-6">
        <DialogTitle className="text-xl font-semibold">Buy Pool</DialogTitle>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">Chain</div>
          <div className="font-medium">
            {chains.find((chain) => chain.id === pool.chainId)?.name}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">Asset</div>
          <div className="font-medium">{pool.asset.symbol}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">Interest Rate</div>
          <div className="font-medium">{formatUnits(pool.apr, APR_DECIMALS)}%</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">LTV</div>
          <div className="font-medium">{formatUnits(pool.ltv, LTV_DECIMALS)}%</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">Collateral Chain</div>
          <div className="font-medium">
            {chains.find((chain) => chain.id === pool.collateralChainId)?.name}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">Collateral Asset</div>
          <div className="font-medium">{pool.collateralAsset.symbol}</div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => buyPool()} disabled={isPending} loading={isPending}>
            Buy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
