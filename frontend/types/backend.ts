// /types/backend.ts

/**
 * The batch_status Postgres enum is exposed by the API as plain strings.
 * Keep this list in sync with `app/models/enums.py::BatchStatus`.
 */
export type BatchStatus =
  | "pending"
  | "processing"
  | "completed"
  | "error";

/** Company (read shape) – mirrors app.models.company.Company */
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

/** Batch – mirrors app.models.batch.Batch */
export interface Batch {
  id: string; // UUID

  companyId: string | null;
  createdBy: string | null;

  originalFilename?: string | null;

  totalRecords: number;
  processedRecords: number;
  status: BatchStatus;

  createdAt?: string; // ISO-8601
  updatedAt?: string;

  records?: unknown[];
}

/**
 * The record_status Postgres enum is exposed as plain strings.
 * Keep in sync with `app/models/enums.py::RecordStatus`.
 */
export type CollabCardStatus =
  | "pending"
  | "generating"
  | "generated"
  | "failed";

/** CollabCard – mirrors app.models.collabcards.CollabCard */
export interface CollabCard {
  id: string;
  full_name: string;
  email: string;
  mobile_phone?: string | null;
  job_title?: string | null;
  office_phone?: string | null;

  status: CollabCardStatus;
  card_filename?: string | null;
  generated_at?: string | null;
}
