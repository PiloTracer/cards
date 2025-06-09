// app/(dashboard)/layout.tsx
"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { ReactQueryClientProvider } from "@/lib/query";
import { AuthProvider } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ReactQueryClientProvider>
        <div className="flex h-screen bg-[var(--bg)] text-[var(--fg)]">
          <Sidebar />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </ReactQueryClientProvider>
    </AuthProvider>
  );
}
