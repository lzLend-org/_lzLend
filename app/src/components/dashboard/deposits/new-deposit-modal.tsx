import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useChainId } from "wagmi";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assets } from "@/lib/assets";

const createDepositSchema = z.object({
  asset: z.string().min(1),
  amount: z.number().gt(0),
  interestRate: z.number().gt(0),
  daysLocked: z.number().gt(0),
});

type CreateDepositData = z.infer<typeof createDepositSchema>;

export function NewDepositModal({ open, onOpenChange }: BaseDialogProps) {
  const chainId = useChainId();
  const chainAssets = assets[chainId];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDepositData>({
    resolver: zodResolver(createDepositSchema),
    defaultValues: {
      asset: chainAssets[0].address,
      amount: 0,
      interestRate: 0,
      daysLocked: 30,
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        reset();
      }}
      modal={true}
    >
      <DialogContent className="flex max-h-[90vh] max-w-md flex-col px-6">
        <h2 className="text-xl font-semibold">New Deposit</h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <Label className="mb-2 block" htmlFor="name">
              Asset
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {chainAssets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.address}>
                    {asset.name} ({asset.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="name">
              Amount
            </Label>
            <Input
              id="name"
              type="number"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              step={0.01}
              // disabled={isPending}
              {...register("amount", { valueAsNumber: true })}
            />
            {errors?.amount && (
              <p className="px-1 text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="name">
              Interest Rate (%)
            </Label>
            <Input
              id="name"
              type="number"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              step={0.01}
              // disabled={isPending}
              {...register("interestRate", { valueAsNumber: true })}
            />
            {errors?.interestRate && (
              <p className="px-1 text-xs text-destructive">{errors.interestRate.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="name">
              Days Locked
            </Label>
            <Input
              id="name"
              type="number"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              step={1}
              // disabled={isPending}
              {...register("daysLocked", { valueAsNumber: true })}
            />
            {errors?.daysLocked && (
              <p className="px-1 text-xs text-destructive">{errors.daysLocked.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              // disabled={isPending}
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
            // disabled={isPending}
            // loading={isPending}
            >
              Deposit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
