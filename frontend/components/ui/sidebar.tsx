// components/ui/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const nav = [
  { label: "Dashboard", href: "/batches", key: "batches_init" },
  { label: "Companies",  href: "/companies", key: "companies" },
  { label: "Users",      href: "/users", key: "users" },
  { label: "Batches",    href: "/batches", key: "batches" },
];

export function Sidebar() {
  const path = usePathname() || "";
  return (
    <aside className="w-64 bg-sidebar-bg text-sidebar-text dark:bg-sidebar-active-bg">
      <div className="p-6 text-2xl font-bold text-white">E-Cards</div>
      <nav className="flex flex-col space-y-1">
        {nav.map((item) => {
          const active = path.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`px-4 py-2 rounded-md transition ${
                active
                  ? "bg-sidebar-active-bg text-sidebar-active-text"
                  : "hover:bg-sidebar-hover hover:text-white"
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
