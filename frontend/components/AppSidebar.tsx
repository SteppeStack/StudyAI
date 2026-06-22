"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

export default function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const menuItems = [
    { label: t.common.dashboard, href: "/dashboard" },
    { label: t.common.aiTutor, href: "/ai-tutor" },
    { label: t.common.assignments, href: "/assignments" },
    { label: t.common.diploma, href: "/diploma" },
    { label: t.common.documents, href: "/documents" },
    { label: t.common.examPrep, href: "/exam-prep" },
    { label: t.common.files, href: "/files" },
    { label: t.common.subscription, href: "/subscription" },
    { label: t.common.settings, href: "/settings" },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActiveLink(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link href="/dashboard" className="text-xl font-bold text-slate-900">
          {t.common.studyai}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          >
            {t.common.menu}
          </button>
        </div>
      </header>

      <aside className="fixed left-0 top-0 hidden h-screen w-[300px] border-r border-slate-200 bg-white px-5 py-7 lg:block">
        <Link
          href="/dashboard"
          className="mb-6 block px-2 text-2xl font-bold text-slate-900"
        >
          {t.common.studyai}
        </Link>

        <div className="mb-6 px-2">
          <LanguageSwitcher />
        </div>

        <nav className="space-y-2 text-sm font-medium">
          {menuItems.map((item) => {
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
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

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-900/30"
            aria-label="Close menu"
          />

          <aside className="relative h-full w-[280px] border-r border-slate-200 bg-white px-5 py-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/dashboard"
                className="text-2xl font-bold text-slate-900"
              >
                {t.common.studyai}
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600"
              >
                X
              </button>
            </div>

            <div className="mb-6">
              <LanguageSwitcher />
            </div>

            <nav className="space-y-2 text-sm font-medium">
              {menuItems.map((item) => {
                const active = isActiveLink(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
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
        </div>
      )}
    </>
  );
}