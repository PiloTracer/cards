/* ------------------------------------------------------------------ *
 * lib/types.ts – typed mirrors of a few back-end models
 * ------------------------------------------------------------------ */

/**
 * The batch_status Postgres enum is exposed by the API as plain strings.
 * Keep this list in sync with `app/models/enums.py::BatchStatus`.
 */
export type BatchStatus =
  | "pending"
  | "processing"
  | "completed"
  | "error";

/** Company (read shape) – mirrors app.models.company.Company             */
export interface Company {
  id: string; // UUID
  name: string;

  phonePrefix?: string | null;
  email?: string | null;
  phone?: string | null;
  web?: string | null;
  note?: string | null;
  description?: string | null;
}

/** Batch – mirrors app.models.batch.Batch                                */
export interface Batch {
  id: string; // UUID

  companyId: string | null;
  createdBy: string | null;

  originalFilename?: string | null;

  totalRecords: number;
  processedRecords: number;
  status: BatchStatus;

  createdAt?: string; // ISO-8601. backend TimeStampMixin adds these
  updatedAt?: string;

  /* Optional helper for UI: the API may embed the related CollabCards.
     Keep it loose so the UI can still render partial payloads. */
  records?: unknown[];
}
