"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { DataGrid } from "@/lib/tables";
import { CollabCard } from "@/types/backend";
import { Row } from "@tanstack/react-table";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function CollabCardsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: cards = [], isLoading, isError } = useQuery({
    queryKey: ["collabCards", id],
    queryFn: async () => {
      if (!id) return [];
      const { data } = await api.get<CollabCard[]>(
        `/collabcards/batch/${id}/records`,
        {
          // if your endpoint needs company scoping, uncomment:
          // params: user?.company_id ? { company_id: user.company_id } : {}
        }
      );
      return data;
    },
  });

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Error loading cards</div>;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold">Cards for batch {id}</h2>
      <DataGrid<CollabCard>
        data={cards}
        columns={[
          { header: "Name",        accessorKey: "full_name"    },
          { header: "Email",       accessorKey: "email"       },
          { header: "Cell",        accessorKey: "mobile_phone" },
          { header: "Title",       accessorKey: "job_title"    },
          { header: "Office Phone",accessorKey: "office_phone"},
          { header: "Status",      accessorKey: "status"      },
          {
            header: "Card Image",
            cell: ({ row }: { row: Row<CollabCard> }) => {
              const fn = row.original.card_filename;
              if (!fn) return <span className="text-sm text-muted">–</span>;
              // full URL to your cards endpoint
              const src = `${API_BASE}/cards/${fn}`;
              return (
                <img
                  src={src}
                  alt={row.original.full_name}
                  className="h-24 w-auto rounded shadow-sm"
                />
              );
            },
          },
        ]}
      />
    </section>
  );
}
