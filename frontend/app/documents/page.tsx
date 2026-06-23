"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type DocumentStatus = "draft" | "generated" | "reviewed" | "archived";
type DocumentType = "essay" | "summary" | "research" | "report";
type FilterKey = "all" | DocumentStatus;

type DocumentItem = {
  id: number;
  titleKey: "aiEthics" | "marketSummary" | "researchPlan" | "internshipReport";
  courseKey: "academicWriting" | "economics" | "researchMethods" | "career";
  type: DocumentType;
  status: DocumentStatus;
  updatedAt: Date;
  words: number;
  progress: number;
};

type DocumentsCopy = {
  pageBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  createDocument: string;
  searchPlaceholder: string;
  filters: Record<FilterKey, string>;
  stats: {
    total: string;
    drafts: string;
    generated: string;
    reviewed: string;
  };
  sectionTitle: string;
  sectionSubtitle: string;
  open: string;
  continue: string;
  updated: string;
  words: string;
  progress: string;
  emptyTitle: string;
  emptySubtitle: string;
  resetFilters: string;
  assistantTitle: string;
  assistantSubtitle: string;
  createEssay: string;
  summarizeText: string;
  improveDraft: string;
  recentTitle: string;
  recentSubtitle: string;
  typesTitle: string;
  titles: Record<DocumentItem["titleKey"], string>;
  courses: Record<DocumentItem["courseKey"], string>;
  statuses: Record<DocumentStatus, string>;
  types: Record<DocumentType, string>;
};

const copy: Record<Language, DocumentsCopy> = {
  en: {
    pageBadge: "Documents workspace",
    pageTitle: "Documents",
    pageSubtitle:
      "Generate, organize, and improve academic documents with AI support.",
    createDocument: "Create document",
    searchPlaceholder: "Search documents...",
    filters: {
      all: "All",
      draft: "Drafts",
      generated: "Generated",
      reviewed: "Reviewed",
      archived: "Archived",
    },
    stats: {
      total: "Total documents",
      drafts: "Drafts",
      generated: "Generated",
      reviewed: "Reviewed",
    },
    sectionTitle: "Your documents",
    sectionSubtitle: "Manage essays, summaries, research papers, and reports.",
    open: "Open",
    continue: "Continue",
    updated: "Updated",
    words: "words",
    progress: "Progress",
    emptyTitle: "No documents found",
    emptySubtitle:
      "Try another search or reset filters to see all documents.",
    resetFilters: "Reset filters",
    assistantTitle: "AI document assistant",
    assistantSubtitle:
      "Create outlines, improve structure, summarize files, and polish your academic writing.",
    createEssay: "Create essay",
    summarizeText: "Summarize text",
    improveDraft: "Improve draft",
    recentTitle: "Recent document",
    recentSubtitle: "Last updated document in your workspace.",
    typesTitle: "Document type",
    titles: {
      aiEthics: "AI Ethics Essay Draft",
      marketSummary: "Market Analysis Summary",
      researchPlan: "Research Project Plan",
      internshipReport: "Internship Report",
    },
    courses: {
      academicWriting: "Academic Writing",
      economics: "Economics",
      researchMethods: "Research Methods",
      career: "Career Development",
    },
    statuses: {
      draft: "Draft",
      generated: "Generated",
      reviewed: "Reviewed",
      archived: "Archived",
    },
    types: {
      essay: "Essay",
      summary: "Summary",
      research: "Research paper",
      report: "Report",
    },
  },
  ru: {
    pageBadge: "Documents workspace",
    pageTitle: "Документы",
    pageSubtitle:
      "Создавай, организуй и улучшай учебные документы с помощью AI.",
    createDocument: "Создать документ",
    searchPlaceholder: "Поиск документов...",
    filters: {
      all: "Все",
      draft: "Черновики",
      generated: "Сгенерировано",
      reviewed: "Проверено",
      archived: "Архив",
    },
    stats: {
      total: "Всего документов",
      drafts: "Черновики",
      generated: "Сгенерировано",
      reviewed: "Проверено",
    },
    sectionTitle: "Твои документы",
    sectionSubtitle: "Управляй эссе, конспектами, исследованиями и отчётами.",
    open: "Открыть",
    continue: "Продолжить",
    updated: "Обновлено",
    words: "слов",
    progress: "Прогресс",
    emptyTitle: "Документы не найдены",
    emptySubtitle:
      "Попробуй изменить поиск или сбросить фильтры, чтобы увидеть все документы.",
    resetFilters: "Сбросить фильтры",
    assistantTitle: "AI-помощник для документов",
    assistantSubtitle:
      "Создавай планы, улучшай структуру, сокращай тексты и дорабатывай академический стиль.",
    createEssay: "Создать эссе",
    summarizeText: "Сделать конспект",
    improveDraft: "Улучшить черновик",
    recentTitle: "Недавний документ",
    recentSubtitle: "Последний обновлённый документ в workspace.",
    typesTitle: "Тип документа",
    titles: {
      aiEthics: "Черновик эссе об этике AI",
      marketSummary: "Конспект анализа рынка",
      researchPlan: "План исследовательского проекта",
      internshipReport: "Отчёт по стажировке",
    },
    courses: {
      academicWriting: "Academic Writing",
      economics: "Economics",
      researchMethods: "Research Methods",
      career: "Career Development",
    },
    statuses: {
      draft: "Черновик",
      generated: "Сгенерировано",
      reviewed: "Проверено",
      archived: "Архив",
    },
    types: {
      essay: "Эссе",
      summary: "Конспект",
      research: "Исследовательская работа",
      report: "Отчёт",
    },
  },
  kz: {
    pageBadge: "Documents workspace",
    pageTitle: "Құжаттар",
    pageSubtitle:
      "AI көмегімен оқу құжаттарын жасаңыз, реттеңіз және жақсартыңыз.",
    createDocument: "Құжат жасау",
    searchPlaceholder: "Құжаттарды іздеу...",
    filters: {
      all: "Барлығы",
      draft: "Черновиктер",
      generated: "Жасалды",
      reviewed: "Тексерілді",
      archived: "Архив",
    },
    stats: {
      total: "Барлық құжат",
      drafts: "Черновиктер",
      generated: "Жасалды",
      reviewed: "Тексерілді",
    },
    sectionTitle: "Сіздің құжаттарыңыз",
    sectionSubtitle:
      "Эссе, конспект, зерттеу жұмыстары және есептерді басқарыңыз.",
    open: "Ашу",
    continue: "Жалғастыру",
    updated: "Жаңартылды",
    words: "сөз",
    progress: "Прогресс",
    emptyTitle: "Құжаттар табылмады",
    emptySubtitle:
      "Басқа іздеу қолданып көріңіз немесе барлық құжатты көру үшін фильтрді тазалаңыз.",
    resetFilters: "Фильтрді тазалау",
    assistantTitle: "AI құжат көмекшісі",
    assistantSubtitle:
      "Жоспар құрыңыз, құрылымды жақсартыңыз, мәтінді қысқартыңыз және академиялық стильді түзетіңіз.",
    createEssay: "Эссе жасау",
    summarizeText: "Конспект жасау",
    improveDraft: "Черновикті жақсарту",
    recentTitle: "Соңғы құжат",
    recentSubtitle: "Workspace ішіндегі соңғы жаңартылған құжат.",
    typesTitle: "Құжат түрі",
    titles: {
      aiEthics: "AI этикасы туралы эссе черновигі",
      marketSummary: "Нарық талдауы конспекті",
      researchPlan: "Зерттеу жобасының жоспары",
      internshipReport: "Практика есебі",
    },
    courses: {
      academicWriting: "Academic Writing",
      economics: "Economics",
      researchMethods: "Research Methods",
      career: "Career Development",
    },
    statuses: {
      draft: "Черновик",
      generated: "Жасалды",
      reviewed: "Тексерілді",
      archived: "Архив",
    },
    types: {
      essay: "Эссе",
      summary: "Конспект",
      research: "Зерттеу жұмысы",
      report: "Есеп",
    },
  },
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

const themeStorageKeys = ["studyai-theme", "studyai_theme", "theme"];

const documents: DocumentItem[] = [
  {
    id: 1,
    titleKey: "aiEthics",
    courseKey: "academicWriting",
    type: "essay",
    status: "draft",
    updatedAt: new Date("2026-05-23T12:00:00"),
    words: 1240,
    progress: 58,
  },
  {
    id: 2,
    titleKey: "marketSummary",
    courseKey: "economics",
    type: "summary",
    status: "generated",
    updatedAt: new Date("2026-05-22T12:00:00"),
    words: 860,
    progress: 100,
  },
  {
    id: 3,
    titleKey: "researchPlan",
    courseKey: "researchMethods",
    type: "research",
    status: "reviewed",
    updatedAt: new Date("2026-05-20T12:00:00"),
    words: 2100,
    progress: 92,
  },
  {
    id: 4,
    titleKey: "internshipReport",
    courseKey: "career",
    type: "report",
    status: "archived",
    updatedAt: new Date("2026-05-14T12:00:00"),
    words: 1750,
    progress: 100,
  },
];

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "ru";

  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "en" || value === "ru" || value === "kz") {
      return value;
    }
  }

  return "ru";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  for (const key of themeStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "light" || value === "dark") {
      return value;
    }
  }

  return "dark";
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}.${month}.${year}`;
}

function formatWords(words: number) {
  return new Intl.NumberFormat("ru-RU").format(words);
}

function getStatusColor(status: DocumentStatus, isDark: boolean) {
  if (status === "reviewed") {
    return isDark
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "generated") {
    return isDark
      ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
      : "border-blue-100 bg-blue-50 text-blue-700";
  }

  if (status === "archived") {
    return isDark
      ? "border-slate-400/20 bg-slate-400/10 text-slate-300"
      : "border-slate-200 bg-slate-100 text-slate-600";
  }

  return isDark
    ? "border-violet-400/20 bg-violet-400/10 text-violet-200"
    : "border-violet-100 bg-violet-50 text-violet-700";
}

function DocumentsContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const t = copy[language];
  const isDark = theme === "dark";

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getStoredTheme());

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<Language>;

      if (
        customEvent.detail === "en" ||
        customEvent.detail === "ru" ||
        customEvent.detail === "kz"
      ) {
        setLanguage(customEvent.detail);
      }
    }

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<Theme>;

      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setTheme(customEvent.detail);
      }
    }

    function handleStorageChange() {
      setLanguage(getStoredLanguage());
      setTheme(getStoredTheme());
    }

    window.addEventListener("studyai:language-change", handleLanguageChange);
    window.addEventListener("studyai:theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "studyai:language-change",
        handleLanguageChange
      );
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: documents.length,
      drafts: documents.filter((item) => item.status === "draft").length,
      generated: documents.filter((item) => item.status === "generated").length,
      reviewed: documents.filter((item) => item.status === "reviewed").length,
    };
  }, []);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesStatus =
        activeFilter === "all" || document.status === activeFilter;

      const searchableText = [
        t.titles[document.titleKey],
        t.courses[document.courseKey],
        t.statuses[document.status],
        t.types[document.type],
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, search, t]);

  const recentDocument = useMemo(() => {
    return [...documents].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )[0];
  }, []);

  const pageClass = isDark
    ? "min-h-full bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"
    : "min-h-full bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8";

  const cardClass = isDark
    ? "border-white/10 bg-slate-900/70 shadow-sm"
    : "border-slate-200 bg-white shadow-sm";

  const softCardClass = isDark
    ? "border-white/10 bg-slate-950/50"
    : "border-slate-200 bg-slate-50";

  const titleClass = isDark ? "text-white" : "text-slate-950";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";

  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-500/10"
    : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/10";

  return (
    <div className={pageClass}>
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section
          className={`min-w-0 overflow-hidden rounded-[2rem] border p-5 sm:p-6 lg:p-8 xl:col-span-2 ${cardClass}`}
        >
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  isDark
                    ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                    : "border-blue-100 bg-blue-50 text-blue-700"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {t.pageBadge}
              </div>

              <h1
                className={`text-3xl font-black tracking-tight sm:text-4xl ${titleClass}`}
              >
                {t.pageTitle}
              </h1>

              <p
                className={`mt-3 max-w-3xl text-sm leading-6 sm:text-base ${textClass}`}
              >
                {t.pageSubtitle}
              </p>
            </div>

            <Link
              href="/documents/new"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {t.createDocument}
            </Link>
          </div>
        </section>

        <section className="min-w-0 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
              <p className={`text-sm font-bold ${mutedClass}`}>
                {t.stats.total}
              </p>
              <p className={`mt-3 text-3xl font-black ${titleClass}`}>
                {stats.total}
              </p>
            </div>

            <div className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
              <p className={`text-sm font-bold ${mutedClass}`}>
                {t.stats.drafts}
              </p>
              <p className={`mt-3 text-3xl font-black ${titleClass}`}>
                {stats.drafts}
              </p>
            </div>

            <div className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
              <p className={`text-sm font-bold ${mutedClass}`}>
                {t.stats.generated}
              </p>
              <p className={`mt-3 text-3xl font-black ${titleClass}`}>
                {stats.generated}
              </p>
            </div>

            <div className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
              <p className={`text-sm font-bold ${mutedClass}`}>
                {t.stats.reviewed}
              </p>
              <p className={`mt-3 text-3xl font-black ${titleClass}`}>
                {stats.reviewed}
              </p>
            </div>
          </div>
        </section>

        <section
          className={`min-w-0 rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}
        >
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.sectionTitle}
              </h2>

              <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                {t.sectionSubtitle}
              </p>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.searchPlaceholder}
              className={`h-11 w-full rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 lg:w-72 ${inputClass}`}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(
              ["all", "draft", "generated", "reviewed", "archived"] as FilterKey[]
            ).map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-2xl border px-4 py-2 text-sm font-black transition ${
                    active
                      ? "border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                      : isDark
                        ? "border-white/10 bg-slate-950/50 text-slate-300 hover:border-blue-400/30 hover:bg-blue-400/10"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {t.filters[filter]}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document) => (
                <article
                  key={document.id}
                  className={`min-w-0 rounded-[1.75rem] border p-5 ${softCardClass}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusColor(
                            document.status,
                            isDark
                          )}`}
                        >
                          {t.statuses[document.status]}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isDark
                              ? "bg-white/10 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {t.types[document.type]}
                        </span>
                      </div>

                      <h3 className={`mt-4 text-lg font-black ${titleClass}`}>
                        {t.titles[document.titleKey]}
                      </h3>

                      <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                        {t.courses[document.courseKey]}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/documents/${document.id}`}
                        className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-black transition ${
                          isDark
                            ? "border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/10"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {t.open}
                      </Link>

                      <Link
                        href={`/documents/${document.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        {t.continue}
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className={`rounded-2xl border p-4 ${softCardClass}`}>
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                      >
                        {t.updated}
                      </p>
                      <p className={`mt-1 text-sm font-black ${titleClass}`}>
                        {formatDate(document.updatedAt)}
                      </p>
                    </div>

                    <div className={`rounded-2xl border p-4 ${softCardClass}`}>
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                      >
                        {t.words}
                      </p>
                      <p className={`mt-1 text-sm font-black ${titleClass}`}>
                        {formatWords(document.words)}
                      </p>
                    </div>

                    <div className={`rounded-2xl border p-4 ${softCardClass}`}>
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                      >
                        {t.progress}
                      </p>
                      <p className={`mt-1 text-sm font-black ${titleClass}`}>
                        {document.progress}%
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-4 h-3 overflow-hidden rounded-full ${
                      isDark ? "bg-slate-950" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${document.progress}%` }}
                    />
                  </div>
                </article>
              ))
            ) : (
              <div
                className={`rounded-[1.75rem] border p-8 text-center ${softCardClass}`}
              >
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${
                    isDark ? "bg-blue-500/15" : "bg-blue-600/10"
                  }`}
                >
                  🔎
                </div>

                <h3 className={`mt-4 text-xl font-black ${titleClass}`}>
                  {t.emptyTitle}
                </h3>

                <p
                  className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedClass}`}
                >
                  {t.emptySubtitle}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("all");
                    setSearch("");
                  }}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  {t.resetFilters}
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="grid min-w-0 gap-6">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div className="min-w-0">
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.recentTitle}
              </h2>

              <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                {t.recentSubtitle}
              </p>
            </div>

            {recentDocument && (
              <div className={`mt-5 rounded-3xl border p-4 ${softCardClass}`}>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusColor(
                    recentDocument.status,
                    isDark
                  )}`}
                >
                  {t.statuses[recentDocument.status]}
                </span>

                <h3 className={`mt-4 text-base font-black ${titleClass}`}>
                  {t.titles[recentDocument.titleKey]}
                </h3>

                <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                  {t.courses[recentDocument.courseKey]}
                </p>

                <div className={`mt-4 rounded-2xl border p-4 ${softCardClass}`}>
                  <p
                    className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                  >
                    {t.updated}
                  </p>
                  <p className={`mt-1 text-sm font-black ${titleClass}`}>
                    {formatDate(recentDocument.updatedAt)}
                  </p>
                </div>

                <div className={`mt-3 rounded-2xl border p-4 ${softCardClass}`}>
                  <p
                    className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                  >
                    {t.typesTitle}
                  </p>
                  <p className={`mt-1 text-sm font-black ${titleClass}`}>
                    {t.types[recentDocument.type]}
                  </p>
                </div>

                <Link
                  href={`/documents/${recentDocument.id}`}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  {t.continue}
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-sm shadow-blue-600/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl">
              ✨
            </div>

            <h2 className="mt-5 text-xl font-black">{t.assistantTitle}</h2>

            <p className="mt-2 text-sm font-medium leading-6 text-blue-100">
              {t.assistantSubtitle}
            </p>

            <div className="mt-5 grid gap-2">
              <Link
                href="/ai-tutor"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-blue-700 transition hover:bg-blue-50"
              >
                {t.createEssay}
              </Link>

              <Link
                href="/ai-tutor"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-black text-white transition hover:bg-white/20"
              >
                {t.summarizeText}
              </Link>

              <Link
                href="/ai-tutor"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-black text-white transition hover:bg-white/20"
              >
                {t.improveDraft}
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <AppShell>
      <DocumentsContent />
    </AppShell>
  );
}