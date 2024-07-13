"use client";

import { useState } from "react";
import { mainnet } from "viem/chains";
import { useChains } from "wagmi";

import { NewDepositModal } from "@/components/dashboard/deposits/new-deposit-modal";
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
import { ETH, USDC } from "@/lib/assets";
import { Deposit } from "@/lib/types";
import { getDaysDifference } from "@/lib/utils";

const deposits: Deposit[] = [
  {
    chain: mainnet.id,
    asset: ETH,
    amount: 1.5,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "2%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 30,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
  {
    chain: mainnet.id,
    asset: USDC,
    amount: 0.5,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "3%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 60,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
  {
    chain: mainnet.id,
    asset: USDC,
    amount: 2.5,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "5.2%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 80,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
  {
    chain: mainnet.id,
    asset: USDC,
    amount: 0.5,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "4.8%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 30,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
  {
    chain: mainnet.id,
    asset: USDC,
    amount: 5000,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "3.2%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 30,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
];

export function DepositsTable() {
  const chains = useChains();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Deposits</CardTitle>
        <Button onClick={() => setIsModalOpen(true)}>New Deposit</Button>
        <NewDepositModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Locked Days</TableHead>
              <TableHead>Collateral Chain</TableHead>
              <TableHead>LTV</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits.map((deposit, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{chains.find((chain) => chain.id === deposit.chain)?.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{deposit.asset.symbol}</span>
                  </div>
                </TableCell>
                <TableCell>{deposit.amount}</TableCell>
                <TableCell>{deposit.interestRate}</TableCell>
                <TableCell>{getDaysDifference(deposit.unlockDate)} days</TableCell>
                <TableCell>
                  {chains.find((chain) => chain.id === deposit.collateralChainId)?.name}
                </TableCell>
                <TableCell>{deposit.ltv}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    List for Sale
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
