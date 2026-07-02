"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type ResearchType = "mixed" | "quantitative" | "qualitative" | "theoretical";
type ChapterStatus =
  | "notStarted"
  | "inProgress"
  | "draftReady"
  | "reviewed"
  | "completed";

type DiplomaForm = {
  topic: string;
  faculty: string;
  researchArea: string;
  supervisor: string;
  deadline: string;
  researchType: ResearchType;
  researchGoal: string;
  objectives: string;
  notes: string;
  milestones: string;
};

type ChapterKey =
  | "introduction"
  | "literature"
  | "methodology"
  | "results"
  | "discussion"
  | "conclusion";

type Copy = {
  pageBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  overallProgress: string;
  workspaceTitle: string;
  workspaceSubtitle: string;
  topic: string;
  topicPlaceholder: string;
  faculty: string;
  facultyPlaceholder: string;
  researchArea: string;
  researchAreaPlaceholder: string;
  supervisor: string;
  supervisorPlaceholder: string;
  deadline: string;
  deadlinePlaceholder: string;
  researchType: string;
  researchGoal: string;
  researchGoalPlaceholder: string;
  objectives: string;
  objectivesPlaceholder: string;
  saveDraft: string;
  generateStructure: string;
  structureTitle: string;
  structureSubtitle: string;
  chapterProgressTitle: string;
  chapterProgressSubtitle: string;
  storedLocally: string;
  status: string;
  chaptersCompleted: string;
  progressHint: string;
  researchTypes: Record<ResearchType, string>;
  statuses: Partial<Record<ChapterStatus, string>>;
  structure: Record<ChapterKey, string>;
  chapterTitles: Record<ChapterKey, string>;
  tipsTitle: string;
  tipsSubtitle: string;
  tips: string[];
};

const copy: Record<Language, Copy> = {
  en: {
    pageBadge: "Diploma workspace",
    pageTitle: "Manage your diploma work in one place",
    pageSubtitle:
      "Define your topic, goals, research questions, methodology, and chapter progress. Keep your thesis organized from the first idea to final submission.",
    overallProgress: "Overall progress",
    workspaceTitle: "Diploma workspace",
    workspaceSubtitle:
      "Add your diploma details to generate a structured thesis plan and track your progress.",
    topic: "Diploma topic",
    topicPlaceholder: "e.g. The impact of AI on university education",
    faculty: "Faculty / program",
    facultyPlaceholder: "e.g. Computer Science, Economics",
    researchArea: "Research area",
    researchAreaPlaceholder: "e.g. Artificial Intelligence in Education",
    supervisor: "Supervisor",
    supervisorPlaceholder: "e.g. Dr. John Smith",
    deadline: "Final deadline",
    deadlinePlaceholder: "DD.MM.YY",
    researchType: "Research type",
    researchGoal: "Research goal",
    researchGoalPlaceholder: "Describe the main goal of your diploma work...",
    objectives: "Research objectives",
    objectivesPlaceholder: "Write 3–5 objectives, each on a new line...",
    saveDraft: "Save draft",
    generateStructure: "Generate structure",
    structureTitle: "Generated diploma structure",
    structureSubtitle:
      "This is a frontend preview. Later, real AI structure generation will be connected through backend/API.",
    chapterProgressTitle: "Chapter progress",
    chapterProgressSubtitle:
      "Update chapter statuses and track overall diploma progress.",
    storedLocally: "Progress is stored locally for frontend preview.",
    status: "Status",
    chaptersCompleted: "chapters completed",
    progressHint: "Based on reviewed chapters.",
    researchTypes: {
      mixed: "Mixed methods",
      quantitative: "Quantitative research",
      qualitative: "Qualitative research",
      theoretical: "Theoretical research",
    },
    statuses: {
      notStarted: "Not started",
      inProgress: "In progress",
      draftReady: "Draft ready",
      reviewed: "Reviewed",
    },
    structure: {
      introduction:
        "Introduction: define the problem, research goal, objectives, and relevance.",
      literature:
        "Literature Review: summarize existing research and identify the research gap.",
      methodology:
        "Methodology: explain data sources, methods, tools, and limitations.",
      results:
        "Results / Analysis: present findings clearly with tables, charts, or examples.",
      discussion:
        "Discussion: connect findings with research questions and literature.",
      conclusion:
        "Conclusion: summarize the contribution and suggest future research.",
    },
    chapterTitles: {
      introduction: "Introduction",
      literature: "Literature Review",
      methodology: "Methodology",
      results: "Results / Analysis",
      discussion: "Discussion",
      conclusion: "Conclusion",
    },
    tipsTitle: "Diploma tips",
    tipsSubtitle: "Small reminders to keep your thesis clear and manageable.",
    tips: [
      "Keep your research question narrow and measurable.",
      "Write the methodology before collecting final results.",
      "Use one consistent citation style from the beginning.",
      "Track supervisor feedback after every meeting.",
    ],
  },
  ru: {
    pageBadge: "Diploma workspace",
    pageTitle: "Управляй дипломной работой в одном месте",
    pageSubtitle:
      "Определи тему, цели, исследовательские вопросы, методологию и прогресс по главам. Держи дипломную работу в порядке от первой идеи до финальной сдачи.",
    overallProgress: "Общий прогресс",
    workspaceTitle: "Рабочая область диплома",
    workspaceSubtitle:
      "Добавь данные дипломной работы, чтобы сформировать структуру и отслеживать прогресс.",
    topic: "Тема дипломной работы",
    topicPlaceholder: "например: Влияние AI на университетское образование",
    faculty: "Факультет / программа",
    facultyPlaceholder: "например: Computer Science, Economics",
    researchArea: "Область исследования",
    researchAreaPlaceholder: "например: Artificial Intelligence in Education",
    supervisor: "Научный руководитель",
    supervisorPlaceholder: "например: Dr. John Smith",
    deadline: "Финальный дедлайн",
    deadlinePlaceholder: "ДД.ММ.ГГ",
    researchType: "Тип исследования",
    researchGoal: "Цель исследования",
    researchGoalPlaceholder: "Опиши главную цель дипломной работы...",
    objectives: "Задачи исследования",
    objectivesPlaceholder: "Напиши 3–5 задач, каждую с новой строки...",
    saveDraft: "Сохранить черновик",
    generateStructure: "Создать структуру",
    structureTitle: "Сгенерированная структура диплома",
    structureSubtitle:
      "Это frontend-preview. Позже реальная AI-генерация структуры будет подключена через backend/API.",
    chapterProgressTitle: "Прогресс по главам",
    chapterProgressSubtitle:
      "Обновляй статусы глав и отслеживай общий прогресс диплома.",
    storedLocally: "Прогресс сохраняется локально для frontend-preview.",
    status: "Статус",
    chaptersCompleted: "глав завершено",
    progressHint: "На основе проверенных глав.",
    researchTypes: {
      mixed: "Смешанные методы",
      quantitative: "Количественное исследование",
      qualitative: "Качественное исследование",
      theoretical: "Теоретическое исследование",
    },
    statuses: {
      notStarted: "Не начато",
      inProgress: "В процессе",
      draftReady: "Черновик готов",
      reviewed: "Проверено",
    },
    structure: {
      introduction:
        "Введение: определить проблему, цель исследования, задачи и актуальность.",
      literature:
        "Обзор литературы: обобщить существующие исследования и найти research gap.",
      methodology:
        "Методология: описать источники данных, методы, инструменты и ограничения.",
      results:
        "Результаты / анализ: ясно представить выводы с таблицами, графиками или примерами.",
      discussion:
        "Обсуждение: связать результаты с исследовательскими вопросами и литературой.",
      conclusion:
        "Заключение: обобщить вклад работы и предложить направления будущих исследований.",
    },
    chapterTitles: {
      introduction: "Введение",
      literature: "Обзор литературы",
      methodology: "Методология",
      results: "Результаты / анализ",
      discussion: "Обсуждение",
      conclusion: "Заключение",
    },
    tipsTitle: "Советы по диплому",
    tipsSubtitle: "Короткие напоминания, чтобы работа оставалась понятной.",
    tips: [
      "Сделай исследовательский вопрос узким и измеримым.",
      "Опиши методологию до финального анализа результатов.",
      "Используй один стиль цитирования с самого начала.",
      "Фиксируй комментарии научного руководителя после каждой встречи.",
    ],
  },
  kz: {
    pageBadge: "Diploma workspace",
    pageTitle: "Диплом жұмысын бір жерде басқарыңыз",
    pageSubtitle:
      "Тақырыпты, мақсаттарды, зерттеу сұрақтарын, әдістемені және тараулардың прогресін анықтаңыз. Диплом жұмысын алғашқы идеядан финалдық тапсыруға дейін реттеп ұстаңыз.",
    overallProgress: "Жалпы прогресс",
    workspaceTitle: "Диплом жұмыс аймағы",
    workspaceSubtitle:
      "Диплом деректерін қосып, құрылым жасап, прогресті бақылаңыз.",
    topic: "Диплом тақырыбы",
    topicPlaceholder: "мысалы: AI-дың университет білім беруіне әсері",
    faculty: "Факультет / бағдарлама",
    facultyPlaceholder: "мысалы: Computer Science, Economics",
    researchArea: "Зерттеу бағыты",
    researchAreaPlaceholder: "мысалы: Artificial Intelligence in Education",
    supervisor: "Ғылыми жетекші",
    supervisorPlaceholder: "мысалы: Dr. John Smith",
    deadline: "Финалдық дедлайн",
    deadlinePlaceholder: "КК.АА.ЖЖ",
    researchType: "Зерттеу түрі",
    researchGoal: "Зерттеу мақсаты",
    researchGoalPlaceholder: "Диплом жұмысының негізгі мақсатын сипаттаңыз...",
    objectives: "Зерттеу міндеттері",
    objectivesPlaceholder: "3–5 міндетті әр жолға бөлек жазыңыз...",
    saveDraft: "Черновикті сақтау",
    generateStructure: "Құрылым жасау",
    structureTitle: "Жасалған диплом құрылымы",
    structureSubtitle:
      "Бұл frontend-preview. Кейін нақты AI құрылым генерациясы backend/API арқылы қосылады.",
    chapterProgressTitle: "Тараулар прогресі",
    chapterProgressSubtitle:
      "Тарау статустарын жаңартып, жалпы диплом прогресін бақылаңыз.",
    storedLocally: "Прогресс frontend-preview үшін локалды сақталады.",
    status: "Статус",
    chaptersCompleted: "тарау аяқталды",
    progressHint: "Тексерілген тараулар негізінде.",
    researchTypes: {
      mixed: "Аралас әдістер",
      quantitative: "Сандық зерттеу",
      qualitative: "Сапалық зерттеу",
      theoretical: "Теориялық зерттеу",
    },
    statuses: {
      notStarted: "Басталмады",
      inProgress: "Процесте",
      draftReady: "Черновик дайын",
      reviewed: "Тексерілді",
    },
    structure: {
      introduction:
        "Кіріспе: мәселені, зерттеу мақсатын, міндеттерді және өзектілікті анықтау.",
      literature:
        "Әдебиетке шолу: бар зерттеулерді қорытындылап, research gap табу.",
      methodology:
        "Әдістеме: дереккөздерді, әдістерді, құралдарды және шектеулерді түсіндіру.",
      results:
        "Нәтижелер / талдау: қорытындыларды кесте, график немесе мысалдармен көрсету.",
      discussion:
        "Талқылау: нәтижелерді зерттеу сұрақтарымен және әдебиетпен байланыстыру.",
      conclusion:
        "Қорытынды: жұмыстың үлесін жинақтап, болашақ зерттеу бағыттарын ұсыну.",
    },
    chapterTitles: {
      introduction: "Кіріспе",
      literature: "Әдебиетке шолу",
      methodology: "Әдістеме",
      results: "Нәтижелер / талдау",
      discussion: "Талқылау",
      conclusion: "Қорытынды",
    },
    tipsTitle: "Диплом бойынша кеңестер",
    tipsSubtitle: "Жұмысты түсінікті ұстауға арналған қысқа ескертулер.",
    tips: [
      "Зерттеу сұрағын нақты және өлшенетін етіп жасаңыз.",
      "Қорытынды нәтижелерге дейін әдістемені жазып қойыңыз.",
      "Басынан бастап бір citation style қолданыңыз.",
      "Әр кездесуден кейін жетекші пікірлерін сақтап отырыңыз.",
    ],
  },
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

const themeStorageKeys = ["studyai-theme", "studyai_theme", "theme"];
const diplomaStorageKey = "studyai-diploma-form";
const chapterStorageKey = "studyai-diploma-chapters";

const diplomaExtraCopy = {
  en: {
    notes: "Notes",
    notesPlaceholder: "Supervisor feedback, open questions, or writing reminders...",
    milestones: "Milestones",
    milestonesPlaceholder: "e.g. Literature review by Friday, methodology draft next week...",
    saved: "Saved locally because backend is unavailable.",
    completed: "Completed",
  },
  ru: {
    notes: "Заметки",
    notesPlaceholder: "Комментарии руководителя, вопросы или напоминания по тексту...",
    milestones: "Этапы",
    milestonesPlaceholder: "например: обзор литературы до пятницы, методология на следующей неделе...",
    saved: "Сохранено локально, потому что backend недоступен.",
    completed: "Завершено",
  },
  kz: {
    notes: "Жазбалар",
    notesPlaceholder: "Жетекші пікірі, ашық сұрақтар немесе жазу ескертпелері...",
    milestones: "Кезеңдер",
    milestonesPlaceholder: "мысалы: әдебиет шолуы жұмаға дейін, әдістеме келесі аптада...",
    saved: "Backend қолжетімсіз болғандықтан жергілікті түрде сақталды.",
    completed: "Аяқталды",
  },
} satisfies Record<
  Language,
  {
    notes: string;
    notesPlaceholder: string;
    milestones: string;
    milestonesPlaceholder: string;
    saved: string;
    completed: string;
  }
>;

const chapterKeys: ChapterKey[] = [
  "introduction",
  "literature",
  "methodology",
  "results",
  "discussion",
  "conclusion",
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

function getProgress(chapters: Record<ChapterKey, ChapterStatus>) {
  const reviewedCount = chapterKeys.filter(
    (chapter) =>
      chapters[chapter] === "reviewed" || chapters[chapter] === "completed"
  ).length;

  return Math.round((reviewedCount / chapterKeys.length) * 100);
}

function DiplomaContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");

  const [form, setForm] = useState<DiplomaForm>({
    topic: "",
    faculty: "",
    researchArea: "",
    supervisor: "",
    deadline: "",
    researchType: "mixed",
    researchGoal: "",
    objectives: "",
    notes: "",
    milestones: "",
  });

  const [chapters, setChapters] = useState<Record<ChapterKey, ChapterStatus>>({
    introduction: "inProgress",
    literature: "notStarted",
    methodology: "notStarted",
    results: "notStarted",
    discussion: "notStarted",
    conclusion: "notStarted",
  });
  const [toast, setToast] = useState("");

  const t = copy[language];
  const x = diplomaExtraCopy[language];
  const isDark = theme === "dark";
  const progress = useMemo(() => getProgress(chapters), [chapters]);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getStoredTheme());

    const savedForm = window.localStorage.getItem(diplomaStorageKey);
    const savedChapters = window.localStorage.getItem(chapterStorageKey);

    if (savedForm) {
      try {
        setForm((current) => ({
          ...current,
          ...(JSON.parse(savedForm) as Partial<DiplomaForm>),
        }));
      } catch {
        window.localStorage.removeItem(diplomaStorageKey);
      }
    }

    if (savedChapters) {
      try {
        setChapters(JSON.parse(savedChapters) as Record<ChapterKey, ChapterStatus>);
      } catch {
        window.localStorage.removeItem(chapterStorageKey);
      }
    }

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

  function updateForm<K extends keyof DiplomaForm>(key: K, value: DiplomaForm[K]) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function saveDiplomaDraft() {
    window.localStorage.setItem(diplomaStorageKey, JSON.stringify(form));
    window.localStorage.setItem(chapterStorageKey, JSON.stringify(chapters));
    setToast(x.saved);
    window.setTimeout(() => setToast(""), 2600);
  }

  function updateChapterStatus(chapter: ChapterKey, status: ChapterStatus) {
    const nextChapters = {
      ...chapters,
      [chapter]: status,
    };

    setChapters(nextChapters);
    window.localStorage.setItem(chapterStorageKey, JSON.stringify(nextChapters));
  }

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
      {toast && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20">
          {toast}
        </div>
      )}

      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6">
        <section
          className={`overflow-hidden rounded-[2rem] border p-5 sm:p-6 lg:p-8 ${cardClass}`}
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${
                  isDark
                    ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                    : "border-blue-100 bg-blue-50 text-blue-700"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {t.pageBadge}
              </div>

              <h1
                className={`max-w-4xl text-3xl font-black tracking-tight sm:text-4xl ${titleClass}`}
              >
                {t.pageTitle}
              </h1>

              <p
                className={`mt-4 max-w-4xl text-sm leading-7 sm:text-base ${textClass}`}
              >
                {t.pageSubtitle}
              </p>
            </div>

            <div
              className={`flex h-24 w-32 shrink-0 flex-col items-center justify-center rounded-3xl border ${
                isDark
                  ? "border-blue-400/20 bg-blue-500/15"
                  : "border-blue-100 bg-blue-50"
              }`}
            >
              <span className={`text-xs font-black ${mutedClass}`}>
                {t.overallProgress}
              </span>
              <span className="mt-1 text-4xl font-black text-blue-600">
                {progress}%
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div>
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.workspaceTitle}
              </h2>
              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.workspaceSubtitle}
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.topic}
                </span>
                <input
                  value={form.topic}
                  onChange={(event) => updateForm("topic", event.target.value)}
                  placeholder={t.topicPlaceholder}
                  className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`text-sm font-black ${titleClass}`}>
                    {t.faculty}
                  </span>
                  <input
                    value={form.faculty}
                    onChange={(event) =>
                      updateForm("faculty", event.target.value)
                    }
                    placeholder={t.facultyPlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={`text-sm font-black ${titleClass}`}>
                    {t.researchArea}
                  </span>
                  <input
                    value={form.researchArea}
                    onChange={(event) =>
                      updateForm("researchArea", event.target.value)
                    }
                    placeholder={t.researchAreaPlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`text-sm font-black ${titleClass}`}>
                    {t.supervisor}
                  </span>
                  <input
                    value={form.supervisor}
                    onChange={(event) =>
                      updateForm("supervisor", event.target.value)
                    }
                    placeholder={t.supervisorPlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={`text-sm font-black ${titleClass}`}>
                    {t.deadline}
                  </span>
                  <input
                    value={form.deadline}
                    onChange={(event) =>
                      updateForm("deadline", event.target.value)
                    }
                    placeholder={t.deadlinePlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.researchType}
                </span>
                <select
                  value={form.researchType}
                  onChange={(event) =>
                    updateForm("researchType", event.target.value as ResearchType)
                  }
                  className={`h-12 rounded-2xl border px-4 text-sm font-semibold outline-none transition focus:ring-4 ${inputClass}`}
                >
                  {(["mixed", "quantitative", "qualitative", "theoretical"] as ResearchType[]).map(
                    (type) => (
                      <option key={type} value={type}>
                        {t.researchTypes[type]}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.researchGoal}
                </span>
                <textarea
                  value={form.researchGoal}
                  onChange={(event) =>
                    updateForm("researchGoal", event.target.value)
                  }
                  placeholder={t.researchGoalPlaceholder}
                  rows={4}
                  className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.objectives}
                </span>
                <textarea
                  value={form.objectives}
                  onChange={(event) =>
                    updateForm("objectives", event.target.value)
                  }
                  placeholder={t.objectivesPlaceholder}
                  rows={4}
                  className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {x.notes}
                </span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder={x.notesPlaceholder}
                  rows={4}
                  className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {x.milestones}
                </span>
                <textarea
                  value={form.milestones}
                  onChange={(event) => updateForm("milestones", event.target.value)}
                  placeholder={x.milestonesPlaceholder}
                  rows={4}
                  className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={saveDiplomaDraft}
                  className={`h-12 rounded-2xl border text-sm font-black transition ${
                    isDark
                      ? "border-white/10 bg-slate-950/60 text-slate-100 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t.saveDraft}
                </button>

                <button
                  type="button"
                  onClick={saveDiplomaDraft}
                  className="h-12 rounded-2xl bg-blue-600 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  {t.generateStructure}
                </button>
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.structureTitle}
              </h2>

              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.structureSubtitle}
              </p>

              <div className="mt-6 grid gap-3">
                {chapterKeys.map((chapter, index) => (
                  <div
                    key={chapter}
                    className={`flex gap-4 rounded-2xl border p-4 ${softCardClass}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      {index + 1}
                    </span>

                    <p className={`text-sm font-semibold leading-6 ${textClass}`}>
                      {t.structure[chapter]}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className={`text-xl font-black ${titleClass}`}>
                    {t.chapterProgressTitle}
                  </h2>

                  <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                    {t.chapterProgressSubtitle}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border px-4 py-3 text-center ${
                    isDark
                      ? "border-blue-400/20 bg-blue-500/15"
                      : "border-blue-100 bg-blue-50"
                  }`}
                >
                  <p className={`text-xs font-black ${mutedClass}`}>
                    {t.overallProgress}
                  </p>
                  <p className="text-2xl font-black text-blue-600">
                    {progress}%
                  </p>
                </div>
              </div>

              <div
                className={`mt-5 h-3 overflow-hidden rounded-full ${
                  isDark ? "bg-slate-950" : "bg-slate-200"
                }`}
              >
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className={`mt-2 text-xs font-semibold ${mutedClass}`}>
                {t.progressHint}
              </p>

              <div className="mt-6 grid gap-3">
                {chapterKeys.map((chapter) => (
                  <div
                    key={chapter}
                    className={`rounded-2xl border p-4 ${softCardClass}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className={`text-sm font-black ${titleClass}`}>
                          {t.chapterTitles[chapter]}
                        </p>
                        <p className={`mt-1 text-xs font-semibold ${mutedClass}`}>
                          {t.status}:{" "}
                          {t.statuses[chapters[chapter]] ?? x.completed}
                        </p>
                      </div>

                      <select
                        value={chapters[chapter]}
                        onChange={(event) =>
                          updateChapterStatus(
                            chapter,
                            event.target.value as ChapterStatus
                          )
                        }
                        className={`h-10 rounded-2xl border px-3 text-xs font-black outline-none ${inputClass}`}
                      >
                        {(
                          [
                            "notStarted",
                            "inProgress",
                            "draftReady",
                            "reviewed",
                            "completed",
                          ] as ChapterStatus[]
                        ).map((status) => (
                          <option key={status} value={status}>
                            {t.statuses[status] ?? x.completed}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <p className={`mt-4 text-xs font-semibold ${mutedClass}`}>
                {
                  chapterKeys.filter(
                    (chapter) =>
                      chapters[chapter] === "reviewed" ||
                      chapters[chapter] === "completed"
                  ).length
                }
                /
                {chapterKeys.length} {t.chaptersCompleted}. {t.storedLocally}
              </p>
            </section>

            <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-sm shadow-blue-600/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl">
                🎓
              </div>

              <h2 className="mt-5 text-xl font-black">{t.tipsTitle}</h2>

              <p className="mt-2 text-sm font-medium leading-6 text-blue-100">
                {t.tipsSubtitle}
              </p>

              <div className="mt-5 grid gap-3">
                {t.tips.map((tip) => (
                  <div
                    key={tip}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-semibold leading-6 text-white"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function DiplomaPage() {
  return (
    <AppShell>
      <DiplomaContent />
    </AppShell>
  );
}
