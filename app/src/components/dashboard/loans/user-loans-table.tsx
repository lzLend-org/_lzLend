"use client";

import Link from "next/link";
import { useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChains } from "wagmi";

import { RepayModal } from "@/components/dashboard/loans/repay-modal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
// import { loans } from "@/lib/data";
import { useLoans } from "@/lib/hooks/loans/use-loans";
import { Loan } from "@/lib/types";
import { APR_DECIMALS } from "@/lib/utils";

export function UserLoansTable() {
  const chains = useChains();

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { address } = useAccount();
  const { data: userLoans, isPending } = useLoans({
    owner: address,
    enabled: !!address,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Loans</CardTitle>
        <Link href={"/pools"}>
          <Button>New Loan</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Collateral Chain</TableHead>
              <TableHead>Collateral Asset</TableHead>
              <TableHead>Collateral Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userLoans?.length ? (
              userLoans.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {chains.find((chain) => chain.id === loan.pool.chainId)?.name}
                  </TableCell>
                  <TableCell>{loan.pool.asset.symbol}</TableCell>
                  <TableCell>{formatUnits(loan.amount, loan.pool.asset.decimals)}</TableCell>
                  <TableCell>{formatUnits(loan.pool.apr, APR_DECIMALS)}%</TableCell>
                  <TableCell>
                    {chains.find((chain) => chain.id === loan.pool.collateralChainId)?.name}
                  </TableCell>
                  <TableCell>{loan.pool.collateralAsset.symbol}</TableCell>
                  <TableCell>
                    {formatUnits(loan.collateralAmount, loan.pool.collateralAsset.decimals)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() => {
                        setIsModalOpen(true);
                        setSelectedLoan(loan);
                      }}
                    >
                      Repay
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  {isPending ? (
                    <div className="flex justify-center py-10">
                      <Spinner />
                    </div>
                  ) : (
                    "No active loans"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedLoan && (
          <RepayModal loan={selectedLoan} onOpenChange={setIsModalOpen} open={isModalOpen} />
        )}
      </CardContent>
    </Card>
  );
}
