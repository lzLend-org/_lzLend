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

interface Deposit {
  chain: string;
  asset: string;
  amount: string;
  interestRate: string;
}

const deposits: Deposit[] = [
  {
    chain: "Ethereum",
    asset: "ETH",
    amount: "1.5",
    interestRate: "2%",
  },
  {
    chain: "Bitcoin",
    asset: "BTC",
    amount: "0.5",
    interestRate: "3%",
  },
  {
    chain: "Ethereum",
    asset: "ETH",
    amount: "2.5",
    interestRate: "5.2%",
  },
  {
    chain: "Bitcoin",
    asset: "BTC",
    amount: "0.5",
    interestRate: "4.8%",
  },
  {
    chain: "Ethereum",
    asset: "DAI",
    amount: "5,000",
    interestRate: "3.2%",
  },
];

export function DepositsTable() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Active Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits.map((deposit, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{deposit.chain}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{deposit.asset}</span>
                  </div>
                </TableCell>
                <TableCell>{deposit.amount}</TableCell>
                <TableCell>{deposit.interestRate}</TableCell>
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
