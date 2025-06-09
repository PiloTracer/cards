"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { DataGrid } from "@/lib/tables";
import { Button } from "@/components/ui/button";
import FileDrop from "@/components/ui/FileDrop";
import { Batch } from "@/types/backend";
import { Row } from "@tanstack/react-table";

export default function BatchesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  // 1️⃣ Fetch pending batches
  const { data: batches = [] } = useQuery({
    queryKey: ["pendingBatches", user?.company_id],
    queryFn: async () => {
      const params = user?.company_id ? { company_id: user.company_id } : {};
      const { data } = await api.get<Batch[]>(
        "/collabcards/pending-batches",
        { params }
      );
      return data;
    },
  });

  // 2️⃣ Upload mutation
  const { mutate: uploadXlsx, status: uploadStatus } = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const params = user?.company_id ? { company_id: user.company_id } : {};
      const { data } = await api.post(
        "/collabcards/upload-xlsx",
        fd,
        { params }
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendingBatches"] }),
  });

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Pending Batches</h2>
        <FileDrop
          accept={{
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
              ".xlsx",
            ],
          }}
          onFiles={(files) => uploadXlsx(files[0])}
        >
          {/* disable while uploading */}
          <Button disabled={uploadStatus === "pending"}>
            Upload XLSX
          </Button>
        </FileDrop>
      </div>

      <DataGrid
        data={batches}
        columns={[
          { header: "ID",        accessorKey: "id" },
          { header: "File",      accessorKey: "originalFilename" },
          { header: "Total",     accessorKey: "totalRecords" },
          { header: "Processed", accessorKey: "processedRecords" },
          { header: "Status",    accessorKey: "status" },
          { header: "Created",   accessorKey: "createdAt" },
          {
            header: "View",
            cell: ({ row }: { row: Row<Batch> }) => (
              <Button
                variant="link"
                size="sm"
                href={`/batch/${row.original.id}`}
              >
                View
              </Button>
            ),
          },
        ]}
      />
    </section>
  );
}
