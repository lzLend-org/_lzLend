import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useChainId } from "wagmi";
import { useChains } from "wagmi";

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
import { assets } from "@/lib/assets";
import { DepositData, depositSchema, useDeposit } from "@/lib/hooks/pools/use-deposit";
import { ChainId } from "@/lib/types";

export function DepositModal({ open, onOpenChange }: BaseDialogProps) {
  const chainId = useChainId();
  const chains = useChains();
  const chainAssets = assets[chainId];

  const form = useForm<DepositData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      asset: chainAssets[0].address,
      amount: 1,
      ltv: 50,
      interestRate: 5,
      daysLocked: 30,
      collateralChainId: chains[0].id,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = form;
  const collateralChainId = watch("collateralChainId");
  const collateralChainAssets = assets[collateralChainId as ChainId];

  const { mutate: deposit, isPending } = useDeposit();

  const onSubmit = handleSubmit((data) => {
    deposit(data);
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

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="mb-2 block">Asset</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
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
                disabled={isPending}
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
                disabled={isPending}
                {...register("interestRate", { valueAsNumber: true })}
              />
              {errors?.interestRate && (
                <p className="px-1 text-xs text-destructive">{errors.interestRate.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block" htmlFor="name">
                LTV (%)
              </Label>
              <Input
                id="name"
                type="number"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                step={0.01}
                disabled={isPending}
                {...register("ltv", { valueAsNumber: true })}
              />
              {errors?.ltv && <p className="px-1 text-xs text-destructive">{errors.ltv.message}</p>}
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
                disabled={isPending}
                {...register("daysLocked", { valueAsNumber: true })}
              />
              {errors?.daysLocked && (
                <p className="px-1 text-xs text-destructive">{errors.daysLocked.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="collateralChainId"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="mb-2 block">Collateral Chain</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                    }}
                    defaultValue={field.value.toString()}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chains.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id.toString()}>
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collateralAsset"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="mb-2 block">Collateral Asset</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={chainAssets[0].address}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {collateralChainAssets.map((asset) => (
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
                disabled={isPending}
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button disabled={isPending} loading={isPending}>
                Deposit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
