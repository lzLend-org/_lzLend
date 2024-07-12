import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Deposit } from "@/lib/types";

const getCreateLoanSchema = (max: number) =>
  z.object({
    amount: z.number().positive().lte(max),
  });

type CreateLoanData = z.infer<ReturnType<typeof getCreateLoanSchema>>;

interface NewLoanModalProps extends BaseDialogProps {
  pool: Deposit;
}

export function NewLoanModal({ pool, open, onOpenChange }: NewLoanModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLoanData>({
    resolver: zodResolver(getCreateLoanSchema(pool.amount)),
    defaultValues: {
      amount: 0,
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
        <h2 className="text-xl font-semibold">Borrow</h2>

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
            <div className="font-medium">{pool.interestRate}</div>
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
