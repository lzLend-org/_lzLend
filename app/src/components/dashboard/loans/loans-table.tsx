import Link from "next/link";

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
import { Loan } from "@/lib/types";

const loans: Loan[] = [
  {
    chain: "Ethereum",
    asset: ETH,
    amount: "1.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "2%",
  },
  {
    chain: "Bitcoin",
    asset: USDC,
    amount: "0.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "3%",
  },
  {
    chain: "Ethereum",
    asset: USDC,
    amount: "2.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "5.2%",
  },
  {
    chain: "Bitcoin",
    asset: USDC,
    amount: "0.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "4.8%",
  },
  {
    chain: "Ethereum",
    asset: USDC,
    amount: "5,000",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "3.2%",
  },
];

export function LoansTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Loans</CardTitle>
        <Button>
          <Link href={"/pools"}>New Loan</Link>
        </Button>
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
                  <div className="flex items-center gap-2">
                    <span>{loan.chain}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{loan.asset.symbol}</span>
                  </div>
                </TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>{loan.interestRate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{loan.collateralChain}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{loan.collateralAsset}</span>
                  </div>
                </TableCell>
                <TableCell>{loan.collateralAmount}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Repay
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
