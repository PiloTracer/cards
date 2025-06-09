// app/(dashboard)/batches/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { DataGrid } from "@/lib/tables";
import { Button } from "@/components/ui/button";
import FileDrop from "@/components/ui/FileDrop";
import { Label } from "@/components/ui/label";
import type { Batch, Company } from "@/types/backend";
import type { Row } from "@tanstack/react-table";

export default function BatchesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  // Determine if this user must choose a company
  const showCompanySelect =
    user?.role === "owner" || user?.role === "administrator";

  // Local state for the currently selected company ID
  const [companyId, setCompanyId] = useState<string>(
    user?.company_id ?? ""
  );

  //
  // 1️⃣ Fetch companies *only* if we need to let them choose one
  //
  const {
    data: companies = [],
    isLoading: companiesLoading,
  } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data } = await api.get<Company[]>("/companies");
      return data;
    },
    enabled: showCompanySelect,
  });

  //
  // 2️⃣ Fetch pending batches once we know which company to use
  //
  const {
    data: batches = [],
    isLoading: batchesLoading,
  } = useQuery<Batch[]>({
    queryKey: ["pendingBatches", showCompanySelect ? companyId : user?.company_id],
    queryFn: async () => {
      const params = { company_id: showCompanySelect ? companyId : user!.company_id! };
      const { data } = await api.get<Batch[]>(
        "/collabcards/pending-batches",
        { params }
      );
      return data;
    },
    enabled:
      // if they must choose, wait for a selection; otherwise run immediately
      (!showCompanySelect || Boolean(companyId)),
  });

  //
  // 3️⃣ Upload mutation
  //
  const { mutate: uploadXlsx, status: uploadStatus } = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const params = { company_id: showCompanySelect ? companyId : user!.company_id! };
      const { data } = await api.post(
        "/collabcards/upload-xlsx",
        fd,
        { params }
      );
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["pendingBatches"] }),
  });

  // disable upload button while uploading or if a company must be selected and none is
  const disableUpload =
    uploadStatus === "pending" ||
    (showCompanySelect && !companyId);

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Pending Batches</h2>

        <div className="flex items-center gap-4">
          {showCompanySelect && (
            <div className="flex flex-col">
              <Label htmlFor="company_select">Company</Label>
              <select
                id="company_select"
                className="input"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                // if the user already has a company, don’t let them change it
                disabled={Boolean(user?.company_id)}
              >
                <option value="">Select…</option>
                {companies
                  .filter((c) =>
                    // if company‐scoped admin, only show that one
                    user?.company_id
                      ? c.id === user.company_id
                      : true
                  )
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <FileDrop
            accept={{
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                ".xlsx",
              ],
            }}
            onFiles={(files) => uploadXlsx(files[0])}
          >
            <Button disabled={disableUpload}>
              {uploadStatus === "pending" ? "Uploading…" : "Upload XLSX"}
            </Button>
          </FileDrop>
        </div>
      </div>

      <DataGrid
        data={batches}
        columns={[
          { header: "ID", accessorKey: "id" },
          { header: "File", accessorKey: "original_filename" },
          { header: "Total", accessorKey: "total_records" },
          { header: "Processed", accessorKey: "processed_records" },
          { header: "Status", accessorKey: "status" },
          { header: "Created", accessorKey: "created_at" },
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
