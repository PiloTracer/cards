// components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/batches" },
  { label: "Companies",  href: "/companies" },
  { label: "Users",      href: "/users" },
  { label: "Batches",    href: "/batches" },
  { label: "Cards",      href: "/cards" },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 h-screen bg-white border-r">
      <div className="p-4 font-bold text-lg">E-Cards</div>
      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isActive = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
