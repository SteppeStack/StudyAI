"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";

type QuickActionKey =
  | "askTutor"
  | "newAssignment"
  | "createDocument"
  | "prepareExam"
  | "uploadFile";

type ModuleKey = "assignments" | "documents" | "examPrep" | "files";

type ActivityTag = "document" | "assignment" | "aiTutor" | "examPrep";

type DeadlineKey =
  | "dataStructures"
  | "researchDraft"
  | "calculusSet";

type DashboardCopy = {
  pageTitle: string;
  workspaceBadge: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  quickActionsTitle: string;
  quickActions: Record<
    QuickActionKey,
    {
      title: string;
      subtitle: string;
      href: string;
      icon: string;
    }
  >;
  usageTitle: string;
  usageSubtitle: string;
  upgradePlan: string;
  studyProgressTitle: string;
  studyProgressSubtitle: string;
  continue: string;
  viewAll: string;
  recentActivityTitle: string;
  recentActivitySubtitle: string;
  upcomingDeadlinesTitle: string;
  upcomingDeadlinesSubtitle: string;
  modules: Record<
    ModuleKey,
    {
      title: string;
      subtitle: string;
      stat: string;
      href: string;
      icon: string;
    }
  >;
  activities: {
    researchDraft: string;
    researchDraftTime: string;
    dataStructures: string;
    dataStructuresTime: string;
    photosynthesis: string;
    photosynthesisTime: string;
    thermodynamics: string;
    thermodynamicsTime: string;
  };
  activityTags: Record<ActivityTag, string>;
  deadlines: Record<
    DeadlineKey,
    {
      title: string;
      due: string;
      href: string;
    }
  >;
};

const copy: Record<Language, DashboardCopy> = {
  en: {
    pageTitle: "Dashboard",
    workspaceBadge: "StudyAI Workspace",
    welcomeTitle: "Welcome back 👋",
    welcomeSubtitle:
      "Continue your assignments, prepare for exams, review documents, and keep your study progress organized.",
    quickActionsTitle: "Quick actions",
    quickActions: {
      askTutor: {
        title: "Ask AI Tutor",
        subtitle: "Get help instantly",
        href: "/ai-tutor",
        icon: "🤖",
      },
      newAssignment: {
        title: "New assignment",
        subtitle: "Create and track",
        href: "/assignments",
        icon: "✅",
      },
      createDocument: {
        title: "Create document",
        subtitle: "Draft with AI",
        href: "/documents",
        icon: "📄",
      },
      prepareExam: {
        title: "Prepare for exam",
        subtitle: "Smart practice",
        href: "/exam-prep",
        icon: "🎯",
      },
      uploadFile: {
        title: "Upload file",
        subtitle: "Store and organize",
        href: "/files",
        icon: "📁",
      },
    },
    usageTitle: "AI usage",
    usageSubtitle: "monthly limit used",
    upgradePlan: "Upgrade plan",
    studyProgressTitle: "Study progress",
    studyProgressSubtitle: "Track your main academic workspace modules.",
    continue: "Continue",
    viewAll: "View all",
    recentActivityTitle: "Recent activity",
    recentActivitySubtitle: "Your latest saved academic work.",
    upcomingDeadlinesTitle: "Upcoming deadlines",
    upcomingDeadlinesSubtitle: "Stay ahead of important dates.",
    modules: {
      assignments: {
        title: "Assignments",
        subtitle: "active tasks",
        stat: "7",
        href: "/assignments",
        icon: "✅",
      },
      documents: {
        title: "Documents",
        subtitle: "saved drafts",
        stat: "14",
        href: "/documents",
        icon: "📄",
      },
      examPrep: {
        title: "Exam Prep",
        subtitle: "weekly progress",
        stat: "62%",
        href: "/exam-prep",
        icon: "🎯",
      },
      files: {
        title: "Files",
        subtitle: "study materials",
        stat: "28",
        href: "/files",
        icon: "📁",
      },
    },
    activities: {
      researchDraft: "Research Paper Draft",
      researchDraftTime: "Edited 2 hours ago",
      dataStructures: "Data Structures Assignment",
      dataStructuresTime: "Submitted 4 hours ago",
      photosynthesis: "Photosynthesis Process",
      photosynthesisTime: "Explained 6 hours ago",
      thermodynamics: "Thermodynamics Quiz",
      thermodynamicsTime: "Completed yesterday",
    },
    activityTags: {
      document: "Document",
      assignment: "Assignment",
      aiTutor: "AI Tutor",
      examPrep: "Exam Prep",
    },
    deadlines: {
      dataStructures: {
        title: "Data Structures Assignment",
        due: "Due in 2 days",
        href: "/assignments",
      },
      researchDraft: {
        title: "Research Paper Draft",
        due: "Due in 5 days",
        href: "/documents",
      },
      calculusSet: {
        title: "Calculus Problem Set",
        due: "Due in 8 days",
        href: "/exam-prep",
      },
    },
  },
  ru: {
    pageTitle: "Главная",
    workspaceBadge: "StudyAI Workspace",
    welcomeTitle: "С возвращением 👋",
    welcomeSubtitle:
      "Продолжай задания, готовься к экзаменам, проверяй документы и держи учебный прогресс под контролем.",
    quickActionsTitle: "Быстрые действия",
    quickActions: {
      askTutor: {
        title: "Спросить AI Tutor",
        subtitle: "Быстрая помощь",
        href: "/ai-tutor",
        icon: "🤖",
      },
      newAssignment: {
        title: "Новое задание",
        subtitle: "Создать и отслеживать",
        href: "/assignments",
        icon: "✅",
      },
      createDocument: {
        title: "Создать документ",
        subtitle: "Черновик через AI",
        href: "/documents",
        icon: "📄",
      },
      prepareExam: {
        title: "Подготовка к экзамену",
        subtitle: "Умная практика",
        href: "/exam-prep",
        icon: "🎯",
      },
      uploadFile: {
        title: "Загрузить файл",
        subtitle: "Хранить и организовать",
        href: "/files",
        icon: "📁",
      },
    },
    usageTitle: "AI-использование",
    usageSubtitle: "месячного лимита использовано",
    upgradePlan: "Улучшить план",
    studyProgressTitle: "Учебный прогресс",
    studyProgressSubtitle: "Отслеживай основные модули учебного workspace.",
    continue: "Продолжить",
    viewAll: "Смотреть все",
    recentActivityTitle: "Последняя активность",
    recentActivitySubtitle: "Недавно сохранённые учебные материалы.",
    upcomingDeadlinesTitle: "Ближайшие дедлайны",
    upcomingDeadlinesSubtitle: "Следи за важными датами заранее.",
    modules: {
      assignments: {
        title: "Задания",
        subtitle: "активных задач",
        stat: "7",
        href: "/assignments",
        icon: "✅",
      },
      documents: {
        title: "Документы",
        subtitle: "сохранённых черновиков",
        stat: "14",
        href: "/documents",
        icon: "📄",
      },
      examPrep: {
        title: "Экзамены",
        subtitle: "прогресс за неделю",
        stat: "62%",
        href: "/exam-prep",
        icon: "🎯",
      },
      files: {
        title: "Файлы",
        subtitle: "учебных материалов",
        stat: "28",
        href: "/files",
        icon: "📁",
      },
    },
    activities: {
      researchDraft: "Черновик исследовательской работы",
      researchDraftTime: "Изменено 2 часа назад",
      dataStructures: "Задание по структурам данных",
      dataStructuresTime: "Отправлено 4 часа назад",
      photosynthesis: "Процесс фотосинтеза",
      photosynthesisTime: "Объяснено 6 часов назад",
      thermodynamics: "Тест по термодинамике",
      thermodynamicsTime: "Завершено вчера",
    },
    activityTags: {
      document: "Документ",
      assignment: "Задание",
      aiTutor: "AI Tutor",
      examPrep: "Экзамены",
    },
    deadlines: {
      dataStructures: {
        title: "Задание по структурам данных",
        due: "Срок через 2 дн.",
        href: "/assignments",
      },
      researchDraft: {
        title: "Черновик исследовательской работы",
        due: "Срок через 5 дн.",
        href: "/documents",
      },
      calculusSet: {
        title: "Задачи по математическому анализу",
        due: "Срок через 8 дн.",
        href: "/exam-prep",
      },
    },
  },
  kz: {
    pageTitle: "Басты бет",
    workspaceBadge: "StudyAI Workspace",
    welcomeTitle: "Қайта қош келдіңіз 👋",
    welcomeSubtitle:
      "Тапсырмаларды жалғастырып, емтиханға дайындалып, құжаттарды тексеріп, оқу прогресін бақылауда ұстаңыз.",
    quickActionsTitle: "Жылдам әрекеттер",
    quickActions: {
      askTutor: {
        title: "AI Tutor сұрау",
        subtitle: "Жедел көмек",
        href: "/ai-tutor",
        icon: "🤖",
      },
      newAssignment: {
        title: "Жаңа тапсырма",
        subtitle: "Құру және бақылау",
        href: "/assignments",
        icon: "✅",
      },
      createDocument: {
        title: "Құжат құру",
        subtitle: "AI арқылы черновик",
        href: "/documents",
        icon: "📄",
      },
      prepareExam: {
        title: "Емтиханға дайындық",
        subtitle: "Ақылды тәжірибе",
        href: "/exam-prep",
        icon: "🎯",
      },
      uploadFile: {
        title: "Файл жүктеу",
        subtitle: "Сақтау және реттеу",
        href: "/files",
        icon: "📁",
      },
    },
    usageTitle: "AI қолдану",
    usageSubtitle: "айлық лимит пайдаланылды",
    upgradePlan: "Жоспарды жақсарту",
    studyProgressTitle: "Оқу прогресі",
    studyProgressSubtitle: "Оқу workspace негізгі модульдерін бақылаңыз.",
    continue: "Жалғастыру",
    viewAll: "Барлығын көру",
    recentActivityTitle: "Соңғы белсенділік",
    recentActivitySubtitle: "Жақында сақталған оқу материалдары.",
    upcomingDeadlinesTitle: "Жақын дедлайндар",
    upcomingDeadlinesSubtitle: "Маңызды күндерді алдын ала бақылаңыз.",
    modules: {
      assignments: {
        title: "Тапсырмалар",
        subtitle: "белсенді тапсырма",
        stat: "7",
        href: "/assignments",
        icon: "✅",
      },
      documents: {
        title: "Құжаттар",
        subtitle: "сақталған черновик",
        stat: "14",
        href: "/documents",
        icon: "📄",
      },
      examPrep: {
        title: "Емтихандар",
        subtitle: "апталық прогресс",
        stat: "62%",
        href: "/exam-prep",
        icon: "🎯",
      },
      files: {
        title: "Файлдар",
        subtitle: "оқу материалы",
        stat: "28",
        href: "/files",
        icon: "📁",
      },
    },
    activities: {
      researchDraft: "Зерттеу жұмысының черновигі",
      researchDraftTime: "2 сағат бұрын өзгертілді",
      dataStructures: "Деректер құрылымы тапсырмасы",
      dataStructuresTime: "4 сағат бұрын жіберілді",
      photosynthesis: "Фотосинтез процесі",
      photosynthesisTime: "6 сағат бұрын түсіндірілді",
      thermodynamics: "Термодинамика тесті",
      thermodynamicsTime: "Кеше аяқталды",
    },
    activityTags: {
      document: "Құжат",
      assignment: "Тапсырма",
      aiTutor: "AI Tutor",
      examPrep: "Емтихандар",
    },
    deadlines: {
      dataStructures: {
        title: "Деректер құрылымы тапсырмасы",
        due: "2 күн қалды",
        href: "/assignments",
      },
      researchDraft: {
        title: "Зерттеу жұмысының черновигі",
        due: "5 күн қалды",
        href: "/documents",
      },
      calculusSet: {
        title: "Математикалық анализ есептері",
        due: "8 күн қалды",
        href: "/exam-prep",
      },
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

function DashboardContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");

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
    window.addEventListener("studyai:profile-change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "studyai:language-change",
        handleLanguageChange
      );
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("studyai:profile-change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const quickActions = useMemo(
    () =>
      [
        t.quickActions.askTutor,
        t.quickActions.newAssignment,
        t.quickActions.createDocument,
        t.quickActions.prepareExam,
        t.quickActions.uploadFile,
      ] as const,
    [t]
  );

  const modules = useMemo(
    () =>
      [
        t.modules.assignments,
        t.modules.documents,
        t.modules.examPrep,
        t.modules.files,
      ] as const,
    [t]
  );

  const activities = useMemo(
    () => [
      {
        title: t.activities.researchDraft,
        time: t.activities.researchDraftTime,
        tag: t.activityTags.document,
        icon: "✓",
        color: isDark
          ? "bg-blue-500/15 text-blue-300"
          : "bg-blue-50 text-blue-700",
      },
      {
        title: t.activities.dataStructures,
        time: t.activities.dataStructuresTime,
        tag: t.activityTags.assignment,
        icon: "✓",
        color: isDark
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-emerald-50 text-emerald-700",
      },
      {
        title: t.activities.photosynthesis,
        time: t.activities.photosynthesisTime,
        tag: t.activityTags.aiTutor,
        icon: "✓",
        color: isDark
          ? "bg-violet-500/15 text-violet-300"
          : "bg-violet-50 text-violet-700",
      },
      {
        title: t.activities.thermodynamics,
        time: t.activities.thermodynamicsTime,
        tag: t.activityTags.examPrep,
        icon: "✓",
        color: isDark
          ? "bg-orange-500/15 text-orange-300"
          : "bg-orange-50 text-orange-700",
      },
    ],
    [isDark, t]
  );

  const deadlines = useMemo(
    () => [
      {
        date: "21 May",
        ...t.deadlines.dataStructures,
      },
      {
        date: "24 May",
        ...t.deadlines.researchDraft,
      },
      {
        date: "27 May",
        ...t.deadlines.calculusSet,
      },
    ],
    [t]
  );

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

  return (
    <div className={pageClass}>
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section
          className={`min-w-0 overflow-hidden rounded-[2rem] border p-5 sm:p-6 lg:p-8 ${cardClass}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-500">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            {t.workspaceBadge}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <h1
              className={`text-3xl font-black tracking-tight sm:text-4xl ${titleClass}`}
            >
              {t.welcomeTitle}
            </h1>

            <p className={`max-w-3xl text-sm leading-7 sm:text-base ${textClass}`}>
              {t.welcomeSubtitle}
            </p>
          </div>

          <div className="mt-8">
            <h2 className={`text-lg font-black ${titleClass}`}>
              {t.quickActionsTitle}
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {quickActions.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`min-w-0 rounded-[1.5rem] border p-4 transition hover:-translate-y-0.5 ${softCardClass}`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-xl">
                    {item.icon}
                  </div>

                  <p className={`mt-4 text-sm font-black ${titleClass}`}>
                    {item.title}
                  </p>

                  <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
                    {item.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className={`min-w-0 rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className={`text-sm font-bold ${mutedClass}`}>{t.usageTitle}</p>
              <p className={`mt-2 text-4xl font-black ${titleClass}`}>78%</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-lg">
              ⚡
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div
              className={`relative flex h-32 w-32 items-center justify-center rounded-full border-[10px] ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
              style={{
                background: `conic-gradient(#2563eb 0% 78%, transparent 78% 100%)`,
              }}
            >
              <div
                className={`flex h-24 w-24 flex-col items-center justify-center rounded-full ${
                  isDark ? "bg-slate-900" : "bg-white"
                }`}
              >
                <span className={`text-3xl font-black ${titleClass}`}>78%</span>
                <span className={`mt-1 text-center text-[11px] leading-4 ${mutedClass}`}>
                  {t.usageSubtitle}
                </span>
              </div>
            </div>
          </div>

          <p className={`mt-5 text-center text-sm font-black ${titleClass}`}>
            3,120 / 4,000 credits
          </p>

          <Link
            href="/subscription"
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            {t.upgradePlan}
          </Link>
        </aside>

        <section className="min-w-0 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className={`min-w-0 rounded-[1.75rem] border p-5 transition hover:-translate-y-0.5 ${cardClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-xl">
                    {module.icon}
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                      isDark
                        ? "bg-slate-800 text-slate-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {t.continue}
                  </span>
                </div>

                <p className={`mt-5 text-base font-black ${titleClass}`}>
                  {module.title}
                </p>

                <div className="mt-4 flex items-end gap-2">
                  <span className={`text-4xl font-black ${titleClass}`}>
                    {module.stat}
                  </span>
                  <span className={`pb-1 text-sm ${mutedClass}`}>
                    {module.subtitle}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section
              className={`min-w-0 overflow-hidden rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className={`text-xl font-black ${titleClass}`}>
                    {t.recentActivityTitle}
                  </h2>
                  <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                    {t.recentActivitySubtitle}
                  </p>
                </div>

                <Link
                  href="/files"
                  className="shrink-0 text-sm font-black text-blue-600 hover:text-blue-700"
                >
                  {t.viewAll}
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {activities.map((item) => (
                  <div
                    key={item.title}
                    className={`min-w-0 rounded-[1.5rem] border p-4 ${softCardClass}`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${item.color}`}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className={`truncate text-sm font-black ${titleClass}`}>
                              {item.title}
                            </p>
                            <p className={`mt-1 text-xs ${mutedClass}`}>
                              {item.time}
                            </p>
                          </div>

                          <span
                            className={`inline-flex shrink-0 self-start rounded-full px-3 py-1 text-xs font-black ${
                              isDark
                                ? "bg-slate-800 text-slate-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              className={`min-w-0 overflow-hidden rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className={`text-xl font-black ${titleClass}`}>
                    {t.upcomingDeadlinesTitle}
                  </h2>
                  <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                    {t.upcomingDeadlinesSubtitle}
                  </p>
                </div>

                <Link
                  href="/assignments"
                  className="shrink-0 text-sm font-black text-blue-600 hover:text-blue-700"
                >
                  {t.viewAll}
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {deadlines.map((item) => (
                  <div
                    key={item.title}
                    className={`min-w-0 overflow-hidden rounded-[1.5rem] border p-4 ${softCardClass}`}
                  >
                    <div className="flex min-w-0 flex-col gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-[11px] font-black ${
                            isDark
                              ? "bg-blue-500/15 text-blue-200"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <span>{item.date.split(" ")[0]}</span>
                          <span>{item.date.split(" ")[1]}</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-black ${titleClass}`}>
                            {item.title}
                          </p>
                          <p className={`mt-1 text-xs ${mutedClass}`}>{item.due}</p>
                        </div>
                      </div>

                      <Link
                        href={item.href}
                        className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        {t.continue}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
