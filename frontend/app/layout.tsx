/* /app/layout.tsx */

import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ReactQueryClientProvider } from "@/lib/query";   // tiny wrapper, see repo

export const metadata = { title: "E-Cards Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}