import { DepositsTable } from "@/components/dashboard/deposits/deposits-table";
import { LoansTable } from "@/components/dashboard/loans/loans-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <DepositsTable />
      <LoansTable />
    </div>
  );
}
