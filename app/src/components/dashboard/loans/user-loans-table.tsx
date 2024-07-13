"use client";

import Link from "next/link";
import { useState } from "react";
import { formatEther } from "viem";
import { useChains } from "wagmi";

import { RepayModal } from "@/components/dashboard/loans/repay-modal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { loans } from "@/lib/data";
import { Loan } from "@/lib/types";

export function UserLoansTable() {
  const chains = useChains();

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            {loans.map((loan, index) => (
              <TableRow key={index}>
                <TableCell>
                  {chains.find((chain) => chain.id === loan.pool.chainId)?.name}
                </TableCell>
                <TableCell>{loan.pool.asset.symbol}</TableCell>
                <TableCell>{formatEther(loan.amount)}</TableCell>
                <TableCell>{formatEther(loan.pool.apr)}</TableCell>
                <TableCell>
                  {chains.find((chain) => chain.id === loan.pool.collateralChainId)?.name}
                </TableCell>
                <TableCell>{loan.pool.collateralAsset.symbol}</TableCell>
                <TableCell>{formatEther(loan.collateralAmount)}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedLoan(loan);
                    }}
                  >
                    Repay
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedLoan && (
          <RepayModal loan={selectedLoan} onOpenChange={setIsModalOpen} open={isModalOpen} />
        )}
      </CardContent>
    </Card>
  );
}
