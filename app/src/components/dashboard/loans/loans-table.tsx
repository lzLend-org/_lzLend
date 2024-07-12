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

interface Loan {
  chain: string;
  asset: string;
  amount: string;
  collateralChain: string;
  collateralAsset: string;
  collateralAmount: string;
  interestRate: string;
}

const loans: Loan[] = [
  {
    chain: "Ethereum",
    asset: "ETH",
    amount: "1.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "2%",
  },
  {
    chain: "Bitcoin",
    asset: "BTC",
    amount: "0.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "3%",
  },
  {
    chain: "Ethereum",
    asset: "ETH",
    amount: "2.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "5.2%",
  },
  {
    chain: "Bitcoin",
    asset: "BTC",
    amount: "0.5",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "4.8%",
  },
  {
    chain: "Ethereum",
    asset: "DAI",
    amount: "5,000",
    collateralChain: "Ethereum",
    collateralAsset: "ETH",
    collateralAmount: "1.5",
    interestRate: "3.2%",
  },
];

export function LoansTable() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Active Loans</CardTitle>
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
                    <span>{loan.asset}</span>
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
