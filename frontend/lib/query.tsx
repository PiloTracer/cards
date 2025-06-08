// lib/query.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

/* ------------------------------------------------------------------ */
/* 1. A single, lazily-initialised QueryClient                         */
/* ------------------------------------------------------------------ */
let _client: QueryClient | null = null;

const getQueryClient = () => {
  if (_client) return _client;

  _client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,          // 5 min data freshness
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: { retry: 1 },
    },
  });

  return _client;
};

/* ------------------------------------------------------------------ */
/* 2. Provider you can drop anywhere (used in layout.tsx)              */
/* ------------------------------------------------------------------ */
export function ReactQueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = React.useState(getQueryClient())[0];

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Devtools only in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Handy re-export so features can import from one place            */
/* ------------------------------------------------------------------ */
export { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
