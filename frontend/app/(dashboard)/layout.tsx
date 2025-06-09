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
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6 bg-[var(--background)] dark:bg-gray-800">
            {children}
          </main>
        </div>
      </ReactQueryClientProvider>
    </AuthProvider>
  );
}
