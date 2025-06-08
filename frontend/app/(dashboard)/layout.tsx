// app/(dashboard)/layout.tsx
import "../globals.css";
import { Sidebar } from "../../components/ui/sidebar";
import { AuthProvider } from "@/lib/auth";
import { ReactQueryClientProvider } from "@/lib/query";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-Cards Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          <ReactQueryClientProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
