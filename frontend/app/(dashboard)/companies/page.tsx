"use client";

import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "@/lib/tables";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import type { Company } from "@/types/backend";
import { Row } from "@tanstack/react-table";

export default function CompaniesPage() {
  // 📡 Fetch the list of companies the API returns for the current user
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data } = await api.get<Company[]>("/companies");
      return data;
    },
  });

  return (
    <section className="space-y-8">
      {/* header + New Company button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Companies</h2>
        <Button href="/companies/new" variant="default" size="md">
          New Company
        </Button>
      </div>

      {/* Data grid */}
      <DataGrid
        data={companies}
        columns={[
          { header: "Name",          accessorKey: "name" },
          { header: "Phone Prefix",  accessorKey: "phone_prefix" },
          { header: "Email",         accessorKey: "email" },
          { header: "Phone",         accessorKey: "phone" },
          { header: "Website",       accessorKey: "web" },
          { header: "Note",          accessorKey: "note" },
          { header: "Description",   accessorKey: "description" },
          {
            header: "Actions",
            cell: ({ row }: { row: Row<Company> }) => (
              <Button
                variant="link"
                size="sm"
                href={`/companies/${row.original.id}`}
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
