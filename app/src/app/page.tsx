import { UserLoansTable } from "@/components/dashboard/loans/user-loans-table";
import { UserPoolsTable } from "@/components/dashboard/pools/user-pools-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <UserPoolsTable />
      <UserLoansTable />
    </div>
  );
}
