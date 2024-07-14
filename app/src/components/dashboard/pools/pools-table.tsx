"use client";

import { useState } from "react";
import { formatUnits } from "viem";
import { useChains } from "wagmi";

import { Address } from "@/components/address";
import { BorrowModal } from "@/components/dashboard/loans/borrow-modal";
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
import { usePools } from "@/lib/hooks/pools/use-pools";
import { Pool } from "@/lib/types";
import { APR_DECIMALS, LTV_DECIMALS, getDaysDifference } from "@/lib/utils";

export function PoolsTable() {
  const chains = useChains();

  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: pools, isPending } = usePools();
  // console.log("Pools: ", data);

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
              <TableHead>LTV</TableHead>
              <TableHead>Locked Days</TableHead>
              <TableHead>Collateral Chain</TableHead>
              <TableHead>Collateral Asset</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools?.length ? (
              pools.map((pool, index) => (
                <TableRow key={index}>
                  <TableCell>{chains.find((chain) => chain.id === pool.chainId)?.name}</TableCell>
                  <TableCell>{pool.asset.symbol}</TableCell>
                  <TableCell>{formatUnits(pool.amount, pool.asset.decimals)}</TableCell>
                  <TableCell>{formatUnits(pool.apr, APR_DECIMALS)}%</TableCell>
                  <TableCell>{formatUnits(pool.ltv, LTV_DECIMALS)}%</TableCell>
                  <TableCell>{getDaysDifference(pool.expireDate)} days</TableCell>
                  <TableCell>
                    {chains.find((chain) => chain.id === pool.collateralChainId)?.name}
                  </TableCell>
                  <TableCell>{pool.collateralAsset.symbol}</TableCell>
                  <TableCell>
                    <Address address={pool.owner} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() => {
                        setIsModalOpen(true);
                        setSelectedPool(pool);
                      }}
                    >
                      Borrow
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  {isPending ? (
                    <div className="flex justify-center py-10">
                      <Spinner />
                    </div>
                  ) : (
                    "No active pools"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedPool && (
          <BorrowModal pool={selectedPool} onOpenChange={setIsModalOpen} open={isModalOpen} />
        )}
      </CardContent>
    </Card>
  );
}
