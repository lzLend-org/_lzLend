"use client";

import { ListedPoolsTable } from "@/components/dashboard/marketplace/listed-pools-table";
import { UserListedPoolsTable } from "@/components/dashboard/marketplace/user-listed-pools-table";

export default function MarketplacePage() {
  return (
    <div className="flex flex-col gap-6">
      <ListedPoolsTable />
      <UserListedPoolsTable />
    </div>
  );
}
