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

  phone_prefix?: string | null;
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

// types/backend.ts
/**
 * Mirrors app.models.user.User (read shape)
 */
export interface User {
  id: string;
  email: string;
  role: "owner" | "administrator" | "collaborator" | "standard";
  company_id: string | null;

  // optional “card_…” fields
  card_full_name?: string | null;
  card_email?: string | null;
  card_mobile_phone?: string | null;
  card_job_title?: string | null;
  card_office_phone?: string | null;
  card_web?: string | null;
}

// types/backend.ts

/**
 * Mirrors app.models.company.Company (read shape)
 */
export interface Company {
  id: string;               // UUID
  name: string;

  phone_prefix?: string | null;   // phone_prefix
  email?: string | null;
  phone?: string | null;
  web?: string | null;
  note?: string | null;
  description?: string | null;
}

// types/backend.ts
/** Keep this in sync with app.models.user.Role */
export type Role = "owner" | "administrator" | "collaborator" | "standard";

/** Mirrors app.schemas.user.UserRead */
export interface User {
  id: string;
  email: string;
  role: Role;
  company_id: string | null;
  card_full_name?: string | null;
  card_email?: string | null;
  card_mobile_phone?: string | null;
  card_job_title?: string | null;
  card_office_phone?: string | null;
  card_web?: string | null;
}
