"use client";

import { formatUnits } from "viem";
import { useChains } from "wagmi";

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
import { useUserListedPools } from "@/lib/hooks/marketplace/use-user-listed-pools";
import { APR_DECIMALS, LTV_DECIMALS, getDaysDifference } from "@/lib/utils";

export function UserListedPoolsTable() {
  const chains = useChains();

  const { data: listedPools, isPending } = useUserListedPools();
  // console.log("Pools: ", data);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-6">
        <CardTitle>Your Listed Pools</CardTitle>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {listedPools?.length ? (
              listedPools.map((pool, index) => (
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
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
      </CardContent>
    </Card>
  );
}
