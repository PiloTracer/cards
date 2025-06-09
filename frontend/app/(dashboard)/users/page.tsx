// app/(dashboard)/users/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { DataGrid } from "@/lib/tables";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/backend";
import { Row } from "@tanstack/react-table";

export default function UsersPage() {
  const { user } = useAuth();

  // 1️⃣ Fetch all users the backend will allow
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get<User[]>("/users");
      return data;
    },
  });

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Users</h2>
        <Button href="/users/new" variant="default" size="md">
          New User
        </Button>
      </div>

      <DataGrid
        data={users}
        columns={[
          { header: "Email",    accessorKey: "email" },
          { header: "Role",     accessorKey: "role" },
          { header: "Company",  accessorKey: "company_id" },
          {
            header: "Actions",
            cell: ({ row }: { row: Row<User> }) => (
              <Button
                variant="link"
                size="sm"
                href={`/users/${row.original.id}`}
              >
                Edit
              </Button>
            ),
          },
        ]}
      />
    </section>
  );
}
