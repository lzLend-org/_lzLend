// import { useChainId } from "wagmi";
import { formatUnits } from "viem";
import { useChains } from "wagmi";

import { Button } from "@/components/ui/button";
import { BaseDialogProps, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useListPool } from "@/lib/hooks/marketplace/use-list-pool";
import { Pool } from "@/lib/types";
import { APR_DECIMALS, LTV_DECIMALS } from "@/lib/utils";

interface ListModalProps extends BaseDialogProps {
  pool: Pool;
}

export function ListModal({ pool, open, onOpenChange }: ListModalProps) {
  // const chainId = useChainId();
  const chains = useChains();
  // const chainAssets = assets[chainId];

  const { mutate: listPool, isPending } = useListPool({
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
        <DialogTitle className="text-xl font-semibold">List Pool</DialogTitle>

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

        <Separator className="my-3" />

        <div>
          <Label className="mb-2 block" htmlFor="name">
            Price ({pool.asset.symbol})
          </Label>
          <Input
            id="name"
            type="number"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            tabIndex={-1}
            step={0.01}
            disabled={isPending}
          />
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
          <Button onClick={() => listPool()} disabled={isPending} loading={isPending}>
            List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
