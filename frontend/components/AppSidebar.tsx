"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Tutor", href: "/ai-tutor" },
  { label: "Assignments", href: "/dashboard" },
  { label: "Diploma", href: "/dashboard" },
  { label: "Documents", href: "/dashboard" },
  { label: "Exam Prep", href: "/dashboard" },
  { label: "Files", href: "/dashboard" },
  { label: "Subscription", href: "/dashboard" },
  { label: "Settings", href: "/dashboard" },
  { label: "Subscription", href: "/subscription" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[270px] border-r border-slate-200 bg-white px-5 py-7">
      <h1 className="mb-8 px-2 text-2xl font-bold text-slate-900">
        StudyAI
      </h1>

      <nav className="space-y-2 text-sm font-medium">
        {menuItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                active
                  ? "block rounded-xl bg-blue-50 px-4 py-3 text-blue-600"
                  : "block rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-50"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}