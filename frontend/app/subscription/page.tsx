"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type BillingPeriod = "monthly" | "yearly";
type PlanKey = "free" | "pro" | "premium";

type Plan = {
  key: PlanKey;
  icon: string;
  monthlyPrice: string;
  yearlyPrice: string;
  credits: string;
  popular?: boolean;
};

type Copy = {
  pageBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  monthly: string;
  yearly: string;
  perMonth: string;
  perYear: string;
  mostPopular: string;
  currentPlan: string;
  upgradeTo: string;
  planComparison: string;
  planComparisonSubtitle: string;
  included: string;
  notIncluded: string;
  credits: string;
  aiTutor: string;
  documents: string;
  examPrep: string;
  files: string;
  priority: string;
  paymentNoteTitle: string;
  paymentNoteText: string;
  manageTitle: string;
  manageSubtitle: string;
  manageBilling: string;
  plans: Record<
    PlanKey,
    {
      name: string;
      description: string;
      features: string[];
    }
  >;
};

const copy: Record<Language, Copy> = {
  en: {
    pageBadge: "StudyAI Plans",
    heroTitle: "Upgrade your academic workspace",
    heroSubtitle:
      "Get more AI credits, advanced study tools, document generation, exam preparation, and file-powered learning features.",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "per month",
    perYear: "per year",
    mostPopular: "Most popular",
    currentPlan: "Current plan",
    upgradeTo: "Upgrade to",
    planComparison: "Plan comparison",
    planComparisonSubtitle:
      "Choose the plan that fits your current study workflow.",
    included: "Included",
    notIncluded: "Not included",
    credits: "AI credits",
    aiTutor: "AI Tutor",
    documents: "Documents",
    examPrep: "Exam Prep",
    files: "Files",
    priority: "Priority features",
    paymentNoteTitle: "Secure payment preview",
    paymentNoteText:
      "Payment integration will be connected later through backend/API. For now, this is a frontend subscription preview.",
    manageTitle: "Manage your plan",
    manageSubtitle:
      "View billing options, compare plans, and upgrade when you need more AI credits.",
    manageBilling: "Go to payment",
    plans: {
      free: {
        name: "Free",
        description: "For trying StudyAI and using basic academic tools.",
        features: [
          "Basic AI Tutor access",
          "Limited document drafts",
          "Basic assignment helper",
          "Manual file organization",
          "Light and dark theme",
        ],
      },
      pro: {
        name: "Pro",
        description: "For active students who use StudyAI every week.",
        features: [
          "Full AI Tutor conversations",
          "More document generations",
          "Advanced assignment feedback",
          "Exam prep plans and quizzes",
          "File-based study support",
          "Priority workspace features",
        ],
      },
      premium: {
        name: "Premium",
        description: "For heavy academic work, thesis writing, and exam periods.",
        features: [
          "Maximum AI Tutor usage",
          "Longer document generation",
          "Diploma assistant support",
          "Advanced exam preparation",
          "Large file workspace",
          "Future premium AI tools",
        ],
      },
    },
  },
  ru: {
    pageBadge: "StudyAI Plans",
    heroTitle: "Улучши свой учебный workspace",
    heroSubtitle:
      "Получай больше AI-кредитов, продвинутые учебные инструменты, генерацию документов, подготовку к экзаменам и обучение на основе файлов.",
    monthly: "Ежемесячно",
    yearly: "Ежегодно",
    perMonth: "в месяц",
    perYear: "в год",
    mostPopular: "Популярный",
    currentPlan: "Текущий план",
    upgradeTo: "Перейти на",
    planComparison: "Сравнение планов",
    planComparisonSubtitle:
      "Выбери план, который подходит твоему учебному workflow.",
    included: "Есть",
    notIncluded: "Нет",
    credits: "AI-кредиты",
    aiTutor: "AI Tutor",
    documents: "Документы",
    examPrep: "Экзамены",
    files: "Файлы",
    priority: "Приоритетные функции",
    paymentNoteTitle: "Безопасная оплата",
    paymentNoteText:
      "Интеграция оплаты будет подключена позже через backend/API. Сейчас это frontend-preview подписки.",
    manageTitle: "Управление планом",
    manageSubtitle:
      "Смотри варианты оплаты, сравнивай планы и улучшай подписку, когда нужно больше AI-кредитов.",
    manageBilling: "Перейти к оплате",
    plans: {
      free: {
        name: "Free",
        description: "Для знакомства со StudyAI и базовых учебных инструментов.",
        features: [
          "Базовый доступ к AI Tutor",
          "Ограниченные черновики документов",
          "Базовая помощь с заданиями",
          "Ручная организация файлов",
          "Светлая и тёмная тема",
        ],
      },
      pro: {
        name: "Pro",
        description: "Для активных студентов, которые используют StudyAI каждую неделю.",
        features: [
          "Полные диалоги с AI Tutor",
          "Больше генераций документов",
          "Продвинутая обратная связь по заданиям",
          "Планы подготовки и тесты к экзаменам",
          "Учёба на основе загруженных файлов",
          "Приоритетные функции workspace",
        ],
      },
      premium: {
        name: "Premium",
        description:
          "Для интенсивной учёбы, дипломной работы и периода экзаменов.",
        features: [
          "Максимальное использование AI Tutor",
          "Длинная генерация документов",
          "Поддержка дипломного ассистента",
          "Продвинутая подготовка к экзаменам",
          "Большое файловое пространство",
          "Будущие premium AI-инструменты",
        ],
      },
    },
  },
  kz: {
    pageBadge: "StudyAI Plans",
    heroTitle: "Оқу workspace деңгейін көтеріңіз",
    heroSubtitle:
      "Көбірек AI-кредиттер, кеңейтілген оқу құралдары, құжат генерациясы, емтиханға дайындық және файлдарға негізделген оқу мүмкіндіктерін алыңыз.",
    monthly: "Ай сайын",
    yearly: "Жыл сайын",
    perMonth: "айына",
    perYear: "жылына",
    mostPopular: "Ең танымал",
    currentPlan: "Ағымдағы жоспар",
    upgradeTo: "Көшу:",
    planComparison: "Жоспарларды салыстыру",
    planComparisonSubtitle:
      "Оқу workflow үшін ыңғайлы жоспарды таңдаңыз.",
    included: "Бар",
    notIncluded: "Жоқ",
    credits: "AI-кредиттер",
    aiTutor: "AI Tutor",
    documents: "Құжаттар",
    examPrep: "Емтихандар",
    files: "Файлдар",
    priority: "Приоритет функциялар",
    paymentNoteTitle: "Қауіпсіз төлем preview",
    paymentNoteText:
      "Төлем интеграциясы кейін backend/API арқылы қосылады. Қазір бұл subscription frontend-preview.",
    manageTitle: "Жоспарды басқару",
    manageSubtitle:
      "Төлем нұсқаларын қарап, жоспарларды салыстырып, көбірек AI-кредит қажет болғанда жаңартыңыз.",
    manageBilling: "Төлемге өту",
    plans: {
      free: {
        name: "Free",
        description:
          "StudyAI-ды сынап көру және базалық оқу құралдарын қолдану үшін.",
        features: [
          "AI Tutor базалық қолжетімділігі",
          "Шектеулі құжат черновиктері",
          "Тапсырмаларға базалық көмек",
          "Файлдарды қолмен ұйымдастыру",
          "Жарық және қараңғы тема",
        ],
      },
      pro: {
        name: "Pro",
        description:
          "StudyAI-ды әр апта қолданатын белсенді студенттер үшін.",
        features: [
          "AI Tutor толық диалогтары",
          "Көбірек құжат генерациясы",
          "Тапсырмаларға кеңейтілген feedback",
          "Емтихан жоспарлары және тесттер",
          "Файлдарға негізделген оқу",
          "Workspace приоритет функциялары",
        ],
      },
      premium: {
        name: "Premium",
        description:
          "Интенсивті оқу, диплом жұмысы және емтихан кезеңдері үшін.",
        features: [
          "AI Tutor максималды қолдану",
          "Ұзақ құжат генерациясы",
          "Диплом ассистенті",
          "Кеңейтілген емтихан дайындығы",
          "Үлкен файл workspace",
          "Болашақ premium AI құралдары",
        ],
      },
    },
  },
};

const plans: Plan[] = [
  {
    key: "free",
    icon: "🌱",
    monthlyPrice: "€0",
    yearlyPrice: "€0",
    credits: "100",
  },
  {
    key: "pro",
    icon: "⚡",
    monthlyPrice: "$7.99",
    yearlyPrice: "€76.70",
    credits: "4,000",
    popular: true,
  },
  {
    key: "premium",
    icon: "🚀",
    monthlyPrice: "€14.99",
    yearlyPrice: "€143.90",
    credits: "10,000",
  },
];

const comparisonRows = [
  {
    key: "credits",
    free: "100",
    pro: "4,000",
    premium: "10,000",
  },
  {
    key: "aiTutor",
    free: true,
    pro: true,
    premium: true,
  },
  {
    key: "documents",
    free: false,
    pro: true,
    premium: true,
  },
  {
    key: "examPrep",
    free: false,
    pro: true,
    premium: true,
  },
  {
    key: "files",
    free: false,
    pro: true,
    premium: true,
  },
  {
    key: "priority",
    free: false,
    pro: true,
    premium: true,
  },
] as const;

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

function getComparisonLabel(key: string, t: Copy) {
  if (key === "credits") return t.credits;
  if (key === "aiTutor") return t.aiTutor;
  if (key === "documents") return t.documents;
  if (key === "examPrep") return t.examPrep;
  if (key === "files") return t.files;
  return t.priority;
}

function renderComparisonValue(value: boolean | string, t: Copy) {
  if (typeof value === "string") {
    return value;
  }

  return value ? t.included : t.notIncluded;
}

function SubscriptionContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

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

  const planCards = useMemo(() => plans, []);

  return (
    <div className={pageClass}>
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6">
        <section
          className={`overflow-hidden rounded-[2rem] border p-5 sm:p-6 lg:p-8 ${cardClass}`}
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${
                  isDark
                    ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                    : "border-blue-100 bg-blue-50 text-blue-700"
                }`}
              >
                💳 {t.pageBadge}
              </div>

              <h1
                className={`max-w-4xl text-3xl font-black tracking-tight sm:text-4xl ${titleClass}`}
              >
                {t.heroTitle}
              </h1>

              <p
                className={`mt-4 max-w-4xl text-sm leading-7 sm:text-base ${textClass}`}
              >
                {t.heroSubtitle}
              </p>
            </div>

            <div
              className={`inline-flex w-fit rounded-3xl border p-1 ${
                isDark
                  ? "border-white/10 bg-slate-950/70"
                  : "border-slate-200 bg-slate-100"
              }`}
            >
              {(["monthly", "yearly"] as BillingPeriod[]).map((period) => {
                const active = billingPeriod === period;

                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setBillingPeriod(period)}
                    className={`h-12 rounded-2xl px-5 text-sm font-black transition ${
                      active
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                        : isDark
                          ? "text-slate-300 hover:bg-white/10"
                          : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {period === "monthly" ? t.monthly : t.yearly}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {planCards.map((plan) => {
            const planCopy = t.plans[plan.key];
            const price =
              billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const periodLabel =
              billingPeriod === "monthly" ? t.perMonth : t.perYear;
            const isCurrentPlan = plan.key === "free";

            return (
              <article
                key={plan.key}
                className={`relative overflow-hidden rounded-[2rem] border p-5 sm:p-6 ${
                  plan.popular
                    ? isDark
                      ? "border-blue-400/60 bg-slate-900/70 shadow-sm shadow-blue-600/10"
                      : "border-blue-300 bg-white shadow-sm shadow-blue-200"
                    : cardClass
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-5 top-5 rounded-full bg-blue-600 px-4 py-1 text-xs font-black text-white">
                    {t.mostPopular}
                  </span>
                )}

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-2xl">
                  {plan.icon}
                </div>

                <h2 className={`mt-6 text-2xl font-black ${titleClass}`}>
                  {planCopy.name}
                </h2>

                <p className={`mt-3 min-h-14 text-sm leading-6 ${textClass}`}>
                  {planCopy.description}
                </p>

                <div className="mt-7">
                  <span className={`text-4xl font-black ${titleClass}`}>
                    {price}
                  </span>

                  <span className={`ml-2 text-sm font-bold ${mutedClass}`}>
                    {periodLabel}
                  </span>
                </div>

                <p className="mt-2 text-sm font-black text-blue-500">
                  {plan.credits} {t.credits}
                </p>

                <Link
                  href={
                    isCurrentPlan
                      ? "/dashboard"
                      : `/payment?plan=${plan.key}&billing=${billingPeriod}`
                  }
                  className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl border px-5 text-sm font-black transition ${
                    isCurrentPlan
                      ? isDark
                        ? "border-white/10 bg-slate-950/60 text-slate-100 hover:bg-white/10"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      : "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700"
                  }`}
                >
                  {isCurrentPlan
                    ? t.currentPlan
                    : `${t.upgradeTo} ${planCopy.name}`}
                </Link>

                <div className="mt-6 grid gap-3">
                  {planCopy.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-black text-emerald-500">
                        ✓
                      </span>

                      <p className={`text-sm leading-6 ${textClass}`}>
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>
              {t.planComparison}
            </h2>

            <p className={`mt-2 text-sm leading-6 ${textClass}`}>
              {t.planComparisonSubtitle}
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    <th className={`px-4 py-2 text-left text-sm ${mutedClass}`}>
                      Feature
                    </th>
                    <th className={`px-4 py-2 text-left text-sm ${mutedClass}`}>
                      Free
                    </th>
                    <th className={`px-4 py-2 text-left text-sm ${mutedClass}`}>
                      Pro
                    </th>
                    <th className={`px-4 py-2 text-left text-sm ${mutedClass}`}>
                      Premium
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.key}>
                      <td
                        className={`rounded-l-2xl border-y border-l px-4 py-4 text-sm font-black ${
                          isDark
                            ? "border-white/10 bg-slate-950/50 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-950"
                        }`}
                      >
                        {getComparisonLabel(row.key, t)}
                      </td>

                      <td
                        className={`border-y px-4 py-4 text-sm font-bold ${
                          isDark
                            ? "border-white/10 bg-slate-950/50 text-slate-300"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {renderComparisonValue(row.free, t)}
                      </td>

                      <td
                        className={`border-y px-4 py-4 text-sm font-bold ${
                          isDark
                            ? "border-white/10 bg-slate-950/50 text-slate-300"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {renderComparisonValue(row.pro, t)}
                      </td>

                      <td
                        className={`rounded-r-2xl border-y border-r px-4 py-4 text-sm font-bold ${
                          isDark
                            ? "border-white/10 bg-slate-950/50 text-slate-300"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {renderComparisonValue(row.premium, t)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="grid gap-6">
            <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-2xl">
                🔐
              </div>

              <h2 className={`mt-5 text-xl font-black ${titleClass}`}>
                {t.paymentNoteTitle}
              </h2>

              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.paymentNoteText}
              </p>
            </section>

            <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-sm shadow-blue-600/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                ⚡
              </div>

              <h2 className="mt-5 text-xl font-black">{t.manageTitle}</h2>

              <p className="mt-2 text-sm font-medium leading-6 text-blue-100">
                {t.manageSubtitle}
              </p>

              <Link
                href="/payment"
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-black text-blue-700 transition hover:bg-blue-50"
              >
                {t.manageBilling}
              </Link>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <AppShell>
      <SubscriptionContent />
    </AppShell>
  );
}