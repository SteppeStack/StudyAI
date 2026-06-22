"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Tutor", href: "/ai-tutor" },
  { label: "Assignments", href: "/assignments" },
  { label: "Diploma", href: "/diploma" },
  { label: "Documents", href: "/documents" },
  { label: "Exam Prep", href: "/exam-prep" },
  { label: "Files", href: "/files" },
  { label: "Subscription", href: "/subscription" },
  { label: "Settings", href: "/settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[270px] border-r border-slate-200 bg-white px-5 py-7">
      <Link href="/" className="mb-8 block px-2 text-2xl font-bold text-slate-900">
        StudyAI
      </Link>

      <nav className="space-y-2 text-sm font-medium">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "block rounded-xl bg-blue-50 px-4 py-3 text-blue-600"
                  : "block rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
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