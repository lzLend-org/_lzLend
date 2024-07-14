"use client";

import { useState } from "react";
import { formatUnits } from "viem";
import { useChains } from "wagmi";

import { Address } from "@/components/address";
import { BuyModal } from "@/components/dashboard/marketplace/buy-modal";
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
import { pools } from "@/lib/data";
import { useListedPools } from "@/lib/hooks/marketplace/use-listed-pools";
import { Pool } from "@/lib/types";
import { APR_DECIMALS, LTV_DECIMALS, getDaysDifference } from "@/lib/utils";

export function ListedPoolsTable() {
  const chains = useChains();

  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: listedPools, isPending } = useListedPools();
  console.log("listedPools: ", listedPools);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-6">
        <CardTitle>Listed Pools</CardTitle>
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
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.slice(0, 1)?.length ? (
              pools.slice(0, 1).map((pool, index) => (
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
                    {formatUnits(pool.amount / BigInt(2), pool.asset.decimals)} {pool.asset.symbol}
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
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  {isPending ? (
                    <div className="flex justify-center py-10">
                      <Spinner />
                    </div>
                  ) : (
                    "No listed pools"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedPool && (
          <BuyModal pool={selectedPool} onOpenChange={setIsModalOpen} open={isModalOpen} />
        )}
      </CardContent>
    </Card>
  );
}
