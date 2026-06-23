"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type AssignmentStatus = "draft" | "inProgress" | "submitted" | "overdue";
type FilterKey = "all" | AssignmentStatus;

type AssignmentItem = {
  id: number;
  titleKey: "research" | "dataStructures" | "economics" | "statistics";
  courseKey: "academicWriting" | "computerScience" | "economics" | "statistics";
  status: AssignmentStatus;
  dueDate: Date;
  progress: number;
  tasks: number;
  completedTasks: number;
};

type AssignmentCopy = {
  pageBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  createAssignment: string;
  searchPlaceholder: string;
  filters: Record<FilterKey, string>;
  stats: {
    total: string;
    inProgress: string;
    submitted: string;
    overdue: string;
  };
  sectionTitle: string;
  sectionSubtitle: string;
  continue: string;
  open: string;
  due: string;
  progress: string;
  tasks: string;
  completed: string;
  emptyTitle: string;
  emptySubtitle: string;
  resetFilters: string;
  upcomingTitle: string;
  upcomingSubtitle: string;
  priority: string;
  aiHelperTitle: string;
  aiHelperSubtitle: string;
  generateDraft: string;
  improveText: string;
  checkStructure: string;
  titles: Record<AssignmentItem["titleKey"], string>;
  courses: Record<AssignmentItem["courseKey"], string>;
  statuses: Record<AssignmentStatus, string>;
};

const copy: Record<Language, AssignmentCopy> = {
  en: {
    pageBadge: "Assignments workspace",
    pageTitle: "Assignments",
    pageSubtitle:
      "Create, track, and complete your academic tasks in one organized place.",
    createAssignment: "Create assignment",
    searchPlaceholder: "Search assignments...",
    filters: {
      all: "All",
      draft: "Drafts",
      inProgress: "In progress",
      submitted: "Submitted",
      overdue: "Overdue",
    },
    stats: {
      total: "Total assignments",
      inProgress: "In progress",
      submitted: "Submitted",
      overdue: "Overdue",
    },
    sectionTitle: "Your assignments",
    sectionSubtitle: "Track deadlines, progress, and submission status.",
    continue: "Continue",
    open: "Open",
    due: "Due",
    progress: "Progress",
    tasks: "tasks",
    completed: "completed",
    emptyTitle: "No assignments found",
    emptySubtitle:
      "Try another search or reset the filters to see all assignments.",
    resetFilters: "Reset filters",
    upcomingTitle: "Upcoming focus",
    upcomingSubtitle: "The next task that needs your attention.",
    priority: "Priority",
    aiHelperTitle: "AI assignment helper",
    aiHelperSubtitle:
      "Use AI Tutor to outline, improve, or review your assignment before submission.",
    generateDraft: "Generate draft",
    improveText: "Improve text",
    checkStructure: "Check structure",
    titles: {
      research: "Research Paper Draft",
      dataStructures: "Data Structures Assignment",
      economics: "Market Analysis Essay",
      statistics: "Statistics Problem Set",
    },
    courses: {
      academicWriting: "Academic Writing",
      computerScience: "Computer Science",
      economics: "Economics",
      statistics: "Business Statistics",
    },
    statuses: {
      draft: "Draft",
      inProgress: "In progress",
      submitted: "Submitted",
      overdue: "Overdue",
    },
  },
  ru: {
    pageBadge: "Assignments workspace",
    pageTitle: "Задания",
    pageSubtitle:
      "Создавай, отслеживай и завершай учебные задания в одном удобном месте.",
    createAssignment: "Создать задание",
    searchPlaceholder: "Поиск заданий...",
    filters: {
      all: "Все",
      draft: "Черновики",
      inProgress: "В работе",
      submitted: "Отправлено",
      overdue: "Просрочено",
    },
    stats: {
      total: "Всего заданий",
      inProgress: "В работе",
      submitted: "Отправлено",
      overdue: "Просрочено",
    },
    sectionTitle: "Твои задания",
    sectionSubtitle: "Следи за дедлайнами, прогрессом и статусом отправки.",
    continue: "Продолжить",
    open: "Открыть",
    due: "Срок",
    progress: "Прогресс",
    tasks: "задач",
    completed: "выполнено",
    emptyTitle: "Задания не найдены",
    emptySubtitle:
      "Попробуй изменить поиск или сбросить фильтры, чтобы увидеть все задания.",
    resetFilters: "Сбросить фильтры",
    upcomingTitle: "Ближайший фокус",
    upcomingSubtitle: "Следующее задание, которое требует внимания.",
    priority: "Приоритет",
    aiHelperTitle: "AI-помощник по заданиям",
    aiHelperSubtitle:
      "Используй AI Tutor, чтобы составить план, улучшить текст или проверить структуру перед отправкой.",
    generateDraft: "Создать черновик",
    improveText: "Улучшить текст",
    checkStructure: "Проверить структуру",
    titles: {
      research: "Черновик исследовательской работы",
      dataStructures: "Задание по структурам данных",
      economics: "Эссе по анализу рынка",
      statistics: "Задачи по статистике",
    },
    courses: {
      academicWriting: "Academic Writing",
      computerScience: "Computer Science",
      economics: "Economics",
      statistics: "Business Statistics",
    },
    statuses: {
      draft: "Черновик",
      inProgress: "В работе",
      submitted: "Отправлено",
      overdue: "Просрочено",
    },
  },
  kz: {
    pageBadge: "Assignments workspace",
    pageTitle: "Тапсырмалар",
    pageSubtitle:
      "Оқу тапсырмаларын бір жерде құрыңыз, бақылаңыз және аяқтаңыз.",
    createAssignment: "Тапсырма құру",
    searchPlaceholder: "Тапсырмаларды іздеу...",
    filters: {
      all: "Барлығы",
      draft: "Черновиктер",
      inProgress: "Жұмыста",
      submitted: "Жіберілді",
      overdue: "Мерзімі өтті",
    },
    stats: {
      total: "Барлық тапсырма",
      inProgress: "Жұмыста",
      submitted: "Жіберілді",
      overdue: "Мерзімі өтті",
    },
    sectionTitle: "Сіздің тапсырмаларыңыз",
    sectionSubtitle:
      "Дедлайндарды, прогресті және жіберу статусын бақылаңыз.",
    continue: "Жалғастыру",
    open: "Ашу",
    due: "Мерзім",
    progress: "Прогресс",
    tasks: "тапсырма",
    completed: "аяқталды",
    emptyTitle: "Тапсырмалар табылмады",
    emptySubtitle:
      "Басқа іздеу қолданып көріңіз немесе барлық тапсырманы көру үшін фильтрді тазалаңыз.",
    resetFilters: "Фильтрді тазалау",
    upcomingTitle: "Жақын фокус",
    upcomingSubtitle: "Назар аударуды қажет ететін келесі тапсырма.",
    priority: "Приоритет",
    aiHelperTitle: "AI тапсырма көмекшісі",
    aiHelperSubtitle:
      "AI Tutor арқылы жоспар құрып, мәтінді жақсартып немесе құрылымды тексеруге болады.",
    generateDraft: "Черновик жасау",
    improveText: "Мәтінді жақсарту",
    checkStructure: "Құрылымды тексеру",
    titles: {
      research: "Зерттеу жұмысының черновигі",
      dataStructures: "Деректер құрылымы тапсырмасы",
      economics: "Нарық талдауы эссесі",
      statistics: "Статистика есептері",
    },
    courses: {
      academicWriting: "Academic Writing",
      computerScience: "Computer Science",
      economics: "Economics",
      statistics: "Business Statistics",
    },
    statuses: {
      draft: "Черновик",
      inProgress: "Жұмыста",
      submitted: "Жіберілді",
      overdue: "Мерзімі өтті",
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

const assignments: AssignmentItem[] = [
  {
    id: 1,
    titleKey: "dataStructures",
    courseKey: "computerScience",
    status: "inProgress",
    dueDate: new Date("2026-05-21T12:00:00"),
    progress: 68,
    tasks: 5,
    completedTasks: 3,
  },
  {
    id: 2,
    titleKey: "research",
    courseKey: "academicWriting",
    status: "draft",
    dueDate: new Date("2026-05-24T12:00:00"),
    progress: 42,
    tasks: 6,
    completedTasks: 2,
  },
  {
    id: 3,
    titleKey: "economics",
    courseKey: "economics",
    status: "submitted",
    dueDate: new Date("2026-05-18T12:00:00"),
    progress: 100,
    tasks: 4,
    completedTasks: 4,
  },
  {
    id: 4,
    titleKey: "statistics",
    courseKey: "statistics",
    status: "overdue",
    dueDate: new Date("2026-05-16T12:00:00"),
    progress: 35,
    tasks: 8,
    completedTasks: 3,
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

function getStatusColor(status: AssignmentStatus, isDark: boolean) {
  if (status === "submitted") {
    return isDark
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "overdue") {
    return isDark
      ? "border-red-400/20 bg-red-400/10 text-red-200"
      : "border-red-100 bg-red-50 text-red-700";
  }

  if (status === "inProgress") {
    return isDark
      ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
      : "border-blue-100 bg-blue-50 text-blue-700";
  }

  return isDark
    ? "border-violet-400/20 bg-violet-400/10 text-violet-200"
    : "border-violet-100 bg-violet-50 text-violet-700";
}

function AssignmentsContent() {
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
      total: assignments.length,
      inProgress: assignments.filter((item) => item.status === "inProgress")
        .length,
      submitted: assignments.filter((item) => item.status === "submitted")
        .length,
      overdue: assignments.filter((item) => item.status === "overdue").length,
    };
  }, []);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const matchesStatus =
        activeFilter === "all" || assignment.status === activeFilter;

      const searchableText = [
        t.titles[assignment.titleKey],
        t.courses[assignment.courseKey],
        t.statuses[assignment.status],
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, search, t]);

  const nextAssignment = useMemo(() => {
    return [...assignments]
      .filter((assignment) => assignment.status !== "submitted")
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];
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
              href="/assignments/new"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {t.createAssignment}
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
                {t.stats.inProgress}
              </p>
              <p className={`mt-3 text-3xl font-black ${titleClass}`}>
                {stats.inProgress}
              </p>
            </div>

            <div className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
              <p className={`text-sm font-bold ${mutedClass}`}>
                {t.stats.submitted}
              </p>
              <p className={`mt-3 text-3xl font-black ${titleClass}`}>
                {stats.submitted}
              </p>
            </div>

            <div className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
              <p className={`text-sm font-bold ${mutedClass}`}>
                {t.stats.overdue}
              </p>
              <p className={`mt-3 text-3xl font-black ${titleClass}`}>
                {stats.overdue}
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
              ["all", "draft", "inProgress", "submitted", "overdue"] as FilterKey[]
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
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className={`min-w-0 rounded-[1.75rem] border p-5 ${softCardClass}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusColor(
                            assignment.status,
                            isDark
                          )}`}
                        >
                          {t.statuses[assignment.status]}
                        </span>

                        <span className={`text-xs font-bold ${mutedClass}`}>
                          {t.due}: {formatDate(assignment.dueDate)}
                        </span>
                      </div>

                      <h3 className={`mt-4 text-lg font-black ${titleClass}`}>
                        {t.titles[assignment.titleKey]}
                      </h3>

                      <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                        {t.courses[assignment.courseKey]}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-black transition ${
                          isDark
                            ? "border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/10"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {t.open}
                      </Link>

                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        {t.continue}
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className={`text-sm font-bold ${mutedClass}`}>
                        {t.progress}
                      </p>

                      <p className={`text-sm font-black ${titleClass}`}>
                        {assignment.progress}%
                      </p>
                    </div>

                    <div
                      className={`mt-2 h-3 overflow-hidden rounded-full ${
                        isDark ? "bg-slate-950" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${assignment.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isDark
                          ? "bg-white/10 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {assignment.completedTasks}/{assignment.tasks}{" "}
                      {t.completed}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isDark
                          ? "bg-white/10 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {assignment.tasks} {t.tasks}
                    </span>
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
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className={`text-xl font-black ${titleClass}`}>
                  {t.upcomingTitle}
                </h2>

                <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                  {t.upcomingSubtitle}
                </p>
              </div>

              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-black text-blue-600">
                {t.priority}
              </span>
            </div>

            {nextAssignment && (
              <div className={`mt-5 rounded-3xl border p-4 ${softCardClass}`}>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusColor(
                    nextAssignment.status,
                    isDark
                  )}`}
                >
                  {t.statuses[nextAssignment.status]}
                </span>

                <h3 className={`mt-4 text-base font-black ${titleClass}`}>
                  {t.titles[nextAssignment.titleKey]}
                </h3>

                <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                  {t.courses[nextAssignment.courseKey]}
                </p>

                <div className={`mt-4 rounded-2xl border p-4 ${softCardClass}`}>
                  <p
                    className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                  >
                    {t.due}
                  </p>
                  <p className={`mt-1 text-sm font-black ${titleClass}`}>
                    {formatDate(nextAssignment.dueDate)}
                  </p>
                </div>

                <Link
                  href={`/assignments/${nextAssignment.id}`}
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

            <h2 className="mt-5 text-xl font-black">{t.aiHelperTitle}</h2>

            <p className="mt-2 text-sm font-medium leading-6 text-blue-100">
              {t.aiHelperSubtitle}
            </p>

            <div className="mt-5 grid gap-2">
              <Link
                href="/ai-tutor"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-blue-700 transition hover:bg-blue-50"
              >
                {t.generateDraft}
              </Link>

              <Link
                href="/ai-tutor"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-black text-white transition hover:bg-white/20"
              >
                {t.improveText}
              </Link>

              <Link
                href="/ai-tutor"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-black text-white transition hover:bg-white/20"
              >
                {t.checkStructure}
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <AppShell>
      <AssignmentsContent />
    </AppShell>
  );
}