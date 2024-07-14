// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
import { formatUnits } from "viem";
import { useChains } from "wagmi";

import { Button } from "@/components/ui/button";
import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
import { useRepay } from "@/lib/hooks/loans/use-repay";
import { Loan } from "@/lib/types";
import { APR_DECIMALS } from "@/lib/utils";

interface RepayModalProps extends BaseDialogProps {
  loan: Loan;
}

export function RepayModal({
  loan,
  open,
  onOpenChange,
  onSuccess,
}: RepayModalProps & { onSuccess?: () => void }) {
  const chains = useChains();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm<RepayLoanData>({
  //   resolver: zodResolver(getRepayLoanSchema(Number(loan.amount))),
  //   defaultValues: {
  //     amount: 0,
  //   },
  // });

  // const onSubmit = handleSubmit((data) => {
  //   console.log(data);
  // });

  const { mutate: repay, isPending } = useRepay({
    loan,
    onSuccess,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        // reset();
      }}
      modal={true}
    >
      <DialogContent className="flex max-h-[90vh] max-w-md flex-col px-6">
        <h2 className="text-xl font-semibold">Repay</h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Chain</div>
            <div className="font-medium">
              {chains.find((chain) => chain.id === loan.pool.chainId)?.name}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Asset</div>
            <div className="font-medium">{loan.pool.asset.symbol}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Amount</div>
            <div className="font-medium">{formatUnits(loan.amount, loan.pool.asset.decimals)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Interest Rate</div>
            <div className="font-medium">{formatUnits(loan.pool.apr, APR_DECIMALS)}%</div>
          </div>
          {/* <Separator className="my-3" /> */}

          {/* <div>
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
          </div> */}

          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={isPending}
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={isPending} loading={isPending} onClick={() => repay()}>
              Repay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
