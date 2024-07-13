"use client";

import Link from "next/link";
import { useState } from "react";
import { formatEther } from "viem";
import { mainnet } from "viem/chains";
import { useChains } from "wagmi";

import { RepayLoanModal } from "@/components/dashboard/loans/repay-loan-modal";
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
import { ETH } from "@/lib/assets";
import { Loan } from "@/lib/types";

const loans: Loan[] = [
  {
    chainId: mainnet.id,
    asset: ETH,
    amount: BigInt(100000000000000),
    collateralChainId: mainnet.id,
    collateralAsset: ETH,
    collateralAmount: BigInt(80000000000000),
    apr: BigInt(2),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
  },
  {
    chainId: mainnet.id,
    asset: ETH,
    amount: BigInt(100000000000000),
    collateralChainId: mainnet.id,
    collateralAsset: ETH,
    collateralAmount: BigInt(80000000000000),
    apr: BigInt(2),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
  },
  {
    chainId: mainnet.id,
    asset: ETH,
    amount: BigInt(100000000000000),
    collateralChainId: mainnet.id,
    collateralAsset: ETH,
    collateralAmount: BigInt(80000000000000),
    apr: BigInt(2),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
  },
  {
    chainId: mainnet.id,
    asset: ETH,
    amount: BigInt(100000000000000),
    collateralChainId: mainnet.id,
    collateralAsset: ETH,
    collateralAmount: BigInt(80000000000000),
    apr: BigInt(2),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
  },
  {
    chainId: mainnet.id,
    asset: ETH,
    amount: BigInt(100000000000000),
    collateralChainId: mainnet.id,
    collateralAsset: ETH,
    collateralAmount: BigInt(80000000000000),
    apr: BigInt(2),
    startDate: BigInt(Date.now()),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
  },
];

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
                <TableCell>{chains.find((chain) => chain.id === loan.chainId)?.name}</TableCell>
                <TableCell>{loan.asset.symbol}</TableCell>
                <TableCell>{formatEther(loan.amount)}</TableCell>
                <TableCell>{formatEther(loan.apr)}</TableCell>
                <TableCell>
                  {chains.find((chain) => chain.id === loan.collateralChainId)?.name}
                </TableCell>
                <TableCell>{loan.collateralAsset.symbol}</TableCell>
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
          <RepayLoanModal loan={selectedLoan} onOpenChange={setIsModalOpen} open={isModalOpen} />
        )}
      </CardContent>
    </Card>
  );
}
