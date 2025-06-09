// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ReactQueryClientProvider } from "@/lib/query";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "E-Cards Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body>
        <AuthProvider>
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
