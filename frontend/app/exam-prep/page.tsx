"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type PrepMode = "studyPlan" | "flashcards" | "practiceQuiz" | "weakTopics";

type ExamForm = {
  examTitle: string;
  subject: string;
  examDate: string;
  prepMode: PrepMode;
  topics: string;
  currentKnowledge: string;
};

type SavedExam = {
  id: number;
  title: string;
  subject: string;
  date: string;
  progress: number;
};

type Copy = {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  readinessScore: string;
  readinessSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  examTitle: string;
  examTitlePlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  examDate: string;
  datePlaceholder: string;
  prepMode: string;
  topics: string;
  topicsPlaceholder: string;
  currentKnowledge: string;
  currentKnowledgePlaceholder: string;
  generatePreview: string;
  saveExam: string;
  clearForm: string;
  previewTitle: string;
  previewSubtitle: string;
  studyPlan: string;
  flashcards: string;
  practiceQuiz: string;
  weakTopics: string;
  checklist: string;
  savedTitle: string;
  savedSubtitle: string;
  noSavedTitle: string;
  noSavedSubtitle: string;
  open: string;
  continue: string;
  progress: string;
  storedLocally: string;
  modes: Record<PrepMode, string>;
  planItems: string[];
  flashcardItems: {
    title: string;
    text: string;
  }[];
  quizItems: {
    question: string;
    answer: string;
  }[];
  weakTopicItems: string[];
  checklistItems: string[];
  savedSamples: SavedExam[];
};

const copy: Record<Language, Copy> = {
  en: {
    badge: "Exam Preparation",
    heroTitle: "Prepare for exams smarter",
    heroSubtitle:
      "Create a study plan, generate practice questions, review weak topics, and organize your exam preparation in one place.",
    readinessScore: "Readiness score",
    readinessSubtitle:
      "Your current preparation level based on saved progress and completed practice.",
    formTitle: "Create exam preparation",
    formSubtitle: "Add exam details and choose how StudyAI should help you prepare.",
    examTitle: "Exam title",
    examTitlePlaceholder: "e.g. Database Systems Final Exam",
    subject: "Subject",
    subjectPlaceholder: "e.g. Database Systems",
    examDate: "Exam date",
    datePlaceholder: "DD.MM.YY",
    prepMode: "Preparation mode",
    topics: "Topics to study",
    topicsPlaceholder:
      "Write exam topics, chapters, formulas, or questions you need to revise...",
    currentKnowledge: "Current knowledge",
    currentKnowledgePlaceholder:
      "Describe what you already understand and what feels difficult...",
    generatePreview: "Generate preview",
    saveExam: "Save exam",
    clearForm: "Clear form",
    previewTitle: "Generated study preview",
    previewSubtitle:
      "This is an interface preview. Later, real AI exam preparation will be connected through backend/API.",
    studyPlan: "Study plan",
    flashcards: "Flashcards",
    practiceQuiz: "Practice quiz",
    weakTopics: "Weak topics",
    checklist: "Checklist",
    savedTitle: "Saved exam plans",
    savedSubtitle: "Your local exam preparation drafts.",
    noSavedTitle: "No saved exam plans yet",
    noSavedSubtitle: "Create and save an exam plan to see it here.",
    open: "Open",
    continue: "Continue",
    progress: "Progress",
    storedLocally: "Saved locally for frontend preview.",
    modes: {
      studyPlan: "Study plan",
      flashcards: "Flashcards",
      practiceQuiz: "Practice quiz",
      weakTopics: "Weak topics",
    },
    planItems: [
      "Day 1: Review core theory and write short notes for each topic.",
      "Day 2: Practice examples and solve at least 10 questions.",
      "Day 3: Focus on weak topics and repeat difficult definitions.",
      "Day 4: Take a practice quiz and check mistakes carefully.",
      "Day 5: Do a final review with flashcards and summary notes.",
    ],
    flashcardItems: [
      {
        title: "Primary key",
        text: "A unique identifier for each record in a database table.",
      },
      {
        title: "Normalization",
        text: "A process of organizing data to reduce duplication and improve consistency.",
      },
      {
        title: "Foreign key",
        text: "A field that links one table to another table.",
      },
    ],
    quizItems: [
      {
        question: "What is the purpose of database normalization?",
        answer: "To reduce redundancy and improve data consistency.",
      },
      {
        question: "What does a primary key do?",
        answer: "It uniquely identifies each row in a table.",
      },
      {
        question: "Why are indexes used?",
        answer: "They help speed up data retrieval.",
      },
    ],
    weakTopicItems: [
      "Normalization forms",
      "SQL joins",
      "Indexing strategy",
      "Transaction isolation",
    ],
    checklistItems: [
      "Review all lecture notes",
      "Summarize key formulas",
      "Practice past questions",
      "Mark weak topics",
      "Do one timed mock exam",
    ],
    savedSamples: [
      {
        id: 1,
        title: "Calculus Final Exam",
        subject: "Mathematics",
        date: "27.05.26",
        progress: 62,
      },
      {
        id: 2,
        title: "Business Statistics Test",
        subject: "Business Statistics",
        date: "02.06.26",
        progress: 48,
      },
    ],
  },
  ru: {
    badge: "Подготовка к экзаменам",
    heroTitle: "Готовься к экзаменам умнее",
    heroSubtitle:
      "Создавай учебный план, генерируй практические вопросы, повторяй слабые темы и держи подготовку к экзаменам в одном месте.",
    readinessScore: "Готовность",
    readinessSubtitle:
      "Текущий уровень подготовки на основе сохранённого прогресса и выполненной практики.",
    formTitle: "Создать подготовку к экзамену",
    formSubtitle:
      "Добавь данные экзамена и выбери, как StudyAI должен помочь с подготовкой.",
    examTitle: "Название экзамена",
    examTitlePlaceholder: "например: Финальный экзамен по базам данных",
    subject: "Предмет",
    subjectPlaceholder: "например: Database Systems",
    examDate: "Дата экзамена",
    datePlaceholder: "ДД.ММ.ГГ",
    prepMode: "Режим подготовки",
    topics: "Темы для повторения",
    topicsPlaceholder:
      "Напиши темы экзамена, главы, формулы или вопросы, которые нужно повторить...",
    currentKnowledge: "Текущий уровень знаний",
    currentKnowledgePlaceholder:
      "Опиши, что уже понятно, а какие темы кажутся сложными...",
    generatePreview: "Создать preview",
    saveExam: "Сохранить экзамен",
    clearForm: "Очистить форму",
    previewTitle: "Сгенерированный preview подготовки",
    previewSubtitle:
      "Это preview интерфейса. Позже реальная AI-подготовка будет подключена через backend/API.",
    studyPlan: "План подготовки",
    flashcards: "Карточки",
    practiceQuiz: "Практический тест",
    weakTopics: "Слабые темы",
    checklist: "Чеклист",
    savedTitle: "Сохранённые планы экзаменов",
    savedSubtitle: "Локальные черновики подготовки к экзаменам.",
    noSavedTitle: "Пока нет сохранённых планов",
    noSavedSubtitle: "Создай и сохрани план экзамена, чтобы он появился здесь.",
    open: "Открыть",
    continue: "Продолжить",
    progress: "Прогресс",
    storedLocally: "Сохранено локально для frontend-preview.",
    modes: {
      studyPlan: "План подготовки",
      flashcards: "Карточки",
      practiceQuiz: "Практический тест",
      weakTopics: "Слабые темы",
    },
    planItems: [
      "День 1: Повтори основную теорию и сделай короткие заметки по каждой теме.",
      "День 2: Разбери примеры и реши минимум 10 задач.",
      "День 3: Сфокусируйся на слабых темах и повтори сложные определения.",
      "День 4: Пройди практический тест и внимательно проверь ошибки.",
      "День 5: Сделай финальное повторение через карточки и конспект.",
    ],
    flashcardItems: [
      {
        title: "Первичный ключ",
        text: "Уникальный идентификатор каждой записи в таблице базы данных.",
      },
      {
        title: "Нормализация",
        text: "Процесс организации данных для уменьшения дублирования и повышения согласованности.",
      },
      {
        title: "Внешний ключ",
        text: "Поле, которое связывает одну таблицу с другой.",
      },
    ],
    quizItems: [
      {
        question: "Для чего нужна нормализация базы данных?",
        answer: "Чтобы уменьшить избыточность и улучшить согласованность данных.",
      },
      {
        question: "Что делает первичный ключ?",
        answer: "Он уникально идентифицирует каждую строку в таблице.",
      },
      {
        question: "Зачем используются индексы?",
        answer: "Они помогают ускорить поиск и получение данных.",
      },
    ],
    weakTopicItems: [
      "Формы нормализации",
      "SQL JOIN",
      "Стратегия индексации",
      "Изоляция транзакций",
    ],
    checklistItems: [
      "Повторить все лекционные материалы",
      "Сделать краткий конспект формул",
      "Решить прошлые вопросы",
      "Отметить слабые темы",
      "Пройти один пробный экзамен на время",
    ],
    savedSamples: [
      {
        id: 1,
        title: "Финальный экзамен по математическому анализу",
        subject: "Mathematics",
        date: "27.05.26",
        progress: 62,
      },
      {
        id: 2,
        title: "Тест по бизнес-статистике",
        subject: "Business Statistics",
        date: "02.06.26",
        progress: 48,
      },
    ],
  },
  kz: {
    badge: "Емтиханға дайындық",
    heroTitle: "Емтиханға ақылды дайындалыңыз",
    heroSubtitle:
      "Оқу жоспарын құрып, практикалық сұрақтар жасап, әлсіз тақырыптарды қайталап, емтиханға дайындықты бір жерде ұйымдастырыңыз.",
    readinessScore: "Дайындық деңгейі",
    readinessSubtitle:
      "Сақталған прогресс пен орындалған практика негізіндегі ағымдағы дайындық деңгейі.",
    formTitle: "Емтиханға дайындық құру",
    formSubtitle:
      "Емтихан деректерін қосып, StudyAI қалай көмектесу керек екенін таңдаңыз.",
    examTitle: "Емтихан атауы",
    examTitlePlaceholder: "мысалы: Database Systems финал емтиханы",
    subject: "Пән",
    subjectPlaceholder: "мысалы: Database Systems",
    examDate: "Емтихан күні",
    datePlaceholder: "КК.АА.ЖЖ",
    prepMode: "Дайындық режимі",
    topics: "Қайталау тақырыптары",
    topicsPlaceholder:
      "Емтихан тақырыптарын, тарауларды, формулаларды немесе сұрақтарды жазыңыз...",
    currentKnowledge: "Ағымдағы білім деңгейі",
    currentKnowledgePlaceholder:
      "Қай тақырып түсінікті, ал қайсысы қиын екенін сипаттаңыз...",
    generatePreview: "Preview жасау",
    saveExam: "Емтиханды сақтау",
    clearForm: "Форманы тазалау",
    previewTitle: "Жасалған дайындық preview",
    previewSubtitle:
      "Бұл интерфейс preview. Кейін нақты AI дайындық backend/API арқылы қосылады.",
    studyPlan: "Дайындық жоспары",
    flashcards: "Карточкалар",
    practiceQuiz: "Практикалық тест",
    weakTopics: "Әлсіз тақырыптар",
    checklist: "Чеклист",
    savedTitle: "Сақталған емтихан жоспарлары",
    savedSubtitle: "Емтиханға дайындықтың локалды черновиктері.",
    noSavedTitle: "Сақталған жоспарлар әлі жоқ",
    noSavedSubtitle: "Жоспар құрып сақтасаңыз, ол осы жерде пайда болады.",
    open: "Ашу",
    continue: "Жалғастыру",
    progress: "Прогресс",
    storedLocally: "Frontend-preview үшін локалды сақталды.",
    modes: {
      studyPlan: "Дайындық жоспары",
      flashcards: "Карточкалар",
      practiceQuiz: "Практикалық тест",
      weakTopics: "Әлсіз тақырыптар",
    },
    planItems: [
      "1-күн: Негізгі теорияны қайталап, әр тақырыпқа қысқа жазба жасаңыз.",
      "2-күн: Мысалдарды қарап, кемінде 10 сұрақ шешіңіз.",
      "3-күн: Әлсіз тақырыптарға назар аударып, қиын анықтамаларды қайталаңыз.",
      "4-күн: Практикалық тест өтіп, қателерді мұқият тексеріңіз.",
      "5-күн: Карточкалар мен қысқаша конспект арқылы финалдық қайталау жасаңыз.",
    ],
    flashcardItems: [
      {
        title: "Бастапқы кілт",
        text: "Кестедегі әр жазбаны бірегей анықтайтын идентификатор.",
      },
      {
        title: "Нормализация",
        text: "Деректердің қайталануын азайтып, келісімділікті жақсарту процесі.",
      },
      {
        title: "Сыртқы кілт",
        text: "Бір кестені екінші кестемен байланыстыратын өріс.",
      },
    ],
    quizItems: [
      {
        question: "Дерекқор нормализациясы не үшін керек?",
        answer: "Қайталануды азайту және деректер келісімділігін жақсарту үшін.",
      },
      {
        question: "Бастапқы кілт не істейді?",
        answer: "Кестедегі әр жолды бірегей анықтайды.",
      },
      {
        question: "Индекстер не үшін қолданылады?",
        answer: "Деректерді іздеуді және алуды жылдамдату үшін.",
      },
    ],
    weakTopicItems: [
      "Нормализация формалары",
      "SQL JOIN",
      "Индекстеу стратегиясы",
      "Транзакция изоляциясы",
    ],
    checklistItems: [
      "Барлық лекция материалдарын қайталау",
      "Негізгі формулаларға қысқа конспект жасау",
      "Өткен сұрақтарды шешу",
      "Әлсіз тақырыптарды белгілеу",
      "Уақытпен бір пробный емтихан өту",
    ],
    savedSamples: [
      {
        id: 1,
        title: "Математикалық анализ финал емтиханы",
        subject: "Mathematics",
        date: "27.05.26",
        progress: 62,
      },
      {
        id: 2,
        title: "Бизнес статистика тесті",
        subject: "Business Statistics",
        date: "02.06.26",
        progress: 48,
      },
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
const examFormStorageKey = "studyai-exam-prep-form";
const savedExamStorageKey = "studyai-exam-prep-saved";

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

function ExamPrepContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");

  const [form, setForm] = useState<ExamForm>({
    examTitle: "",
    subject: "",
    examDate: "",
    prepMode: "studyPlan",
    topics: "",
    currentKnowledge: "",
  });

  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);
  const [showPreview, setShowPreview] = useState(true);

  const t = copy[language];
  const isDark = theme === "dark";

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getStoredTheme());

    const savedForm = window.localStorage.getItem(examFormStorageKey);
    const savedPlans = window.localStorage.getItem(savedExamStorageKey);

    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm) as ExamForm);
      } catch {
        window.localStorage.removeItem(examFormStorageKey);
      }
    }

    if (savedPlans) {
      try {
        setSavedExams(JSON.parse(savedPlans) as SavedExam[]);
      } catch {
        window.localStorage.removeItem(savedExamStorageKey);
      }
    } else {
      setSavedExams(t.savedSamples);
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
  }, [t.savedSamples]);

  function updateForm<K extends keyof ExamForm>(key: K, value: ExamForm[K]) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function generatePreview() {
    window.localStorage.setItem(examFormStorageKey, JSON.stringify(form));
    setShowPreview(true);
  }

  function saveExam() {
    const newExam: SavedExam = {
      id: Date.now(),
      title: form.examTitle.trim() || t.examTitlePlaceholder,
      subject: form.subject.trim() || t.subjectPlaceholder,
      date: form.examDate.trim() || t.datePlaceholder,
      progress: 17,
    };

    const nextSavedExams = [newExam, ...savedExams];

    setSavedExams(nextSavedExams);
    window.localStorage.setItem(savedExamStorageKey, JSON.stringify(nextSavedExams));
    window.localStorage.setItem(examFormStorageKey, JSON.stringify(form));
  }

  function clearForm() {
    const emptyForm: ExamForm = {
      examTitle: "",
      subject: "",
      examDate: "",
      prepMode: "studyPlan",
      topics: "",
      currentKnowledge: "",
    };

    setForm(emptyForm);
    window.localStorage.setItem(examFormStorageKey, JSON.stringify(emptyForm));
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

  const accentCardClass = isDark
    ? "border-blue-400/20 bg-blue-500/15"
    : "border-blue-100 bg-blue-50";

  const titleClass = isDark ? "text-white" : "text-slate-950";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";

  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-500/10"
    : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/10";

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
                🎯 {t.badge}
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
              className={`flex min-h-32 w-full shrink-0 flex-col items-center justify-center rounded-3xl border p-5 text-center lg:w-80 ${accentCardClass}`}
            >
              <p className="text-sm font-black text-blue-500">
                {t.readinessScore}
              </p>
              <p className="mt-1 text-4xl font-black text-blue-600">62%</p>
              <p className={`mt-3 text-xs leading-5 ${textClass}`}>
                {t.readinessSubtitle}
              </p>
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>
              {t.formTitle}
            </h2>

            <p className={`mt-2 text-sm leading-6 ${textClass}`}>
              {t.formSubtitle}
            </p>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.examTitle}
                </span>
                <input
                  value={form.examTitle}
                  onChange={(event) => updateForm("examTitle", event.target.value)}
                  placeholder={t.examTitlePlaceholder}
                  className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`text-sm font-black ${titleClass}`}>
                    {t.subject}
                  </span>
                  <input
                    value={form.subject}
                    onChange={(event) => updateForm("subject", event.target.value)}
                    placeholder={t.subjectPlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={`text-sm font-black ${titleClass}`}>
                    {t.examDate}
                  </span>
                  <input
                    value={form.examDate}
                    onChange={(event) => updateForm("examDate", event.target.value)}
                    placeholder={t.datePlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.prepMode}
                </span>
                <select
                  value={form.prepMode}
                  onChange={(event) =>
                    updateForm("prepMode", event.target.value as PrepMode)
                  }
                  className={`h-12 rounded-2xl border px-4 text-sm font-semibold outline-none transition focus:ring-4 ${inputClass}`}
                >
                  {(["studyPlan", "flashcards", "practiceQuiz", "weakTopics"] as PrepMode[]).map(
                    (mode) => (
                      <option key={mode} value={mode}>
                        {t.modes[mode]}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.topics}
                </span>
                <textarea
                  value={form.topics}
                  onChange={(event) => updateForm("topics", event.target.value)}
                  placeholder={t.topicsPlaceholder}
                  rows={5}
                  className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.currentKnowledge}
                </span>
                <textarea
                  value={form.currentKnowledge}
                  onChange={(event) =>
                    updateForm("currentKnowledge", event.target.value)
                  }
                  placeholder={t.currentKnowledgePlaceholder}
                  rows={4}
                  className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={generatePreview}
                  className="h-12 rounded-2xl bg-blue-600 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  {t.generatePreview}
                </button>

                <button
                  type="button"
                  onClick={saveExam}
                  className={`h-12 rounded-2xl border text-sm font-black transition ${
                    isDark
                      ? "border-white/10 bg-slate-950/60 text-slate-100 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t.saveExam}
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  className={`h-12 rounded-2xl border text-sm font-black transition ${
                    isDark
                      ? "border-white/10 bg-slate-950/60 text-slate-100 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t.clearForm}
                </button>
              </div>
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>
              {t.previewTitle}
            </h2>

            <p className={`mt-2 text-sm leading-6 ${textClass}`}>
              {t.previewSubtitle}
            </p>

            {showPreview && (
              <div className="mt-6 grid gap-5">
                <div className={`rounded-3xl border p-5 ${accentCardClass}`}>
                  <h3 className={`text-lg font-black ${titleClass}`}>
                    {t.studyPlan}
                  </h3>

                  <div className="mt-4 grid gap-3">
                    {t.planItems.map((item, index) => (
                      <div key={item} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                          {index + 1}
                        </span>
                        <p className={`text-sm font-semibold leading-6 ${textClass}`}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className={`rounded-3xl border p-5 ${softCardClass}`}>
                    <h3 className={`text-lg font-black ${titleClass}`}>
                      {t.flashcards}
                    </h3>

                    <div className="mt-4 grid gap-3">
                      {t.flashcardItems.map((item) => (
                        <div
                          key={item.title}
                          className={`rounded-2xl border p-4 ${cardClass}`}
                        >
                          <p className="text-sm font-black text-blue-500">
                            {item.title}
                          </p>
                          <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-5 ${softCardClass}`}>
                    <h3 className={`text-lg font-black ${titleClass}`}>
                      {t.practiceQuiz}
                    </h3>

                    <div className="mt-4 grid gap-3">
                      {t.quizItems.map((item, index) => (
                        <div
                          key={item.question}
                          className={`rounded-2xl border p-4 ${cardClass}`}
                        >
                          <p className={`text-sm font-black ${titleClass}`}>
                            {index + 1}. {item.question}
                          </p>
                          <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div
                    className={`rounded-3xl border p-5 ${
                      isDark
                        ? "border-orange-400/20 bg-orange-400/10"
                        : "border-orange-100 bg-orange-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-black ${
                        isDark ? "text-orange-100" : "text-orange-900"
                      }`}
                    >
                      {t.weakTopics}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.weakTopicItems.map((topic) => (
                        <span
                          key={topic}
                          className={`rounded-full px-4 py-2 text-xs font-black ${
                            isDark
                              ? "bg-orange-400/10 text-orange-100"
                              : "bg-white text-orange-700 shadow-sm"
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-5 ${softCardClass}`}>
                    <h3 className={`text-lg font-black ${titleClass}`}>
                      {t.checklist}
                    </h3>

                    <div className="mt-4 grid gap-3">
                      {t.checklistItems.map((item) => (
                        <div key={item} className="flex gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-black text-emerald-500">
                            ✓
                          </span>
                          <p className={`text-sm leading-6 ${textClass}`}>
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.savedTitle}
              </h2>
              <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                {t.savedSubtitle}
              </p>
            </div>

            <p className={`text-xs font-semibold ${mutedClass}`}>
              {t.storedLocally}
            </p>
          </div>

          {savedExams.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {savedExams.map((exam) => (
                <div
                  key={exam.id}
                  className={`rounded-[1.75rem] border p-5 ${softCardClass}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className={`text-lg font-black ${titleClass}`}>
                        {exam.title}
                      </h3>
                      <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                        {exam.subject}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`h-10 rounded-2xl border px-4 text-sm font-black transition ${
                          isDark
                            ? "border-white/10 bg-slate-950/60 text-slate-100 hover:bg-white/10"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {t.open}
                      </button>

                      <button
                        type="button"
                        className="h-10 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        {t.continue}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className={`rounded-2xl border p-4 ${cardClass}`}>
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                      >
                        {t.examDate}
                      </p>
                      <p className={`mt-1 text-sm font-black ${titleClass}`}>
                        {exam.date}
                      </p>
                    </div>

                    <div className={`rounded-2xl border p-4 ${cardClass}`}>
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}
                      >
                        {t.progress}
                      </p>
                      <p className={`mt-1 text-sm font-black ${titleClass}`}>
                        {exam.progress}%
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
                      style={{ width: `${exam.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`mt-5 rounded-[1.75rem] border p-8 text-center ${softCardClass}`}>
              <h3 className={`text-xl font-black ${titleClass}`}>
                {t.noSavedTitle}
              </h3>
              <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedClass}`}>
                {t.noSavedSubtitle}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ExamPrepPage() {
  return (
    <AppShell>
      <ExamPrepContent />
    </AppShell>
  );
}