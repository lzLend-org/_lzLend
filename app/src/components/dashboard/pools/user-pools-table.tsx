"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { mainnet } from "viem/chains";
import { useAccount, useChains } from "wagmi";

import { DepositModal } from "@/components/dashboard/pools/deposit-modal";
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

export function UserPoolsTable() {
  const { address } = useAccount();
  const chains = useChains();
  const { data } = usePools({
    owner: address,
    enabled: !!address,
  });

  console.log("User Pools: ", data);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Deposits</CardTitle>
        <Button onClick={() => setIsModalOpen(true)}>New Deposit</Button>
        <DepositModal open={isModalOpen} onOpenChange={setIsModalOpen} />
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
            {pools.map((pool, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{chains.find((chain) => chain.id === pool.chainId)?.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{pool.asset.symbol}</span>
                  </div>
                </TableCell>
                <TableCell>{formatEther(pool.amount)}</TableCell>
                <TableCell>{formatEther(pool.apr)}</TableCell>
                <TableCell>{getDaysDifference(pool.expireDate)} days</TableCell>
                <TableCell>
                  {chains.find((chain) => chain.id === pool.collateralChainId)?.name}
                </TableCell>
                <TableCell>{formatEther(pool.ltv)}</TableCell>
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
