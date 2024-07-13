"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { mainnet } from "viem/chains";
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
import { usePools } from "@/lib/hooks/pools/use-pools";
import { Pool } from "@/lib/types";
import { getDaysDifference } from "@/lib/utils";

const pools: Pool[] = [
  {
    chainId: mainnet.id,
    asset: ETH,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
  {
    chainId: mainnet.id,
    asset: USDC,
    amount: BigInt(100000000000000),
    owner: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    address: "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
    apr: BigInt(2),
    expireDate: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30),
    collateralChainId: mainnet.id,
    collateralAsset: USDC,
    ltv: BigInt(5),
  },
];

export function PoolsTable() {
  const chains = useChains();

  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
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
                <TableCell>{chains.find((chain) => chain.id === pool.chainId)?.name}</TableCell>
                <TableCell>{pool.asset.symbol}</TableCell>
                <TableCell>{formatEther(pool.amount)}</TableCell>
                <TableCell>{formatEther(pool.apr)}</TableCell>
                <TableCell>
                  <Address address={pool.owner} />
                </TableCell>
                <TableCell>{getDaysDifference(pool.expireDate)} days</TableCell>
                <TableCell>
                  {chains.find((chain) => chain.id === pool.collateralChainId)?.name}
                </TableCell>
                <TableCell>{formatEther(pool.ltv)}</TableCell>
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
