"use client";

import Link from "next/link";
import { useState } from "react";

type Lang = "en" | "ru" | "kz";

const languageOptions: {
  code: Lang;
  short: string;
}[] = [
  { code: "en", short: "EN" },
  { code: "ru", short: "RU" },
  { code: "kz", short: "KZ" },
];

const languageMenuTitle: Record<Lang, string> = {
  en: "Language",
  ru: "Язык",
  kz: "Тіл",
};

const languageNames: Record<Lang, Record<Lang, string>> = {
  en: {
    en: "English",
    ru: "Russian",
    kz: "Kazakh",
  },
  ru: {
    en: "Английский",
    ru: "Русский",
    kz: "Казахский",
  },
  kz: {
    en: "Ағылшынша",
    ru: "Орысша",
    kz: "Қазақша",
  },
};

const content = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      students: "For Students",
      teachers: "For Universities",
      login: "Login",
      getStarted: "Get Started",
    },
    hero: {
      badge: "Your AI academic workspace",
      titleStart: "Study smarter",
      titleAccent: "with AI",
      description:
        "StudyAI helps students manage assignments, generate documents, prepare for exams, organize files, and track academic progress in one clean workspace.",
      primary: "Get Started for Free",
      secondary: "Login to Workspace",
      trust1: "For students",
      trust2: "Academic workflow",
      trust3: "AI-powered tools",
    },
    dashboard: {
      label: "Dashboard",
      welcome: "Welcome back, Alex 👋",
      search: "Search ⌘K",
      usage: "AI Usage",
      details: "Details",
      used: "used",
      credits: "3,120 / 4,000 credits",
      recent: "Recent Activity",
      deadlines: "Upcoming Deadlines",
      viewAll: "View all",
    },
    quickActions: [
      "Ask AI Tutor",
      "New Assignment",
      "Generate Document",
      "Prepare for Exam",
      "Upload File",
    ],
    activityItems: [
      { title: "Research Paper Draft", meta: "Edited 2 hours ago" },
      { title: "Data Structures Assignment", meta: "Submitted 4 hours ago" },
      { title: "Thermodynamics Quiz", meta: "Completed yesterday" },
    ],
    deadlineItems: [
      {
        date: "MAY 21",
        title: "Data Structures Assignment",
        meta: "Due in 2 days",
      },
      {
        date: "MAY 24",
        title: "Research Paper Draft",
        meta: "Due in 5 days",
      },
      {
        date: "MAY 30",
        title: "Management Case Study",
        meta: "Due in 11 days",
      },
    ],
    featuresSection: {
      eyebrow: "Features",
      title: "Everything you need to study better",
      description:
        "One workspace for academic planning, AI support, files, documents, assignments, exams, and progress.",
      learnMore: "Learn more →",
    },
    features: [
      {
        title: "AI Tutor",
        description:
          "Get clear explanations, examples, and study support anytime.",
        icon: "🤖",
      },
      {
        title: "Assignments",
        description:
          "Create, organize, and improve assignment work with AI help.",
        icon: "✅",
      },
      {
        title: "Documents",
        description:
          "Generate essays, reports, summaries, and academic drafts.",
        icon: "📄",
      },
      {
        title: "Exam Prep",
        description:
          "Prepare with study plans, flashcards, quizzes, and reminders.",
        icon: "🎯",
      },
      {
        title: "Files",
        description:
          "Upload, organize, summarize, and reuse study materials.",
        icon: "📁",
      },
      {
        title: "Diploma Assistant",
        description:
          "Plan diploma work, structure chapters, and track progress.",
        icon: "🎓",
      },
    ],
    audience: {
      studentsTitle: "Built for students",
      studentsText:
        "StudyAI helps students organize study materials, avoid chaos before deadlines, prepare earlier for exams, and keep AI-generated work in one place.",
      teachersTitle: "Ready for university pilots",
      teachersText:
        "Later, StudyAI can support universities with official exam calendars, academic deadlines, responsible AI usage, and student preparation workflows.",
    },
    pricingSection: {
      eyebrow: "Pricing",
      title: "Simple plans for students and educators",
      description:
        "Start free, upgrade when you need more AI power and academic workspace features.",
      mostPopular: "Most Popular",
      perMonth: "/month",
      startFree: "Start Free",
      choosePlan: "Choose Plan",
    },
    pricingPlans: [
      {
        id: "free",
        name: "Free",
        price: "$0",
        description: "Perfect for getting started",
        features: [
          "Basic AI Tutor",
          "Limited document generation",
          "Basic assignments helper",
          "Small file storage",
        ],
        highlighted: false,
      },
      {
        id: "student",
        name: "Student Premium",
        price: "$9.99",
        description: "Best for everyday academic success",
        features: [
          "Advanced AI Tutor",
          "Document Generator",
          "Exam Prep tools",
          "File analysis and saved history",
        ],
        highlighted: true,
      },
      {
        id: "teacher",
        name: "Teacher Plan",
        price: "$19.99",
        description: "For educators and academic teams",
        features: [
          "Higher usage limits",
          "Classroom features later",
          "Priority support",
          "University-ready tools",
        ],
        highlighted: false,
      },
    ],
    footer: {
      text: "© 2026 StudyAI. Academic AI workspace for smarter learning.",
    },
  },
  ru: {
    nav: {
      features: "Функции",
      pricing: "Тарифы",
      students: "Студентам",
      teachers: "Университетам",
      login: "Войти",
      getStarted: "Начать",
    },
    hero: {
      badge: "Твой академический AI workspace",
      titleStart: "Учись умнее",
      titleAccent: "с AI",
      description:
        "StudyAI помогает студентам управлять заданиями, генерировать документы, готовиться к экзаменам, организовывать файлы и отслеживать учебный прогресс в одном чистом workspace.",
      primary: "Начать бесплатно",
      secondary: "Войти в workspace",
      trust1: "Для студентов",
      trust2: "Учебный workflow",
      trust3: "AI-инструменты",
    },
    dashboard: {
      label: "Dashboard",
      welcome: "С возвращением, Alex 👋",
      search: "Поиск ⌘K",
      usage: "AI Usage",
      details: "Детали",
      used: "использовано",
      credits: "3,120 / 4,000 кредитов",
      recent: "Последняя активность",
      deadlines: "Ближайшие дедлайны",
      viewAll: "Смотреть все",
    },
    quickActions: [
      "Спросить AI Tutor",
      "Новое задание",
      "Создать документ",
      "Подготовка к экзамену",
      "Загрузить файл",
    ],
    activityItems: [
      {
        title: "Черновик Research Paper",
        meta: "Редактировано 2 часа назад",
      },
      {
        title: "Задание Data Structures",
        meta: "Сдано 4 часа назад",
      },
      {
        title: "Quiz по термодинамике",
        meta: "Завершено вчера",
      },
    ],
    deadlineItems: [
      {
        date: "21 МАЯ",
        title: "Data Structures Assignment",
        meta: "Через 2 дня",
      },
      {
        date: "24 МАЯ",
        title: "Research Paper Draft",
        meta: "Через 5 дней",
      },
      {
        date: "30 МАЯ",
        title: "Management Case Study",
        meta: "Через 11 дней",
      },
    ],
    featuresSection: {
      eyebrow: "Функции",
      title: "Всё, что нужно для учёбы",
      description:
        "Один workspace для учебного планирования, AI-помощи, файлов, документов, заданий, экзаменов и прогресса.",
      learnMore: "Подробнее →",
    },
    features: [
      {
        title: "AI Tutor",
        description:
          "Понятные объяснения, примеры и помощь по учебным темам.",
        icon: "🤖",
      },
      {
        title: "Assignments",
        description:
          "Создавай, организуй и улучшай задания с помощью AI.",
        icon: "✅",
      },
      {
        title: "Documents",
        description:
          "Генерируй эссе, отчёты, summary и академические черновики.",
        icon: "📄",
      },
      {
        title: "Exam Prep",
        description:
          "Готовься через планы, flashcards, quiz и напоминания.",
        icon: "🎯",
      },
      {
        title: "Files",
        description:
          "Загружай, организуй, суммаризируй и используй материалы.",
        icon: "📁",
      },
      {
        title: "Diploma Assistant",
        description:
          "Планируй диплом, структуру глав и отслеживай прогресс.",
        icon: "🎓",
      },
    ],
    audience: {
      studentsTitle: "Создано для студентов",
      studentsText:
        "StudyAI помогает студентам организовывать учебные материалы, избегать хаоса перед дедлайнами, раньше готовиться к экзаменам и хранить AI-работу в одном месте.",
      teachersTitle: "Готово для университетских пилотов",
      teachersText:
        "Позже StudyAI сможет поддерживать университеты через официальные календари экзаменов, академические дедлайны, ответственное использование AI и подготовку студентов.",
    },
    pricingSection: {
      eyebrow: "Тарифы",
      title: "Простые планы для студентов и преподавателей",
      description:
        "Начни бесплатно и переходи на premium, когда нужно больше AI-возможностей и функций academic workspace.",
      mostPopular: "Популярный",
      perMonth: "/месяц",
      startFree: "Начать бесплатно",
      choosePlan: "Выбрать план",
    },
    pricingPlans: [
      {
        id: "free",
        name: "Free",
        price: "$0",
        description: "Подходит для старта",
        features: [
          "Базовый AI Tutor",
          "Ограниченная генерация документов",
          "Базовая помощь с заданиями",
          "Небольшое хранилище файлов",
        ],
        highlighted: false,
      },
      {
        id: "student",
        name: "Student Premium",
        price: "$9.99",
        description: "Для ежедневной учёбы",
        features: [
          "Advanced AI Tutor",
          "Document Generator",
          "Exam Prep tools",
          "Анализ файлов и сохранённая история",
        ],
        highlighted: true,
      },
      {
        id: "teacher",
        name: "Teacher Plan",
        price: "$19.99",
        description: "Для преподавателей и учебных команд",
        features: [
          "Больше лимитов",
          "Функции для классов позже",
          "Priority support",
          "Инструменты для вузов",
        ],
        highlighted: false,
      },
    ],
    footer: {
      text: "© 2026 StudyAI. Academic AI workspace для умной учёбы.",
    },
  },
  kz: {
    nav: {
      features: "Мүмкіндіктер",
      pricing: "Тарифтер",
      students: "Студенттерге",
      teachers: "Университеттерге",
      login: "Кіру",
      getStarted: "Бастау",
    },
    hero: {
      badge: "Сенің академиялық AI workspace",
      titleStart: "Ақылды оқы",
      titleAccent: "AI көмегімен",
      description:
        "StudyAI студенттерге тапсырмаларды басқаруға, құжаттар жасауға, емтиханға дайындалуға, файлдарды ұйымдастыруға және оқу прогресін бір workspace ішінде бақылауға көмектеседі.",
      primary: "Тегін бастау",
      secondary: "Workspace-ке кіру",
      trust1: "Студенттер үшін",
      trust2: "Оқу workflow",
      trust3: "AI құралдары",
    },
    dashboard: {
      label: "Dashboard",
      welcome: "Қайта қош келдің, Alex 👋",
      search: "Іздеу ⌘K",
      usage: "AI Usage",
      details: "Толығырақ",
      used: "қолданылды",
      credits: "3,120 / 4,000 кредит",
      recent: "Соңғы белсенділік",
      deadlines: "Жақын дедлайндар",
      viewAll: "Барлығын көру",
    },
    quickActions: [
      "AI Tutor-дан сұрау",
      "Жаңа тапсырма",
      "Құжат жасау",
      "Емтиханға дайындалу",
      "Файл жүктеу",
    ],
    activityItems: [
      {
        title: "Research Paper Draft",
        meta: "2 сағат бұрын өңделді",
      },
      {
        title: "Data Structures тапсырмасы",
        meta: "4 сағат бұрын жіберілді",
      },
      {
        title: "Термодинамика quiz",
        meta: "Кеше аяқталды",
      },
    ],
    deadlineItems: [
      {
        date: "21 МАМ",
        title: "Data Structures Assignment",
        meta: "2 күн қалды",
      },
      {
        date: "24 МАМ",
        title: "Research Paper Draft",
        meta: "5 күн қалды",
      },
      {
        date: "30 МАМ",
        title: "Management Case Study",
        meta: "11 күн қалды",
      },
    ],
    featuresSection: {
      eyebrow: "Мүмкіндіктер",
      title: "Оқуға қажет құралдардың бәрі",
      description:
        "Оқу жоспарлау, AI көмек, файлдар, құжаттар, тапсырмалар, емтихандар және прогресс үшін бір workspace.",
      learnMore: "Толығырақ →",
    },
    features: [
      {
        title: "AI Tutor",
        description:
          "Түсінікті түсіндірмелер, мысалдар және оқу көмегі.",
        icon: "🤖",
      },
      {
        title: "Assignments",
        description:
          "Тапсырмаларды AI көмегімен жаса, ретте және жақсарт.",
        icon: "✅",
      },
      {
        title: "Documents",
        description:
          "Эссе, есеп, summary және академиялық draft жаса.",
        icon: "📄",
      },
      {
        title: "Exam Prep",
        description:
          "Study plan, flashcards, quiz және еске салу арқылы дайындал.",
        icon: "🎯",
      },
      {
        title: "Files",
        description:
          "Материалдарды жүкте, ретте, қысқаша мазмұнда және қолдан.",
        icon: "📁",
      },
      {
        title: "Diploma Assistant",
        description:
          "Диплом жұмысын жоспарла, құрылымын жаса және прогресті бақыла.",
        icon: "🎓",
      },
    ],
    audience: {
      studentsTitle: "Студенттер үшін жасалған",
      studentsText:
        "StudyAI студенттерге оқу материалдарын реттеуге, дедлайн алдындағы хаосты азайтуға, емтиханға ертерек дайындалуға және AI жұмысын бір жерде сақтауға көмектеседі.",
      teachersTitle: "Университеттік пилоттарға дайын",
      teachersText:
        "Кейін StudyAI университеттерге ресми емтихан күнтізбелері, академиялық дедлайндар, responsible AI usage және студенттердің дайындық workflow арқылы көмектесе алады.",
    },
    pricingSection: {
      eyebrow: "Тарифтер",
      title: "Студенттер мен оқытушыларға арналған қарапайым жоспарлар",
      description:
        "Тегін баста және көбірек AI мүмкіндіктері керек болғанда premium-ға өт.",
      mostPopular: "Танымал",
      perMonth: "/ай",
      startFree: "Тегін бастау",
      choosePlan: "Планды таңдау",
    },
    pricingPlans: [
      {
        id: "free",
        name: "Free",
        price: "$0",
        description: "Бастауға ыңғайлы",
        features: [
          "Basic AI Tutor",
          "Шектеулі құжат генерациясы",
          "Basic assignment helper",
          "Шағын файл сақтау орны",
        ],
        highlighted: false,
      },
      {
        id: "student",
        name: "Student Premium",
        price: "$9.99",
        description: "Күнделікті оқу үшін",
        features: [
          "Advanced AI Tutor",
          "Document Generator",
          "Exam Prep tools",
          "Файл анализі және сақталған тарих",
        ],
        highlighted: true,
      },
      {
        id: "teacher",
        name: "Teacher Plan",
        price: "$19.99",
        description: "Оқытушылар мен оқу командалары үшін",
        features: [
          "Көбірек лимиттер",
          "Classroom features кейін",
          "Priority support",
          "Университетке дайын құралдар",
        ],
        highlighted: false,
      },
    ],
    footer: {
      text: "© 2026 StudyAI. Ақылды оқуға арналған academic AI workspace.",
    },
  },
};

function LanguageSwitcher({
  lang,
  setLang,
  compact = false,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const activeLanguage = languageOptions.find((item) => item.code === lang);
  const activeLabel = languageNames[lang][lang];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white font-semibold text-slate-700 shadow-sm shadow-slate-200/70 transition hover:border-blue-200 hover:text-blue-700 ${
          compact ? "h-10 px-3 text-xs" : "h-10 px-4 text-sm"
        }`}
        aria-label="Change language"
      >
        <span className="text-base">🌐</span>
        <span>{compact ? activeLanguage?.short : activeLabel}</span>
        <span className="text-[10px] text-slate-400">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/80">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {languageMenuTitle[lang]}
          </div>

          {languageOptions.map((option) => {
            const isActive = option.code === lang;

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  setLang(option.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  isActive
                    ? "bg-blue-50 font-bold text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">
                    {option.short}
                  </span>
                  <span>{languageNames[lang][option.code]}</span>
                </span>

                {isActive && <span className="text-blue-600">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = content[lang];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-600/30">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              Study<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a href="#features" className="transition hover:text-blue-600">
              {t.nav.features}
            </a>
            <a href="#pricing" className="transition hover:text-blue-600">
              {t.nav.pricing}
            </a>
            <a href="#students" className="transition hover:text-blue-600">
              {t.nav.students}
            </a>
            <a href="#teachers" className="transition hover:text-blue-600">
              {t.nav.teachers}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher lang={lang} setLang={setLang} />
            </div>

            <div className="block sm:hidden">
              <LanguageSwitcher lang={lang} setLang={setLang} compact />
            </div>

            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:inline-flex"
            >
              {t.nav.login}
            </Link>

            <Link
              href="/register"
              className="hidden items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 sm:inline-flex"
            >
              {t.nav.getStarted}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <span>✨</span>
              {t.hero.badge}
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {t.hero.titleStart}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t.hero.titleAccent}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {t.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                {t.hero.primary}
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
              >
                {t.hero.secondary}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              {[t.hero.trust1, t.hero.trust2, t.hero.trust3].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 sm:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {t.dashboard.label}
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      {t.dashboard.welcome}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:block">
                      {t.dashboard.search}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      AJ
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-5">
                  {t.quickActions.map((action) => (
                    <div
                      key={action}
                      className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
                    >
                      <div className="mb-3 h-8 w-8 rounded-xl bg-blue-50" />
                      <p className="text-xs font-bold text-slate-800">
                        {action}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr_1.1fr]">
                  <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">
                        {t.dashboard.usage}
                      </p>
                      <span className="text-xs font-semibold text-blue-600">
                        {t.dashboard.details}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-center">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-blue-100 bg-white">
                        <div className="text-center">
                          <p className="text-2xl font-black text-blue-600">
                            78%
                          </p>
                          <p className="text-xs text-slate-500">
                            {t.dashboard.used}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-center text-sm font-semibold text-slate-700">
                      {t.dashboard.credits}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-bold text-slate-900">
                        {t.dashboard.recent}
                      </p>
                      <span className="text-xs font-semibold text-blue-600">
                        {t.dashboard.viewAll}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {t.activityItems.map((item, index) => (
                        <div
                          key={item.title}
                          className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                              index === 0
                                ? "bg-blue-50 text-blue-700"
                                : index === 1
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            ✓
                          </span>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.meta}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-bold text-slate-900">
                        {t.dashboard.deadlines}
                      </p>
                      <span className="text-xs font-semibold text-blue-600">
                        {t.dashboard.viewAll}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {t.deadlineItems.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-center text-[10px] font-black leading-tight text-blue-700">
                            {item.date}
                          </span>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.meta}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              {t.featuresSection.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t.featuresSection.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t.featuresSection.description}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
                <p className="mt-5 text-sm font-bold text-blue-600">
                  {t.featuresSection.learnMore}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="students" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📚
            </div>
            <h2 className="text-2xl font-black text-slate-950">
              {t.audience.studentsTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {t.audience.studentsText}
            </p>
          </div>

          <div
            id="teachers"
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
              🏫
            </div>
            <h2 className="text-2xl font-black text-slate-950">
              {t.audience.teachersTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {t.audience.teachersText}
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              {t.pricingSection.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t.pricingSection.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t.pricingSection.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {t.pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-[2rem] border bg-white p-7 shadow-sm ${
                  plan.highlighted
                    ? "border-blue-300 shadow-xl shadow-blue-100/70"
                    : "border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    {t.pricingSection.mostPopular}
                  </div>
                )}

                <h3 className="text-xl font-black text-slate-950">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-black text-slate-950">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-sm font-semibold text-slate-500">
                    {t.pricingSection.perMonth}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-700">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={
                    plan.id === "free"
                      ? "/register"
                      : `/login?next=/payment?plan=${plan.id}`
                  }
                  className={`mt-7 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold transition ${
                    plan.highlighted
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
                      : "border border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {plan.id === "free"
                    ? t.pricingSection.startFree
                    : t.pricingSection.choosePlan}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.text}</p>

          <div className="flex gap-4">
            <a href="#features" className="hover:text-blue-600">
              {t.nav.features}
            </a>
            <a href="#pricing" className="hover:text-blue-600">
              {t.nav.pricing}
            </a>
            <Link href="/login" className="hover:text-blue-600">
              {t.nav.login}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}