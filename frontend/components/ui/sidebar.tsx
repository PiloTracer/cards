// components/ui/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/batches", key: "batches_main" },
  { label: "Companies",  href: "/companies", key: "companies" },
  { label: "Users",      href: "/users", key: "users" },
  { label: "Batches",    href: "/batches", key: "batches" },
  { label: "Cards",      href: "/cards", key: "cards" },
];

export function Sidebar() {
  const path = usePathname() || "";
  return (
    <aside className="w-64 h-screen bg-sidebarBg text-sidebarText dark:bg-gray-900">
      <div className="p-4 text-2xl font-bold text-white">E-Cards</div>
      <nav className="flex flex-col space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = path.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`
                block px-4 py-2 rounded-md transition-colors
                ${
                  isActive
                    ? "bg-sidebarActiveBg text-sidebarActiveText"
                    : "hover:bg-sidebarHover hover:text-white"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
