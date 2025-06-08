import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ReactQueryClientProvider } from "@/lib/query";   // tiny wrapper, see repo
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "E-Cards Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
