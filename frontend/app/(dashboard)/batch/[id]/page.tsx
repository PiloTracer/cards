/* app/(dashboard)/batch/[id]/page.tsx */
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/lib/tables';
import { api } from '@/lib/api';
import { CollabCard, Batch } from '@/lib/types';
import { Button } from '@/lib/ui';
import dayjs from 'dayjs';
import Image from 'next/image';
import clsx from 'clsx';

type RecordRow = CollabCard & { rowKey: string };

function useBatchRecords(batchId: string) {
  return useQuery<CollabCard[]>({
    queryKey: ['batch-records', batchId],
    queryFn: async () => {
      const { data } = await api.get(`/collabcards/batch/${batchId}/records`);
      return data;
    },
    refetchInterval: 10_000, // auto-refresh every 10 s so the page updates when cards arrive
  });
}

export default function BatchDetailPage() {
  const { id: batchId } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useBatchRecords(batchId);

  const rows: RecordRow[] =
    data?.map((r) => ({ ...r, rowKey: r.id })) ?? [];

  return (
    <section className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Batch <span className="text-muted-foreground">{batchId}</span>
        </h1>

        <Button variant="secondary" onClick={() => router.back()}>
          ← Back
        </Button>
      </header>

      {error && (
        <p className="text-destructive">
          Error: {(error as Error).message}
        </p>
      )}

      <DataTable<RecordRow>
        isLoading={isLoading}
        columns={[
          {
            header: 'Name',
            accessorKey: 'full_name',
            size: 250,
          },
          {
            header: 'Email',
            accessorKey: 'email',
            size: 230,
          },
          {
            header: 'Mobile',
            accessorKey: 'mobile_phone',
            size: 130,
          },
          {
            header: 'Job title',
            accessorKey: 'job_title',
            size: 200,
          },
          {
            header: 'Status',
            accessorKey: 'status',
            size: 110,
            cell: ({ getValue }) => {
              const val: string = getValue();
              return (
                <span
                  className={clsx(
                    'rounded px-2 py-0.5 text-xs font-medium',
                    val === 'generated'
                      ? 'bg-green-100 text-green-800'
                      : val === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800',
                  )}
                >
                  {val}
                </span>
              );
            },
          },
          {
            id: 'card',
            header: 'Card',
            size: 140,
            enableSorting: false,
            cell: ({ row }) => {
              const rec = row.original as CollabCard;
              if (!rec.card_filename) return null;
              // cards endpoint exposes PNGs via /static/cards/<rel-path>
              const src = `/static/cards/${rec.card_filename}`;
              return (
                <Image
                  src={src}
                  alt={rec.full_name}
                  width={120}
                  height={70}
                  className="rounded shadow"
                />
              );
            },
          },
          {
            header: 'Generated at',
            accessorKey: 'generated_at',
            size: 180,
            cell: ({ getValue }) => {
              const val: string | null = getValue();
              return val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '—';
            },
          },
        ]}
        data={rows}
        initialState={{
          sorting: [{ id: 'full_name', desc: false }],
          density: 'compact',
        }}
      />
    </section>
  );
}
