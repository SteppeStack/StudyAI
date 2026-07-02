"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";

const copy: Record<
  Language,
  {
    badge: string;
    title: string;
    subtitle: string;
    dashboard: string;
    assignments: string;
    back: string;
  }
> = {
  en: {
    badge: "StudyAI",
    title: "Page not found",
    subtitle:
      "This page may have moved, been deleted, or is not available in your workspace.",
    dashboard: "Go to Dashboard",
    assignments: "Go to Assignments",
    back: "Go Back",
  },
  ru: {
    badge: "StudyAI",
    title: "Страница не найдена",
    subtitle:
      "Эта страница могла быть перемещена, удалена или сейчас недоступна в workspace.",
    dashboard: "На главную",
    assignments: "К заданиям",
    back: "Назад",
  },
  kz: {
    badge: "StudyAI",
    title: "Бет табылмады",
    subtitle:
      "Бұл бет ауыстырылған, жойылған немесе workspace ішінде қолжетімсіз болуы мүмкін.",
    dashboard: "Басты бетке",
    assignments: "Тапсырмаларға",
    back: "Артқа",
  },
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];
const themeStorageKeys = ["studyai-theme", "studyai_theme", "theme"];

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "ru";

  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);
    if (value === "en" || value === "ru" || value === "kz") return value;
  }

  return "ru";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  for (const key of themeStorageKeys) {
    const value = window.localStorage.getItem(key);
    if (value === "light" || value === "dark") return value;
  }

  return "dark";
}

export default function NotFound() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getStoredTheme());
  }, []);

  const t = copy[language];
  const isDark = theme === "dark";

  return (
    <main
      className={
        isDark
          ? "flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white"
          : "flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-950"
      }
    >
      <section
        className={`w-full max-w-2xl rounded-[2rem] border p-6 text-center shadow-xl sm:p-10 ${
          isDark
            ? "border-white/10 bg-slate-900/80 shadow-black/20"
            : "border-slate-200 bg-white shadow-slate-200/70"
        }`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-2xl font-black text-white">
          S
        </div>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-blue-500">
          {t.badge}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          {t.title}
        </h1>
        <p
          className={`mx-auto mt-3 max-w-lg text-sm leading-7 sm:text-base ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {t.subtitle}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
          >
            {t.dashboard}
          </Link>
          <Link
            href="/assignments"
            className={`inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-black transition ${
              isDark
                ? "border-white/10 text-slate-200 hover:bg-white/10"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.assignments}
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className={`inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-black transition ${
              isDark
                ? "border-white/10 text-slate-200 hover:bg-white/10"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.back}
          </button>
        </div>
      </section>
    </main>
  );
}
