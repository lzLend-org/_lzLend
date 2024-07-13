"use client";

import { useState } from "react";
import { mainnet, sepolia } from "viem/chains";
import { useChains } from "wagmi";

import { Address } from "@/components/address";
import { NewLoanModal } from "@/components/dashboard/loans/new-loan-modal";
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
import { usePools } from "@/lib/hooks/use-pools";
import { Deposit } from "@/lib/types";
import { getDaysDifference } from "@/lib/utils";

const pools: Deposit[] = [
  {
    chain: mainnet.id,
    asset: USDC,
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
    collateralChainId: sepolia.id,
    ltv: 0.5,
  },
  {
    chain: mainnet.id,
    asset: ETH,
    amount: 2.5,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "5.2%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 80,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
  {
    chain: mainnet.id,
    asset: ETH,
    amount: 0.5,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "4.8%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 30,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
  {
    chain: mainnet.id,
    asset: ETH,
    amount: 5000,
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    interestRate: "3.2%",
    unlockDate: Date.now() + 1000 * 60 * 60 * 24 * 30,
    collateralChainId: mainnet.id,
    ltv: 0.5,
  },
];

export function PoolsTable() {
  const chains = useChains();

  const [selectedPool, setSelectedPool] = useState<Deposit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = usePools();
  console.log("Pools: ", data);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-6">
        <CardTitle>Pools</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Locked Days</TableHead>
              <TableHead>Collateral Chain</TableHead>
              <TableHead>LTV</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{pool.chain}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{pool.asset.symbol}</span>
                  </div>
                </TableCell>
                <TableCell>{pool.amount}</TableCell>
                <TableCell>{pool.interestRate}</TableCell>
                <TableCell>
                  <Address address={pool.owner} />
                </TableCell>
                <TableCell>{getDaysDifference(pool.unlockDate)} days</TableCell>
                <TableCell>
                  {chains.find((chain) => chain.id === pool.collateralChainId)?.name}
                </TableCell>
                <TableCell>{pool.ltv}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedPool(pool);
                    }}
                  >
                    Borrow
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedPool && (
          <NewLoanModal pool={selectedPool} onOpenChange={setIsModalOpen} open={isModalOpen} />
        )}
      </CardContent>
    </Card>
  );
}
