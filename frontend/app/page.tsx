"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatUsdPriceWithPeriod } from "@/lib/pricing";
import {
  applyTheme,
  getCurrentTheme,
  saveTheme,
  themeStorageKeys,
} from "@/lib/theme";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";

type PricePlan = {
  key: "free" | "pro" | "premium";
  name: string;
  price: string;
  yearly?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

type LandingCopy = {
  nav: {
    features: string;
    how: string;
    students: string;
    universities: string;
    pricing: string;
    faq: string;
    light: string;
    dark: string;
    login: string;
    start: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    start: string;
    login: string;
    demo: string;
    pills: string[];
  };
  visual: {
    dashboard: string;
    workspace: string;
    streak: string;
    streakValue: string;
    due: string;
    assignment: string;
    assignmentMeta: string;
    assignmentPriority: string;
    tutor: string;
    tutorMessage: string;
    tutorAnswer: string;
    document: string;
    documentMeta: string;
    diploma: string;
  };
  problem: {
    title: string;
    text: string;
    items: string[];
  };
  solution: {
    title: string;
    text: string;
    cards: { title: string; text: string }[];
  };
  features: {
    title: string;
    text: string;
    cards: { title: string; text: string }[];
  };
  how: {
    title: string;
    steps: { title: string; text: string }[];
  };
  students: {
    title: string;
    text: string;
    bullets: string[];
  };
  universities: {
    title: string;
    text: string;
    bullets: string[];
  };
  pricing: {
    title: string;
    text: string;
    note: string;
    popular: string;
    start: string;
    plans: string;
    pricePlans: PricePlan[];
  };
  demoFlow: {
    title: string;
    text: string;
    steps: string[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  final: {
    title: string;
    text: string;
  };
  footer: {
    status: string;
    product: string;
    legal: string;
    privacy: string;
    terms: string;
  };
};

const languageKeys = ["studyai-language", "studyai_lang", "language", "locale"];

const languageLabels: Record<Language, string> = {
  en: "EN",
  ru: "RU",
  kz: "KZ",
};

const featureIcons = ["🤖", "📝", "📁", "📄", "🎯", "🎓", "📈", "💳"];
const solutionIcons = ["📅", "🧠", "📁", "🔥"];
const landingPricing = {
  en: {
    free: formatUsdPriceWithPeriod("free", "monthly", "en"),
    proMonthly: formatUsdPriceWithPeriod("pro", "monthly", "en"),
    proYearly: formatUsdPriceWithPeriod("pro", "yearly", "en"),
    premiumMonthly: formatUsdPriceWithPeriod("premium", "monthly", "en"),
    premiumYearly: formatUsdPriceWithPeriod("premium", "yearly", "en"),
  },
  ru: {
    free: formatUsdPriceWithPeriod("free", "monthly", "ru"),
    proMonthly: formatUsdPriceWithPeriod("pro", "monthly", "ru"),
    proYearly: formatUsdPriceWithPeriod("pro", "yearly", "ru"),
    premiumMonthly: formatUsdPriceWithPeriod("premium", "monthly", "ru"),
    premiumYearly: formatUsdPriceWithPeriod("premium", "yearly", "ru"),
  },
  kz: {
    free: formatUsdPriceWithPeriod("free", "monthly", "kz"),
    proMonthly: formatUsdPriceWithPeriod("pro", "monthly", "kz"),
    proYearly: formatUsdPriceWithPeriod("pro", "yearly", "kz"),
    premiumMonthly: formatUsdPriceWithPeriod("premium", "monthly", "kz"),
    premiumYearly: formatUsdPriceWithPeriod("premium", "yearly", "kz"),
  },
};

const copy: Record<Language, LandingCopy> = {
  en: {
    nav: {
      features: "Features",
      how: "How it works",
      students: "For students",
      universities: "For universities",
      pricing: "Pricing",
      faq: "FAQ",
      light: "Light",
      dark: "Dark",
      login: "Log in",
      start: "Start free",
    },
    hero: {
      eyebrow: "Not just AI chat - an academic workspace for students",
      title: "StudyAI - your academic workspace powered by AI",
      subtitle:
        "Manage assignments, files, exam preparation, documents, diploma progress and AI tutoring in one focused student workspace.",
      start: "Start free",
      login: "Log in",
      demo: "View dashboard demo",
      pills: [
        "AI Tutor",
        "Assignments",
        "Exam Prep",
        "Diploma",
        "Files",
        "Local demo ready",
      ],
    },
    visual: {
      dashboard: "StudyAI Dashboard",
      workspace: "Academic workspace",
      streak: "Study streak",
      streakValue: "5 days",
      due: "Due this week",
      assignment: "Research methods assignment",
      assignmentMeta: "High priority - due Friday",
      assignmentPriority: "High",
      tutor: "AI Tutor",
      tutorMessage: "Break this topic into steps and give me one example.",
      tutorAnswer: "1. Define the concept. 2. Show the steps. 3. Practice with one example.",
      document: "Document draft",
      documentMeta: "Essay outline saved locally",
      diploma: "Diploma progress",
    },
    problem: {
      title: "Students lose time switching between too many tools.",
      text:
        "Academic work is usually scattered across chat apps, notes, drives, calendars and separate document drafts. The result is friction, missed deadlines and disconnected AI help.",
      items: [
        "Assignments live in one place while files live somewhere else.",
        "AI chats are disconnected from tasks, documents and deadlines.",
        "Exam preparation is often unstructured until the last week.",
        "Diploma progress is hard to track across chapters and notes.",
      ],
    },
    solution: {
      title: "StudyAI brings academic work into one workspace.",
      text:
        "The MVP combines the core modules students already need: planning, AI study help, document drafting, file organization and progress tracking.",
      cards: [
        {
          title: "Plan your work",
          text: "Create assignments, set priorities and keep upcoming deadlines visible.",
        },
        {
          title: "Get AI study help",
          text: "Ask for explanations, retry prompts and use local fallback when backend is unavailable.",
        },
        {
          title: "Organize files and documents",
          text: "Keep academic materials, outlines, reports and drafts in one student workspace.",
        },
        {
          title: "Track progress",
          text: "Use onboarding, streaks, due-this-week cards and diploma progress to stay oriented.",
        },
      ],
    },
    features: {
      title: "A complete academic workspace, not a single chat box.",
      text:
        "StudyAI connects student workflows that are normally split across different products.",
      cards: [
        {
          title: "AI Tutor",
          text: "Ask study questions, retry failed prompts and get a local preview response if backend is unavailable.",
        },
        {
          title: "Assignments",
          text: "Create, track and manage coursework with detail pages, status, priority and deadlines.",
        },
        {
          title: "Files",
          text: "Upload metadata, organize academic materials and prepare for file analysis.",
        },
        {
          title: "Documents",
          text: "Create essays, reports, outlines, summaries and academic drafts.",
        },
        {
          title: "Exam Prep",
          text: "Build study plans with difficulty, topics and daily study time.",
        },
        {
          title: "Diploma",
          text: "Track thesis chapters, milestones, notes and progress.",
        },
        {
          title: "Dashboard",
          text: "See onboarding, streak, progress, due this week and overdue work.",
        },
        {
          title: "Subscription Preview",
          text: "Preview Free, Pro and Premium plans before real payment integration is connected.",
        },
      ],
    },
    how: {
      title: "How it works",
      steps: [
        {
          title: "Create your student profile",
          text: "Register, add your name and set up university, program and study goal.",
        },
        {
          title: "Add assignments, files or study goals",
          text: "Start with the work you already need to complete this week.",
        },
        {
          title: "Use AI tools to prepare faster",
          text: "Ask questions, create drafts, organize exam plans and structure diploma chapters.",
        },
        {
          title: "Track deadlines and progress",
          text: "Use the dashboard to see streaks, deadlines and academic activity at a glance.",
        },
      ],
    },
    students: {
      title: "Built for students who want less chaos.",
      text:
        "StudyAI helps students keep academic life in one place, especially during busy weeks with coursework, exams and thesis planning.",
      bullets: [
        "Less switching between separate tools.",
        "Faster preparation for exams and assignments.",
        "Better deadline tracking and progress visibility.",
        "One workspace for academic life, not just isolated AI answers.",
      ],
    },
    universities: {
      title: "Prepared for university pilots.",
      text:
        "StudyAI can be extended into an academic support platform for universities after backend integration, policies and production controls are finalized.",
      bullets: [
        "Structured AI support for students.",
        "Potential corporate access model for universities.",
        "Pilot program possible with approved backend and data policies.",
        "Analytics and usage reporting can be added later by backend.",
      ],
    },
    pricing: {
      title: "Simple pricing preview",
      text:
        "The current MVP uses payment preview only. Real checkout and billing will be connected later.",
      note: "Payments are currently preview-only and will be connected later.",
      popular: "Popular",
      start: "Start free",
      plans: "View plans",
      pricePlans: [
        {
          key: "free",
          name: "Free",
          price: landingPricing.en.free,
          description: "For trying StudyAI basics.",
          features: ["AI Tutor preview", "Assignments", "Dashboard", "Local fallback"],
        },
        {
          key: "pro",
          name: "Pro",
          price: landingPricing.en.proMonthly,
          yearly: landingPricing.en.proYearly,
          description: "For active students.",
          features: ["More AI workflow", "Documents", "Exam Prep", "Files workspace"],
          highlighted: true,
        },
        {
          key: "premium",
          name: "Premium",
          price: landingPricing.en.premiumMonthly,
          yearly: landingPricing.en.premiumYearly,
          description: "For advanced study workflow.",
          features: ["Diploma planning", "Priority preview", "Larger workflow", "Future premium tools"],
        },
      ],
    },
    demoFlow: {
      title: "A simple demo path",
      text: "StudyAI is ready to show a realistic frontend MVP flow.",
      steps: [
        "Register",
        "Create assignment",
        "Upload file",
        "Generate study plan",
        "Track progress",
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          question: "Is StudyAI just another AI chat?",
          answer:
            "No. AI Tutor is one module, but StudyAI also includes assignments, files, documents, exam prep, diploma planning and dashboard progress.",
        },
        {
          question: "Can I use it without backend?",
          answer:
            "The current MVP supports local/demo fallback for many frontend workflows, so the demo remains usable when backend is unavailable.",
        },
        {
          question: "Is payment active?",
          answer:
            "No. Subscription and payment pages are preview-only. Real payment provider integration will be connected later.",
        },
        {
          question: "Is my data synced across devices?",
          answer:
            "Cross-device sync requires backend profile, database and storage integration. Local demo data stays in this browser.",
        },
        {
          question: "Who is StudyAI for?",
          answer:
            "It is for students today and can be extended for university pilots after backend and policy work.",
        },
      ],
    },
    final: {
      title: "Start organizing your academic life with StudyAI.",
      text: "Create your workspace, add your first task and see how AI can support real student work.",
    },
    footer: {
      status: "Current status: MVP demo",
      product: "Product",
      legal: "Legal placeholders",
      privacy: "Privacy placeholder",
      terms: "Terms placeholder",
    },
  },
  ru: {
    nav: {
      features: "Функции",
      how: "Как работает",
      students: "Студентам",
      universities: "Университетам",
      pricing: "Цены",
      faq: "Вопросы",
      light: "Светлая",
      dark: "Темная",
      login: "Войти",
      start: "Начать бесплатно",
    },
    hero: {
      eyebrow: "Не просто AI-чат - учебное пространство для студентов",
      title: "StudyAI - твое академическое пространство с AI",
      subtitle:
        "Управляй заданиями, файлами, подготовкой к экзаменам, документами, дипломом и AI-наставником в одном учебном пространстве.",
      start: "Начать бесплатно",
      login: "Войти",
      demo: "Открыть демонстрационную панель",
      pills: ["AI-наставник", "Задания", "Экзамены", "Диплом", "Файлы", "Локальная демоверсия"],
    },
    visual: {
      dashboard: "Панель StudyAI",
      workspace: "Учебное пространство",
      streak: "Учебная серия",
      streakValue: "5 дней",
      due: "Дедлайны недели",
      assignment: "Задание по методам исследования",
      assignmentMeta: "Высокий приоритет - до пятницы",
      assignmentPriority: "Высокий",
      tutor: "AI-наставник",
      tutorMessage: "Разбей тему на шаги и дай один пример.",
      tutorAnswer: "1. Дай определение. 2. Покажи шаги. 3. Закрепи одним примером.",
      document: "Черновик документа",
      documentMeta: "План эссе сохранен локально",
      diploma: "Прогресс диплома",
    },
    problem: {
      title: "Студенты теряют время, переключаясь между слишком многими инструментами.",
      text:
        "Учебная работа часто разбросана между чатами, заметками, облачными папками, календарями и отдельными документами. Из-за этого AI-помощь отрывается от реальных задач.",
      items: [
        "Задания в одном месте, а файлы в другом.",
        "AI-чаты не связаны с задачами, документами и дедлайнами.",
        "Подготовка к экзаменам часто становится хаотичной.",
        "Прогресс по диплому сложно отслеживать по главам и заметкам.",
      ],
    },
    solution: {
      title: "StudyAI собирает учебную работу в одно пространство.",
      text:
        "MVP объединяет ключевые модули: планирование, AI-помощь, документы, файлы и прогресс.",
      cards: [
        {
          title: "Планируй работу",
          text: "Создавай задания, ставь приоритеты и держи дедлайны перед глазами.",
        },
        {
          title: "Получай AI-помощь",
          text: "Задавай вопросы, повторяй запросы и используй локальный резервный режим.",
        },
        {
          title: "Организуй файлы и документы",
          text: "Храни учебные материалы, планы, отчеты и черновики в одном месте.",
        },
        {
          title: "Отслеживай прогресс",
          text: "Используй введение, учебную серию, карточки недели и прогресс диплома.",
        },
      ],
    },
    features: {
      title: "Полное учебное пространство, а не отдельный чат.",
      text: "StudyAI соединяет учебные сценарии, которые обычно живут в разных сервисах.",
      cards: [
        {
          title: "AI-наставник",
          text: "Вопросы по учебе, повтор запросов и локальный предварительный ответ, если сервер недоступен.",
        },
        {
          title: "Задания",
          text: "Курсовые и домашние задания со статусом, приоритетом и дедлайнами.",
        },
        {
          title: "Файлы",
          text: "Метаданные файлов, учебные материалы и подготовка к анализу.",
        },
        {
          title: "Документы",
          text: "Эссе, отчеты, планы, краткие выводы и академические черновики.",
        },
        {
          title: "Экзамены",
          text: "Учебные планы со сложностью, темами и временем в день.",
        },
        {
          title: "Диплом",
          text: "Главы, milestone, заметки и общий прогресс.",
        },
        {
          title: "Панель",
          text: "Введение, учебная серия, прогресс, дедлайны недели и просроченные задачи.",
        },
        {
          title: "Предпросмотр подписки",
          text: "Предпросмотр планов Бесплатный, Pro и Premium до подключения реальной оплаты.",
        },
      ],
    },
    how: {
      title: "Как это работает",
      steps: [
        {
          title: "Создай профиль студента",
          text: "Зарегистрируйся, добавь имя, университет, программу и учебную цель.",
        },
        {
          title: "Добавь задания, файлы или цели",
          text: "Начни с того, что реально нужно сделать на этой неделе.",
        },
        {
          title: "Используй AI-инструменты",
          text: "Задавай вопросы, создавай черновики, планы экзаменов и структуру диплома.",
        },
        {
          title: "Следи за дедлайнами",
          text: "Панель показывает учебную серию, дедлайны и активность.",
        },
      ],
    },
    students: {
      title: "Для студентов, которым нужно меньше хаоса.",
      text:
        "StudyAI помогает держать учебную жизнь в одном месте, особенно когда одновременно идут задания, экзамены и диплом.",
      bullets: [
        "Меньше переключения между разными сервисами.",
        "Быстрее подготовка к экзаменам и заданиям.",
        "Лучше видны дедлайны и прогресс.",
        "Одно учебное пространство для учебы, а не только отдельные AI-ответы.",
      ],
    },
    universities: {
      title: "Готово для университетских пилотных программ.",
      text:
        "StudyAI можно расширить до платформы академической поддержки после серверной интеграции, правил и производственных контролей.",
      bullets: [
        "Структурированная AI-поддержка студентов.",
        "Потенциальная корпоративная модель доступа.",
        "Пилот возможен после утверждения серверной части и правил работы с данными.",
        "Аналитика и отчеты об использовании могут быть добавлены позже серверной частью.",
      ],
    },
    pricing: {
      title: "Простой предпросмотр цен",
      text: "В текущем MVP оплата работает только как предпросмотр. Реальная касса будет подключена позже.",
      note: "Оплата сейчас доступна только как предпросмотр и будет подключена позже.",
      popular: "Популярно",
      start: "Начать бесплатно",
      plans: "Смотреть планы",
      pricePlans: [
        {
          key: "free",
          name: "Бесплатный",
          price: landingPricing.ru.free,
          description: "Чтобы попробовать базовые функции StudyAI.",
          features: ["Предпросмотр AI-наставника", "Задания", "Панель", "Локальный резервный режим"],
        },
        {
          key: "pro",
          name: "Pro",
          price: landingPricing.ru.proMonthly,
          yearly: landingPricing.ru.proYearly,
          description: "Для активных студентов.",
          features: ["Больше AI-сценариев", "Документы", "Экзамены", "Работа с файлами"],
          highlighted: true,
        },
        {
          key: "premium",
          name: "Premium",
          price: landingPricing.ru.premiumMonthly,
          yearly: landingPricing.ru.premiumYearly,
          description: "Для продвинутого учебного процесса.",
          features: ["Диплом", "Предпросмотр приоритетов", "Больше учебных сценариев", "Будущие премиум-инструменты"],
        },
      ],
    },
    demoFlow: {
      title: "Простой демонстрационный сценарий",
      text: "StudyAI уже можно показать как реалистичный клиентский MVP.",
      steps: ["Регистрация", "Задание", "Файл", "Учебный план", "Прогресс"],
    },
    faq: {
      title: "Вопросы",
      items: [
        {
          question: "StudyAI - это просто еще один AI-чат?",
          answer:
            "Нет. AI-наставник - только один модуль. Еще есть задания, файлы, документы, экзамены, диплом и панель.",
        },
        {
          question: "Можно пользоваться без серверной части?",
          answer:
            "Текущий MVP поддерживает локальный демонстрационный режим для многих клиентских сценариев.",
        },
        {
          question: "Оплата активна?",
          answer:
            "Нет. Подписка и оплата сейчас работают только как предпросмотр. Реальный платежный провайдер будет подключен позже.",
        },
        {
          question: "Данные синхронизируются между устройствами?",
          answer:
            "Для синхронизации между устройствами нужна серверная интеграция профиля, базы данных и хранилища. Локальная демоверсия хранится в этом браузере.",
        },
        {
          question: "Для кого StudyAI?",
          answer:
            "Сейчас для студентов. Позже можно расширить для университетских пилотных программ.",
        },
      ],
    },
    final: {
      title: "Начни организовывать учебную жизнь с StudyAI.",
      text: "Создай учебное пространство, добавь первую задачу и посмотри, как AI может помогать в реальной учебе.",
    },
    footer: {
      status: "Текущий статус: MVP-демо",
      product: "Продукт",
      legal: "Правовые разделы",
      privacy: "Раздел конфиденциальности",
      terms: "Условия использования",
    },
  },
  kz: {
    nav: {
      features: "Мүмкіндіктер",
      how: "Жұмыс істеуі",
      students: "Студенттерге",
      universities: "Университеттерге",
      pricing: "Баға",
      faq: "Сұрақтар",
      light: "Жарық",
      dark: "Қараңғы",
      login: "Кіру",
      start: "Тегін бастау",
    },
    hero: {
      eyebrow: "Жай AI-чат емес - студенттерге арналған академиялық оқу кеңістігі",
      title: "StudyAI - AI көмегі бар академиялық оқу кеңістігі",
      subtitle:
        "Тапсырмалар, файлдар, емтиханға дайындық, құжаттар, диплом прогресі және AI-тәлімгер бір жерде.",
      start: "Тегін бастау",
      login: "Кіру",
      demo: "Демонстрациялық панельді ашу",
      pills: ["AI-тәлімгер", "Тапсырмалар", "Емтихан", "Диплом", "Файлдар", "Локалды демоверсия"],
    },
    visual: {
      dashboard: "StudyAI панелі",
      workspace: "Оқу кеңістігі",
      streak: "Оқу сериясы",
      streakValue: "5 күн",
      due: "Осы апта дедлайндары",
      assignment: "Зерттеу әдістері тапсырмасы",
      assignmentMeta: "Жоғары приоритет - жұмаға дейін",
      assignmentPriority: "Жоғары",
      tutor: "AI-тәлімгер",
      tutorMessage: "Тақырыпты қадамдарға бөліп, бір мысал бер.",
      tutorAnswer: "1. Анықтаманы бер. 2. Қадамдарды көрсет. 3. Бір мысалмен бекіт.",
      document: "Құжат черновигі",
      documentMeta: "Эссе жоспары локалды сақталды",
      diploma: "Диплом прогресі",
    },
    problem: {
      title: "Студенттер тым көп құрал арасында уақыт жоғалтады.",
      text:
        "Оқу жұмысы чаттарда, жазбаларда, бұлттық папкаларда, күнтізбеде және бөлек құжаттарда шашырап жатады. AI көмегі нақты тапсырмалардан бөлініп қалады.",
      items: [
        "Тапсырмалар бір жерде, файлдар басқа жерде.",
        "AI чаттар тапсырмалармен және дедлайндармен байланыспайды.",
        "Емтиханға дайындық жиі құрылымсыз болады.",
        "Диплом прогресін тараулар мен жазбалар бойынша бақылау қиын.",
      ],
    },
    solution: {
      title: "StudyAI оқу жұмысын бір кеңістікке жинайды.",
      text:
        "MVP жоспарлау, AI көмек, құжаттар, файлдар және прогресс модульдерін біріктіреді.",
      cards: [
        {
          title: "Жұмысты жоспарлау",
          text: "Тапсырма құрып, приоритет қойып, дедлайндарды көріңіз.",
        },
        {
          title: "AI оқу көмегі",
          text: "Сұрақ қойыңыз, қайталап жіберуді қолданыңыз және сервер жоқ кезде локалды резервтік режим алыңыз.",
        },
        {
          title: "Файлдар мен құжаттар",
          text: "Оқу материалдары, жоспарлар, есептер және черновиктер бір жерде.",
        },
        {
          title: "Прогресті бақылау",
          text: "Кіріспе, оқу сериясы, апталық карточкалар және диплом прогресін қолданыңыз.",
        },
      ],
    },
    features: {
      title: "Толық академиялық оқу кеңістігі, жеке чат емес.",
      text: "StudyAI әртүрлі сервистерде тұрған оқу сценарийлерін байланыстырады.",
      cards: [
        {
          title: "AI-тәлімгер",
          text: "Оқу сұрақтары, қайталап жіберу және сервер жоқ кезде локалды алдын ала жауап.",
        },
        {
          title: "Тапсырмалар",
          text: "Курстық жұмыс, статус, приоритет және дедлайндар.",
        },
        {
          title: "Файлдар",
          text: "Файл метадеректері, оқу материалдары және талдауға дайындық.",
        },
        {
          title: "Құжаттар",
          text: "Эссе, есеп, жоспар, қысқаша қорытынды және академиялық черновиктер.",
        },
        {
          title: "Емтихан",
          text: "Қиындық, тақырыптар және күндік уақытпен оқу жоспарлары.",
        },
        {
          title: "Диплом",
          text: "Тараулар, milestone, жазбалар және жалпы прогресс.",
        },
        {
          title: "Панель",
          text: "Кіріспе, оқу сериясы, прогресс, апта дедлайндары және мерзімі өткен істер.",
        },
        {
          title: "Жазылымды алдын ала көру",
          text: "Нақты төлемге дейін Тегін, Pro және Premium жоспарларын алдын ала көру.",
        },
      ],
    },
    how: {
      title: "Қалай жұмыс істейді",
      steps: [
        {
          title: "Студент профилін жасаңыз",
          text: "Тіркеліп, аты-жөніңізді, университетті, бағдарламаны және мақсатты қосыңыз.",
        },
        {
          title: "Тапсырма, файл немесе мақсат қосыңыз",
          text: "Осы аптада керек нақты жұмыстан бастаңыз.",
        },
        {
          title: "AI құралдарын қолданыңыз",
          text: "Сұрақ қойып, черновик, емтихан жоспары және диплом құрылымын жасаңыз.",
        },
        {
          title: "Дедлайн мен прогресті бақылаңыз",
          text: "Панель оқу сериясын, дедлайндарды және оқу белсенділігін көрсетеді.",
        },
      ],
    },
    students: {
      title: "Хаосты азайтқысы келетін студенттерге.",
      text:
        "StudyAI тапсырма, емтихан және диплом қатар келген кезде оқу өмірін бір жерде ұстауға көмектеседі.",
      bullets: [
        "Әртүрлі сервистер арасында аз ауысу.",
        "Емтихан мен тапсырмаға жылдам дайындық.",
        "Дедлайн мен прогресс жақсы көрінеді.",
        "Жеке AI жауаптар емес, толық оқу кеңістігі.",
      ],
    },
    universities: {
      title: "Университет пилоты үшін дайын бағыт.",
      text:
        "Серверлік интеграция, ережелер және өндірістік бақылаулар дайын болған соң StudyAI академиялық қолдау платформасына кеңейе алады.",
      bullets: [
        "Студенттерге құрылымды AI қолдау.",
        "Университеттерге корпоративтік қолжетімділік моделі мүмкін.",
        "Серверлік бөлік және дерек ережелері бекітілгеннен кейін пилот мүмкін.",
        "Аналитика және пайдалану есептері кейін серверлік бөлік арқылы қосылады.",
      ],
    },
    pricing: {
      title: "Қарапайым баға көрінісі",
      text: "Қазіргі MVP-де төлем тек алдын ала көру режимінде. Нақты төлем кейін қосылады.",
      note: "Төлем қазір тек алдын ала көру режимінде және кейін қосылады.",
      popular: "Танымал",
      start: "Тегін бастау",
      plans: "Пландарды көру",
      pricePlans: [
        {
          key: "free",
          name: "Тегін",
          price: landingPricing.kz.free,
          description: "StudyAI базалық мүмкіндіктерін көру үшін.",
          features: ["AI-тәлімгерді алдын ала көру", "Тапсырмалар", "Панель", "Локалды резервтік режим"],
        },
        {
          key: "pro",
          name: "Pro",
          price: landingPricing.kz.proMonthly,
          yearly: landingPricing.kz.proYearly,
          description: "Белсенді студенттерге.",
          features: ["Көбірек AI-сценарий", "Құжаттар", "Емтихан", "Файлдармен жұмыс"],
          highlighted: true,
        },
        {
          key: "premium",
          name: "Premium",
          price: landingPricing.kz.premiumMonthly,
          yearly: landingPricing.kz.premiumYearly,
          description: "Кеңейтілген оқу процесі үшін.",
          features: ["Диплом", "Приоритеттерді алдын ала көру", "Көбірек оқу сценарийі", "Болашақ премиум-құралдар"],
        },
      ],
    },
    demoFlow: {
      title: "Қарапайым демонстрациялық сценарий",
      text: "StudyAI реалистік клиенттік MVP ретінде көрсетуге дайын.",
      steps: ["Тіркелу", "Тапсырма", "Файл", "Оқу жоспары", "Прогресс"],
    },
    faq: {
      title: "Сұрақтар",
      items: [
        {
          question: "StudyAI тағы бір AI-чат па?",
          answer:
            "Жоқ. AI-тәлімгер бір модуль ғана. Сонымен бірге тапсырмалар, файлдар, құжаттар, емтихан, диплом және панель бар.",
        },
        {
          question: "Сервер жоқ болса қолдануға бола ма?",
          answer:
            "Қазіргі MVP көп клиенттік сценарий үшін локалды демонстрациялық режимді қолдайды.",
        },
        {
          question: "Төлем актив пе?",
          answer:
            "Жоқ. Жазылым және төлем қазір тек алдын ала көру режимінде. Нақты төлем провайдері кейін қосылады.",
        },
        {
          question: "Деректер құрылғылар арасында синхрондала ма?",
          answer:
            "Құрылғылар арасындағы синхрондау үшін профильдің, дерекқордың және сақтау жүйесінің серверлік интеграциясы керек. Локалды демо осы браузерде қалады.",
        },
        {
          question: "StudyAI кімге арналған?",
          answer:
            "Қазір студенттерге. Кейін университет пилоты үшін кеңейтуге болады.",
        },
      ],
    },
    final: {
      title: "Оқу өміріңізді StudyAI арқылы ұйымдастырыңыз.",
      text: "Оқу кеңістігін жасап, алғашқы тапсырманы қосып, AI нақты оқу жұмысына қалай көмектесетінін көріңіз.",
    },
    footer: {
      status: "Қазіргі статус: MVP-демо",
      product: "Өнім",
      legal: "Құқықтық бөлімдер",
      privacy: "Құпиялылық бөлімі",
      terms: "Пайдалану шарттары",
    },
  },
};

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";

  for (const key of languageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "en" || value === "ru" || value === "kz") {
      return value;
    }
  }

  return "en";
}

function saveLanguage(language: Language) {
  for (const key of languageKeys) {
    window.localStorage.setItem(key, language);
  }

  window.dispatchEvent(new CustomEvent("studyai:language-change", { detail: language }));
}

function SectionHeader({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{text}</p>}
    </div>
  );
}

function DashboardPreview({ t }: { t: LandingCopy }) {
  return (
    <div className="relative rounded-[2rem] border border-white/20 bg-white/80 p-3 shadow-2xl shadow-blue-950/10 backdrop-blur-xl dark:bg-slate-900/80">
      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              {t.visual.dashboard}
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">
              {t.visual.workspace}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-black text-slate-700 dark:text-slate-200">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">🔥 {t.visual.streak}</p>
              <p className="mt-1 text-lg text-blue-600">{t.visual.streakValue}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">📅 {t.visual.due}</p>
              <p className="mt-1 text-lg text-blue-600">3</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">
                    📝{" "}
                    {t.visual.assignment}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t.visual.assignmentMeta}
                  </p>
                </div>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">
                  {t.visual.assignmentPriority}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-[68%] rounded-full bg-blue-600" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  📄{" "}
                  {t.visual.document}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {t.visual.documentMeta}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  🎓{" "}
                  {t.visual.diploma}
                </p>
                <p className="mt-2 text-3xl font-black text-blue-600">42%</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-slate-950 dark:text-white">🤖 {t.visual.tutor}</p>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-4 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold leading-6 text-white">
              {t.visual.tutorMessage}
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {t.visual.tutorAnswer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>(() => getCurrentTheme());
  const t = copy[language];

  useEffect(() => {
    const storedTheme = getCurrentTheme();

    setLanguage(getStoredLanguage());
    applyTheme(storedTheme);
    setTheme(storedTheme);

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
        applyTheme(customEvent.detail);
        setTheme(customEvent.detail);
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key && themeStorageKeys.includes(event.key)) {
        const storedTheme = getCurrentTheme();

        applyTheme(storedTheme);
        setTheme(storedTheme);
      }
    }

    window.addEventListener("studyai:language-change", handleLanguageChange);
    window.addEventListener("studyai:theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("studyai:language-change", handleLanguageChange);
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function handleLanguageSelect(nextLanguage: Language) {
    setLanguage(nextLanguage);
    saveLanguage(nextLanguage);
  }

  function handleThemeSelect(nextTheme: Theme) {
    applyTheme(nextTheme);
    setTheme(nextTheme);
    saveTheme(nextTheme);
    window.dispatchEvent(new CustomEvent("studyai:theme-change", { detail: nextTheme }));
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white"
    >
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-600/25">
              S
            </div>
            <span className="text-xl font-black tracking-tight dark:text-white">
              Study<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-[13px] font-bold text-slate-600 dark:text-slate-300 xl:flex">
            <a href="#features" className="whitespace-nowrap transition hover:text-blue-600">
              {t.nav.features}
            </a>
            <a href="#how-it-works" className="whitespace-nowrap transition hover:text-blue-600">
              {t.nav.how}
            </a>
            <a href="#students" className="whitespace-nowrap transition hover:text-blue-600">
              {t.nav.students}
            </a>
            <a href="#universities" className="whitespace-nowrap transition hover:text-blue-600">
              {t.nav.universities}
            </a>
            <a href="#pricing" className="whitespace-nowrap transition hover:text-blue-600">
              {t.nav.pricing}
            </a>
            <a href="#faq" className="whitespace-nowrap transition hover:text-blue-600">
              {t.nav.faq}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-2xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900 sm:flex">
              {(["en", "ru", "kz"] as Language[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleLanguageSelect(item)}
                  className={`h-8 rounded-xl px-3 text-xs font-black transition ${
                    item === language
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {languageLabels[item]}
                </button>
              ))}
            </div>
            <div className="hidden rounded-2xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900 md:flex">
              {(["light", "dark"] as Theme[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-label={item === "light" ? t.nav.light : t.nav.dark}
                  onClick={() => handleThemeSelect(item)}
                  className={`h-8 rounded-xl px-3 text-xs font-black transition ${
                    item === theme
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {item === "light" ? "☀️" : "🌙"}
                </button>
              ))}
            </div>
            <Link
              href="/login"
              className="hidden h-10 items-center justify-center whitespace-nowrap rounded-2xl px-4 text-sm font-black text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 md:inline-flex"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-2xl bg-blue-600 px-4 text-sm font-black text-white shadow-sm shadow-blue-600/25 transition hover:bg-blue-700"
            >
              {t.nav.start}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,#dbeafe_0%,rgba(248,250,252,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(37,99,235,0.24)_0%,rgba(15,23,42,0)_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-200">
              {t.hero.eyebrow}
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                {t.hero.start}
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400/40"
              >
                {t.hero.login}
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400/40"
              >
                {t.hero.demo}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {t.hero.pills.map((pill, index) => (
                <span
                  key={pill}
                  className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-slate-900 dark:text-blue-200"
                >
                  {featureIcons[index] ?? "📚"} {pill}
                </span>
              ))}
            </div>
          </div>

          <DashboardPreview t={t} />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {t.problem.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t.problem.text}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.problem.items.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"
              >
                <div className="mb-4 h-2 w-12 rounded-full bg-blue-600" />
                <p className="text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 dark:bg-slate-900/60 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title={t.solution.title} text={t.solution.text} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.solution.cards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/60"
              >
                <div className="mb-4 text-2xl">{solutionIcons[index] ?? "📚"}</div>
                <h3 className="text-base font-black text-slate-950 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title={t.features.title} text={t.features.text} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.cards.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-400/40 dark:hover:shadow-none"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-xl font-black text-blue-700 dark:bg-blue-500/15">
                  {featureIcons[index] ?? "📚"}
                </div>
                <h3 className="text-base font-black text-slate-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-4 py-16 dark:bg-slate-900/60 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title={t.how.title} />
          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {t.how.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/60"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-base font-black text-slate-950 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <article
            id="students"
            className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              {t.students.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t.students.text}
            </p>
            <div className="mt-6 grid gap-3">
              {t.students.bullets.map((item) => (
                <p key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article
            id="universities"
            className="rounded-[2rem] border border-blue-200 bg-blue-50 p-7 shadow-sm dark:border-blue-400/20 dark:bg-blue-500/10"
          >
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              {t.universities.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
              {t.universities.text}
            </p>
            <div className="mt-6 grid gap-3">
              {t.universities.bullets.map((item) => (
                <p key={item} className="rounded-2xl bg-white p-4 text-sm font-bold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
                  {item}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="pricing" className="bg-white px-4 py-16 dark:bg-slate-900/60 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title={t.pricing.title} text={t.pricing.text} />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {t.pricing.pricePlans.map((plan) => (
              <article
                key={plan.key}
                className={`relative rounded-[2rem] border bg-white p-7 shadow-sm dark:bg-slate-900 ${
                  plan.highlighted
                    ? "border-blue-300 shadow-xl shadow-blue-100/70 dark:border-blue-400/50 dark:shadow-none"
                    : "border-slate-200 dark:border-white/10"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">
                    {t.pricing.popular}
                  </span>
                )}
                <h3 className="text-xl font-black text-slate-950 dark:text-white">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {plan.description}
                </p>
                <p className="mt-6 text-4xl font-black text-slate-950 dark:text-white">
                  {plan.price}
                </p>
                {plan.yearly && (
                  <p className="mt-1 text-sm font-bold text-blue-600">
                    {plan.yearly}
                  </p>
                )}
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <p key={feature} className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {feature}
                    </p>
                  ))}
                </div>
                <Link
                  href={plan.key === "free" ? "/register" : "/subscription"}
                  className={`mt-7 inline-flex h-12 w-full items-center justify-center rounded-2xl text-sm font-black transition ${
                    plan.highlighted
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
                      : "border border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-400/40"
                  }`}
                >
                  {plan.key === "free" ? t.pricing.start : t.pricing.plans}
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-800 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200">
            {t.pricing.note}
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                {t.demoFlow.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {t.demoFlow.text}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-5">
              {t.demoFlow.steps.map((step, index) => (
                <div key={step} className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-950/70">
                  <p className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                    {index + 1}
                  </p>
                  <p className="mt-3 text-sm font-black text-slate-800 dark:text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-4 py-16 dark:bg-slate-900/60 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeader title={t.faq.title} />
          <div className="mt-10 grid gap-4">
            {t.faq.items.map((item) => (
              <details
                key={item.question}
                className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/60"
              >
                <summary className="cursor-pointer list-none text-base font-black text-slate-950 dark:text-white">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.25rem] border border-slate-200 bg-white px-6 py-12 text-center text-slate-950 shadow-sm dark:border-white/10 dark:bg-slate-950 dark:text-white sm:px-10">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
            {t.final.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {t.final.text}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-700"
            >
              {t.hero.start}
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-950 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400/40"
            >
              {t.hero.login}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 dark:border-white/10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3 sm:items-start">
          <div>
            <Link href="/" className="text-xl font-black">
              Study<span className="text-blue-600">AI</span>
            </Link>
            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
              {t.footer.status}
            </p>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p className="font-black text-slate-800 dark:text-slate-100">{t.footer.product}</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <a href="#features" className="hover:text-blue-600">
                {t.nav.features}
              </a>
              <a href="#how-it-works" className="hover:text-blue-600">
                {t.nav.how}
              </a>
              <a href="#pricing" className="hover:text-blue-600">
                {t.nav.pricing}
              </a>
              <a href="#faq" className="hover:text-blue-600">
                {t.nav.faq}
              </a>
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 sm:text-right">
            <p className="font-black text-slate-800 dark:text-slate-100">{t.footer.legal}</p>
            <p className="mt-3">{t.footer.privacy} · {t.footer.terms}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
