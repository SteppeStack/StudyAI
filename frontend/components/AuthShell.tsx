"use client";

import Link from "next/link";
import { ReactNode } from "react";

export type AuthLanguage = "en" | "ru" | "kz";
export type AuthTheme = "light" | "dark";

type AuthShellCopy = {
  badge: string;
  title: string;
  subtitle: string;
  benefitAiTutor: string;
  benefitAssignments: string;
  benefitExamPrep: string;
  previewTitle: string;
  previewSubtitle: string;
  previewCardOne: string;
  previewCardTwo: string;
  previewCardThree: string;
};

type AuthShellProps = {
  children: ReactNode;
  language: AuthLanguage;
  theme: AuthTheme;
  copy: AuthShellCopy;
  onLanguageChange: (language: AuthLanguage) => void;
  onThemeToggle: () => void;
};

const languageLabels: Record<AuthLanguage, string> = {
  en: "EN",
  ru: "RU",
  kz: "KZ",
};

export default function AuthShell({
  children,
  language,
  theme,
  copy,
  onLanguageChange,
  onThemeToggle,
}: AuthShellProps) {
  const isDark = theme === "dark";

  const pageClass = isDark
    ? "min-h-screen bg-slate-950 text-white"
    : "min-h-screen bg-slate-50 text-slate-950";

  const panelClass = isDark
    ? "border-white/10 bg-slate-900/70 shadow-black/20"
    : "border-slate-200 bg-white shadow-slate-200/70";

  const softCardClass = isDark
    ? "border-white/10 bg-slate-950/60"
    : "border-slate-200 bg-slate-50";

  const titleClass = isDark ? "text-white" : "text-slate-950";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <main className={pageClass}>
      <div className="relative flex min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-160px] right-[-120px] h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8">
          <section className="hidden min-h-[calc(100vh-48px)] flex-col justify-between rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-2xl shadow-blue-950/20 lg:flex">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-black shadow-sm">
                  ▣
                </div>

                <span className="text-2xl font-black tracking-tight">
                  StudyAI
                </span>
              </Link>

              <div className="mt-16 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-blue-50">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  {copy.badge}
                </div>

                <h1 className="text-5xl font-black leading-tight tracking-tight">
                  {copy.title}
                </h1>

                <p className="mt-5 text-base leading-7 text-blue-100">
                  {copy.subtitle}
                </p>
              </div>

              <div className="mt-10 grid max-w-xl gap-3">
                {[copy.benefitAiTutor, copy.benefitAssignments, copy.benefitExamPrep].map(
                  (benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-black">
                        ✓
                      </span>
                      <span className="text-sm font-bold text-white">
                        {benefit}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black">{copy.previewTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-blue-100">
                    {copy.previewSubtitle}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-blue-700">
                  78%
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[copy.previewCardOne, copy.previewCardTwo, copy.previewCardThree].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4"
                    >
                      <p className="text-xs font-bold leading-5 text-blue-100">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          <section className="flex min-h-[calc(100vh-48px)] flex-col">
            <header className="mb-6 flex items-center justify-between gap-4 lg:justify-end">
              <Link href="/" className="flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-600/20">
                  ▣
                </div>
                <span className={`text-xl font-black ${titleClass}`}>
                  StudyAI
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onThemeToggle}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm transition ${
                    isDark
                      ? "border-white/10 bg-slate-900 text-slate-100 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDark ? "🌙" : "☀️"}
                </button>

                <div
                  className={`flex h-11 items-center gap-1 rounded-2xl border px-2 ${
                    isDark
                      ? "border-white/10 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {(["en", "ru", "kz"] as AuthLanguage[]).map((item) => {
                    const active = language === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => onLanguageChange(item)}
                        className={`h-8 rounded-xl px-2.5 text-xs font-black transition ${
                          active
                            ? "bg-blue-600 text-white"
                            : isDark
                              ? "text-slate-400 hover:bg-white/10 hover:text-white"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        {languageLabels[item]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </header>

            <div className="flex flex-1 items-center justify-center">
              <div className={`w-full rounded-[2rem] border p-5 shadow-xl sm:p-8 ${panelClass}`}>
                {children}
              </div>
            </div>

            <footer className={`mt-6 text-center text-xs font-semibold ${mutedClass}`}>
              StudyAI © 2026
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}