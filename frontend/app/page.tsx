"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

const pageText = {
  en: {
    features: "Features",
    pricing: "Pricing",
    about: "About",
    login: "Login",
    getStarted: "Get Started",
    badge: "AI-powered learning platform",
    title: "Study smarter with your personal AI learning assistant.",
    subtitle:
      "StudyAI helps students ask questions, organize assignments, prepare for exams, and manage academic work in one clean workspace.",
    dashboardTitle: "StudyAI Dashboard",
    welcomeBack: "Welcome back",
    freePlan: "Free Plan",
    mainFeatures: "Main features",
    mainFeaturesSubtitle:
      "Everything needed for a simple student learning workspace.",
    pricingTitle: "Pricing",
    pricingSubtitle:
      "Choose a plan. You will need to login or create an account before payment.",
    aboutTitle: "Built for students and teachers",
    aboutText:
      "StudyAI is designed as a clean academic platform where users can manage learning tools, ask AI questions, and track their study activity from one dashboard.",
    createAccount: "Create Account",
    alreadyHaveAccount: "I already have an account",
    allRights: "All rights reserved.",
    register: "Register",
    dashboard: "Dashboard",
    choosePlan: "Choose Plan",
    month: "month",
    loginToContinue: "Login to continue",
    featuresList: [
      {
        title: "AI Tutor",
        description:
          "Ask questions and get clear explanations for difficult topics.",
      },
      {
        title: "Assignments",
        description:
          "Organize homework tasks, deadlines, and study progress.",
      },
      {
        title: "Exam Prep",
        description: "Prepare for exams with structured study tools.",
      },
      {
        title: "Documents",
        description: "Create summaries, notes, and learning materials.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Free",
        price: "$0",
        description: "Basic access for testing StudyAI.",
        features: ["Limited AI requests", "Basic dashboard", "AI Tutor access"],
      },
      {
        id: "student",
        name: "Student",
        price: "$9",
        description: "For students who need daily study support.",
        features: ["More AI requests", "Study tools", "Saved chat history"],
      },
      {
        id: "teacher",
        name: "Teacher",
        price: "$19",
        description: "For teachers and academic workflow support.",
        features: ["Higher limits", "Classroom tools", "Document support"],
      },
    ],
  },

  ru: {
    features: "Функции",
    pricing: "Цены",
    about: "О нас",
    login: "Войти",
    getStarted: "Начать",
    badge: "AI-платформа для обучения",
    title: "Учитесь умнее с персональным AI помощником.",
    subtitle:
      "StudyAI помогает студентам задавать вопросы, организовывать задания, готовиться к экзаменам и управлять учебной работой в одном удобном пространстве.",
    dashboardTitle: "Панель StudyAI",
    welcomeBack: "С возвращением",
    freePlan: "Бесплатный план",
    mainFeatures: "Основные функции",
    mainFeaturesSubtitle:
      "Всё необходимое для простого учебного пространства студента.",
    pricingTitle: "Цены",
    pricingSubtitle:
      "Выберите план. Для оплаты нужно будет войти или создать аккаунт.",
    aboutTitle: "Создано для студентов и преподавателей",
    aboutText:
      "StudyAI разработан как удобная академическая платформа, где пользователи могут управлять учебными инструментами, задавать вопросы AI и отслеживать свою активность из одной панели.",
    createAccount: "Создать аккаунт",
    alreadyHaveAccount: "У меня уже есть аккаунт",
    allRights: "Все права защищены.",
    register: "Регистрация",
    dashboard: "Панель",
    choosePlan: "Выбрать план",
    month: "месяц",
    loginToContinue: "Войти для продолжения",
    featuresList: [
      {
        title: "AI Репетитор",
        description:
          "Задавайте вопросы и получайте понятные объяснения сложных тем.",
      },
      {
        title: "Задания",
        description:
          "Организуйте домашние задания, дедлайны и учебный прогресс.",
      },
      {
        title: "Подготовка",
        description:
          "Готовьтесь к экзаменам с помощью структурированных инструментов.",
      },
      {
        title: "Документы",
        description: "Создавайте конспекты, заметки и учебные материалы.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Бесплатный",
        price: "$0",
        description: "Базовый доступ для тестирования StudyAI.",
        features: [
          "Ограниченные AI запросы",
          "Базовая панель",
          "Доступ к AI Репетитору",
        ],
      },
      {
        id: "student",
        name: "Студент",
        price: "$9",
        description: "Для студентов, которым нужна ежедневная учебная помощь.",
        features: [
          "Больше AI запросов",
          "Учебные инструменты",
          "История чатов",
        ],
      },
      {
        id: "teacher",
        name: "Преподаватель",
        price: "$19",
        description: "Для преподавателей и академической работы.",
        features: [
          "Повышенные лимиты",
          "Инструменты для классов",
          "Поддержка документов",
        ],
      },
    ],
  },

  kz: {
    features: "Мүмкіндіктер",
    pricing: "Бағалар",
    about: "Біз туралы",
    login: "Кіру",
    getStarted: "Бастау",
    badge: "AI негізіндегі оқу платформасы",
    title: "Жеке AI көмекшіңізбен ақылдырақ оқыңыз.",
    subtitle:
      "StudyAI студенттерге сұрақ қоюға, тапсырмаларды ұйымдастыруға, емтиханға дайындалуға және оқу жұмысын бір ыңғайлы кеңістікте басқаруға көмектеседі.",
    dashboardTitle: "StudyAI панелі",
    welcomeBack: "Қайта қош келдіңіз",
    freePlan: "Тегін жоспар",
    mainFeatures: "Негізгі мүмкіндіктер",
    mainFeaturesSubtitle:
      "Студенттің қарапайым оқу кеңістігіне қажет барлық құралдар.",
    pricingTitle: "Бағалар",
    pricingSubtitle:
      "Жоспарды таңдаңыз. Төлем жасау үшін кіру немесе тіркелу қажет.",
    aboutTitle: "Студенттер мен мұғалімдер үшін жасалған",
    aboutText:
      "StudyAI — пайдаланушылар оқу құралдарын басқарып, AI-ға сұрақ қойып, оқу белсенділігін бір панельден бақылай алатын ыңғайлы академиялық платформа.",
    createAccount: "Аккаунт жасау",
    alreadyHaveAccount: "Менде аккаунт бар",
    allRights: "Барлық құқықтар қорғалған.",
    register: "Тіркелу",
    dashboard: "Панель",
    choosePlan: "Жоспар таңдау",
    month: "ай",
    loginToContinue: "Жалғастыру үшін кіру",
    featuresList: [
      {
        title: "AI Мұғалім",
        description:
          "Сұрақ қойып, қиын тақырыптарға түсінікті жауап алыңыз.",
      },
      {
        title: "Тапсырмалар",
        description:
          "Үй тапсырмаларын, мерзімдерді және оқу прогресін ұйымдастырыңыз.",
      },
      {
        title: "Емтиханға дайындық",
        description:
          "Құрылымды оқу құралдарымен емтиханға дайындалыңыз.",
      },
      {
        title: "Құжаттар",
        description: "Конспект, жазба және оқу материалдарын жасаңыз.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Тегін",
        price: "$0",
        description: "StudyAI тестілеуге арналған базалық қолжетімділік.",
        features: [
          "Шектеулі AI сұраныстар",
          "Базалық панель",
          "AI Мұғалімге қолжетімділік",
        ],
      },
      {
        id: "student",
        name: "Студент",
        price: "$9",
        description: "Күнделікті оқу көмегі қажет студенттерге арналған.",
        features: [
          "Көбірек AI сұраныстар",
          "Оқу құралдары",
          "Сақталған чат тарихы",
        ],
      },
      {
        id: "teacher",
        name: "Мұғалім",
        price: "$19",
        description: "Мұғалімдер мен академиялық жұмысқа арналған.",
        features: [
          "Жоғары лимиттер",
          "Сынып құралдары",
          "Құжат қолдауы",
        ],
      },
    ],
  },
};

export default function HomePage() {
  const { language } = useLanguage();
  const text = pageText[language];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1680px] items-center justify-between px-4 sm:px-6 lg:px-10 2xl:px-12">
          <Link href="/" className="text-xl font-bold text-slate-900">
            StudyAI
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-blue-600">
              {text.features}
            </a>
            <a href="#pricing" className="hover:text-blue-600">
              {text.pricing}
            </a>
            <a href="#about" className="hover:text-blue-600">
              {text.about}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {text.login}
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {text.getStarted}
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 sm:hidden">
          <div className="mx-auto w-fit">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1680px] grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-10 2xl:px-12">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            {text.badge}
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {text.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {text.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {text.getStarted}
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {text.login}
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {text.dashboardTitle}
                </p>
                <h2 className="mt-1 text-xl font-bold">{text.welcomeBack}</h2>
              </div>

              <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                {text.freePlan}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {text.featuresList.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                    {feature.title[0]}
                  </div>

                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto w-full max-w-[1680px] px-4 py-14 sm:px-6 lg:px-10 2xl:px-12"
      >
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold">{text.mainFeatures}</h2>
          <p className="mt-3 text-slate-600">{text.mainFeaturesSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {text.featuresList.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600">
                {feature.title[0]}
              </div>

              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        className="mx-auto w-full max-w-[1680px] px-4 py-14 sm:px-6 lg:px-10 2xl:px-12"
      >
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold">{text.pricingTitle}</h2>
          <p className="mt-3 text-slate-600">{text.pricingSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {text.plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-500">
                  / {text.month}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {plan.features.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>

              <Link
                href={`/login?next=/payment?plan=${plan.id}`}
                className="mt-8 block rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {text.loginToContinue}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto w-full max-w-[1680px] px-4 py-14 sm:px-6 lg:px-10 2xl:px-12"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <h2 className="text-3xl font-bold">{text.aboutTitle}</h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {text.aboutText}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {text.createAccount}
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {text.alreadyHaveAccount}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10 2xl:px-12">
          <p>© 2026 StudyAI. {text.allRights}</p>

          <div className="flex gap-5">
            <Link href="/login" className="hover:text-blue-600">
              {text.login}
            </Link>
            <Link href="/register" className="hover:text-blue-600">
              {text.register}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}