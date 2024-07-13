import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { useChains } from "wagmi";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { assets } from "@/lib/assets";
import { Pool } from "@/lib/types";

const getCreateLoanSchema = (max: number) =>
  z.object({
    amount: z.number().positive().lte(max),
    collateralAsset: z.string().min(1),
  });

type CreateLoanData = z.infer<ReturnType<typeof getCreateLoanSchema>>;

interface NewLoanModalProps extends BaseDialogProps {
  pool: Pool;
}

export function NewLoanModal({ pool, open, onOpenChange }: NewLoanModalProps) {
  const chainId = useChainId();
  const chains = useChains();
  const chainAssets = assets[chainId];

  const form = useForm<CreateLoanData>({
    resolver: zodResolver(getCreateLoanSchema(Number(pool.amount))),
    defaultValues: {
      amount: 0,
      collateralAsset: chainAssets[0].address,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

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
        <h2 className="text-xl font-semibold">Borrow</h2>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Chain</div>
              <div className="font-medium">{pool.chain}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Asset</div>
              <div className="font-medium">{pool.asset.symbol}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Interest Rate</div>
              <div className="font-medium">{formatEther(pool.apr)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Collateral Chain</div>
              <div className="font-medium">
                {chains.find((chain) => chain.id === pool.collateralChainId)?.name}
              </div>
            </div>
            {/* <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Collateral</div>
            <div className="font-medium">30 USDC</div>
          </div> */}
            <Separator className="my-3" />

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
                tabIndex={-1}
                step={0.01}
                // disabled={isPending}
                {...register("amount", { valueAsNumber: true })}
              />
              {errors?.amount && (
                <p className="px-1 text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="collateralAsset"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="mb-2 block">Collateral Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chainAssets.map((asset) => (
                        <SelectItem key={asset.symbol} value={asset.address}>
                          {asset.name} ({asset.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Borrow
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
