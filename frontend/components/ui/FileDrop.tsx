/* ------------------------------------------------------------------ *
 * components/ui/FileDrop.tsx                                         *
 * Reusable drag-and-drop wrapper (react-dropzone)                    *
 * ------------------------------------------------------------------ */
"use client";

import {
  useDropzone,
  FileRejection,
  DropzoneOptions,
} from "react-dropzone";
import { useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- props -------------------------------------------------- */
export interface FileDropProps {
  /** Callback invoked with the successfully accepted files */
  onFiles: (files: File[]) => void;
  /** react-dropzone `accept` option – defaults to PNG + XLSX */
  accept?: DropzoneOptions["accept"];
  /** Maximum number of files (0 = unlimited) */
  maxFiles?: number;
  /** Disable dropping / browsing (e.g. during upload) */
  disabled?: boolean;
  /** Extra Tailwind classes for the wrapper */
  className?: string;
  /** Custom children – fallback UI rendered if omitted */
  children?: ReactNode;
}

/* ---------- component --------------------------------------------- */
export default function FileDrop({
  onFiles,
  accept = {
    "image/png": [".png"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  maxFiles = 0,
  disabled = false,
  className,
  children,
}: FileDropProps) {
  /* drop-event handler */
  const handleDrop = useCallback(
    (accepted: File[], _rejected: FileRejection[]) => {
      if (disabled) return;
      onFiles(accepted);
    },
    [onFiles, disabled]
  );

  /* initialise react-dropzone */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    maxFiles: maxFiles || undefined,
    onDrop: handleDrop,
    noClick: true,
    disabled,
  });

  /* ---------------------------------------------------------------- */
  /*  UI                                                              */
  /* ---------------------------------------------------------------- */
  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
        disabled
          ? "cursor-not-allowed opacity-60"
          : isDragActive
          ? "border-primary/60 bg-primary/5"
          : "border-muted",
        className
      )}
    >
      <input {...getInputProps()} />

      {children ? (
        /* custom children provided */
        children
      ) : (
        /* fallback minimal UI */
        <>
          <p className="text-sm">
            {isDragActive ? "Drop the files here…" : "Drag & drop files here"}
          </p>
          <button
            type="button"
            onClick={open}
            disabled={disabled}
            className="mt-2 inline-flex rounded-md border bg-background px-3 py-1 text-sm shadow-sm hover:bg-muted"
          >
            Browse…
          </button>
        </>
      )}
    </div>
  );
}
