"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentTheme } from "@/lib/theme";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type DocumentStatus = "draft" | "generated" | "reviewed" | "archived";
type DocumentType =
  | "essay"
  | "report"
  | "summary"
  | "research_outline"
  | "presentation_outline"
  | "literature_review";
type Tone = "academic" | "simple" | "formal" | "student" | "concise";
type FilterKey = "all" | DocumentStatus;

type StudyDocument = {
  id: string;
  title: string;
  topic: string;
  type: DocumentType;
  language: Language;
  tone: Tone;
  status: DocumentStatus;
  draft: string;
  words: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  source: "local" | "demo";
};

type DocumentForm = {
  title: string;
  topic: string;
  type: DocumentType;
  language: Language;
  tone: Tone;
};

type TemplateKey =
  | "essay"
  | "research"
  | "literature"
  | "presentation"
  | "exam"
  | "diploma"
  | "assignment";

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
  edit: string;
  save: string;
  delete: string;
  generate: string;
  close: string;
  updated: string;
  words: string;
  progress: string;
  emptyTitle: string;
  emptySubtitle: string;
  resetFilters: string;
  assistantTitle: string;
  assistantSubtitle: string;
  recentTitle: string;
  recentSubtitle: string;
  typesTitle: string;
  localBanner: string;
  demoBanner: string;
  loading: string;
  saved: string;
  deleted: string;
  draftGenerated: string;
  titleRequired: string;
  topicRequired: string;
  formTitle: string;
  formSubtitle: string;
  titleLabel: string;
  titlePlaceholder: string;
  topicLabel: string;
  topicPlaceholder: string;
  languageLabel: string;
  toneLabel: string;
  draftLabel: string;
  draftPlaceholder: string;
  templatesTitle: string;
  templatesSubtitle: string;
  demoCopyHint: string;
  statuses: Record<DocumentStatus, string>;
  types: Record<DocumentType, string>;
  tones: Record<Tone, string>;
  languages: Record<Language, string>;
  templates: Record<TemplateKey, string>;
  templateTopics: Record<TemplateKey, string>;
};

const copy: Record<Language, DocumentsCopy> = {
  en: {
    pageBadge: "Documents workspace",
    pageTitle: "Documents",
    pageSubtitle:
      "Create, edit, and organize academic drafts locally while backend document generation is unavailable.",
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
    sectionSubtitle: "Manage essays, summaries, outlines, reports, and literature reviews.",
    edit: "Edit",
    save: "Save document",
    delete: "Delete",
    generate: "Generate draft",
    close: "Close",
    updated: "Updated",
    words: "words",
    progress: "Progress",
    emptyTitle: "No documents found",
    emptySubtitle: "Try another search, reset filters, or create a local draft.",
    resetFilters: "Reset filters",
    assistantTitle: "Templates",
    assistantSubtitle: "Start from a structured academic draft and edit it locally.",
    recentTitle: "Recent document",
    recentSubtitle: "Last updated document in your workspace.",
    typesTitle: "Document type",
    localBanner: "Saved locally because backend is unavailable.",
    demoBanner:
      "Showing demo documents. Create or save a draft to switch this page to local workspace mode.",
    loading: "Loading documents...",
    saved: "Document saved locally.",
    deleted: "Document deleted.",
    draftGenerated: "Draft generated locally.",
    titleRequired: "Title is required.",
    topicRequired: "Topic is required.",
    formTitle: "Document editor",
    formSubtitle: "Generate a safe local draft, then edit and save it in this browser.",
    titleLabel: "Title",
    titlePlaceholder: "e.g. AI ethics essay",
    topicLabel: "Topic",
    topicPlaceholder: "Describe the topic, task, or research question...",
    languageLabel: "Language",
    toneLabel: "Tone",
    draftLabel: "Draft",
    draftPlaceholder: "Generate or write your draft here...",
    templatesTitle: "Quick templates",
    templatesSubtitle: "Click a template to create a local draft.",
    demoCopyHint: "Demo documents can be edited and saved as a local copy.",
    statuses: {
      draft: "Draft",
      generated: "Generated",
      reviewed: "Reviewed",
      archived: "Archived",
    },
    types: {
      essay: "Essay",
      report: "Report",
      summary: "Summary",
      research_outline: "Research outline",
      presentation_outline: "Presentation outline",
      literature_review: "Literature review",
    },
    tones: {
      academic: "Academic",
      simple: "Simple",
      formal: "Formal",
      student: "Student-friendly",
      concise: "Concise",
    },
    languages: { en: "English", ru: "Russian", kz: "Kazakh" },
    templates: {
      essay: "Essay outline",
      research: "Research report",
      literature: "Literature review",
      presentation: "Presentation outline",
      exam: "Exam revision plan",
      diploma: "Diploma chapter outline",
      assignment: "Assignment solution plan",
    },
    templateTopics: {
      essay: "Argument, thesis, body paragraphs, and conclusion",
      research: "Research question, method, findings, and discussion",
      literature: "Key sources, themes, gaps, and synthesis",
      presentation: "Slides, speaker notes, and evidence",
      exam: "Topics, schedule, practice, and final revision",
      diploma: "Chapter goal, arguments, sources, and supervisor notes",
      assignment: "Requirements, solution steps, sources, and submission checklist",
    },
  },
  ru: {
    pageBadge: "Documents workspace",
    pageTitle: "Документы",
    pageSubtitle:
      "Создавай, редактируй и организуй учебные черновики локально, пока backend-генерация документов недоступна.",
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
    sectionSubtitle: "Управляй эссе, конспектами, планами, отчетами и обзорами литературы.",
    edit: "Изменить",
    save: "Сохранить документ",
    delete: "Удалить",
    generate: "Создать черновик",
    close: "Закрыть",
    updated: "Обновлено",
    words: "слов",
    progress: "Прогресс",
    emptyTitle: "Документы не найдены",
    emptySubtitle: "Попробуй другой поиск, сбрось фильтры или создай локальный черновик.",
    resetFilters: "Сбросить фильтры",
    assistantTitle: "Шаблоны",
    assistantSubtitle: "Начни со структурированного учебного черновика и отредактируй его локально.",
    recentTitle: "Недавний документ",
    recentSubtitle: "Последний обновленный документ в workspace.",
    typesTitle: "Тип документа",
    localBanner: "Сохранено локально, потому что backend недоступен.",
    demoBanner:
      "Показаны demo-документы. Создай или сохрани черновик, чтобы перейти в локальный workspace.",
    loading: "Загрузка документов...",
    saved: "Документ сохранен локально.",
    deleted: "Документ удален.",
    draftGenerated: "Черновик создан локально.",
    titleRequired: "Введите название.",
    topicRequired: "Введите тему.",
    formTitle: "Редактор документа",
    formSubtitle: "Создай безопасный локальный черновик, затем отредактируй и сохрани его в браузере.",
    titleLabel: "Название",
    titlePlaceholder: "например: Эссе об этике AI",
    topicLabel: "Тема",
    topicPlaceholder: "Опиши тему, задание или исследовательский вопрос...",
    languageLabel: "Язык",
    toneLabel: "Тон",
    draftLabel: "Черновик",
    draftPlaceholder: "Создай или напиши черновик здесь...",
    templatesTitle: "Быстрые шаблоны",
    templatesSubtitle: "Нажми на шаблон, чтобы создать локальный черновик.",
    demoCopyHint: "Demo-документ можно изменить и сохранить как локальную копию.",
    statuses: {
      draft: "Черновик",
      generated: "Сгенерировано",
      reviewed: "Проверено",
      archived: "Архив",
    },
    types: {
      essay: "Эссе",
      report: "Отчет",
      summary: "Конспект",
      research_outline: "План исследования",
      presentation_outline: "План презентации",
      literature_review: "Обзор литературы",
    },
    tones: {
      academic: "Академический",
      simple: "Простой",
      formal: "Формальный",
      student: "Студенческий",
      concise: "Краткий",
    },
    languages: { en: "Английский", ru: "Русский", kz: "Казахский" },
    templates: {
      essay: "План эссе",
      research: "Исследовательский отчет",
      literature: "Обзор литературы",
      presentation: "План презентации",
      exam: "План подготовки к экзамену",
      diploma: "План главы диплома",
      assignment: "План решения задания",
    },
    templateTopics: {
      essay: "Аргумент, тезис, основные абзацы и вывод",
      research: "Вопрос, метод, результаты и обсуждение",
      literature: "Источники, темы, пробелы и синтез",
      presentation: "Слайды, заметки докладчика и доказательства",
      exam: "Темы, расписание, практика и финальное повторение",
      diploma: "Цель главы, аргументы, источники и заметки руководителя",
      assignment: "Требования, шаги решения, источники и чеклист сдачи",
    },
  },
  kz: {
    pageBadge: "Documents workspace",
    pageTitle: "Құжаттар",
    pageSubtitle:
      "Backend құжат генерациясы қолжетімсіз кезде оқу черновиктерін жергілікті түрде жасаңыз, өңдеңіз және реттеңіз.",
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
    sectionSubtitle: "Эссе, конспект, жоспар, есеп және әдебиет шолуын басқарыңыз.",
    edit: "Өңдеу",
    save: "Құжатты сақтау",
    delete: "Жою",
    generate: "Черновик жасау",
    close: "Жабу",
    updated: "Жаңартылды",
    words: "сөз",
    progress: "Прогресс",
    emptyTitle: "Құжаттар табылмады",
    emptySubtitle: "Басқа іздеу қолданыңыз, фильтрді тазалаңыз немесе жергілікті черновик жасаңыз.",
    resetFilters: "Фильтрді тазалау",
    assistantTitle: "Шаблондар",
    assistantSubtitle: "Құрылымды оқу черновигінен бастап, оны жергілікті түрде өңдеңіз.",
    recentTitle: "Соңғы құжат",
    recentSubtitle: "Workspace ішіндегі соңғы жаңартылған құжат.",
    typesTitle: "Құжат түрі",
    localBanner: "Backend қолжетімсіз болғандықтан жергілікті түрде сақталды.",
    demoBanner:
      "Demo-құжаттар көрсетілді. Жергілікті workspace режиміне өту үшін черновик жасаңыз немесе сақтаңыз.",
    loading: "Құжаттар жүктелуде...",
    saved: "Құжат жергілікті сақталды.",
    deleted: "Құжат жойылды.",
    draftGenerated: "Черновик жергілікті жасалды.",
    titleRequired: "Атауын енгізіңіз.",
    topicRequired: "Тақырыпты енгізіңіз.",
    formTitle: "Құжат редакторы",
    formSubtitle: "Қауіпсіз жергілікті черновик жасап, оны браузерде өңдеп сақтаңыз.",
    titleLabel: "Атауы",
    titlePlaceholder: "мысалы: AI этикасы туралы эссе",
    topicLabel: "Тақырып",
    topicPlaceholder: "Тақырыпты, тапсырманы немесе зерттеу сұрағын сипаттаңыз...",
    languageLabel: "Тіл",
    toneLabel: "Тон",
    draftLabel: "Черновик",
    draftPlaceholder: "Черновикті осында жасаңыз немесе жазыңыз...",
    templatesTitle: "Жылдам шаблондар",
    templatesSubtitle: "Жергілікті черновик жасау үшін шаблонды басыңыз.",
    demoCopyHint: "Demo-құжатты өңдеп, жергілікті көшірме ретінде сақтауға болады.",
    statuses: {
      draft: "Черновик",
      generated: "Жасалды",
      reviewed: "Тексерілді",
      archived: "Архив",
    },
    types: {
      essay: "Эссе",
      report: "Есеп",
      summary: "Конспект",
      research_outline: "Зерттеу жоспары",
      presentation_outline: "Презентация жоспары",
      literature_review: "Әдебиет шолуы",
    },
    tones: {
      academic: "Академиялық",
      simple: "Қарапайым",
      formal: "Ресми",
      student: "Студентке ыңғайлы",
      concise: "Қысқа",
    },
    languages: { en: "Ағылшын", ru: "Орыс", kz: "Қазақ" },
    templates: {
      essay: "Эссе жоспары",
      research: "Зерттеу есебі",
      literature: "Әдебиет шолуы",
      presentation: "Презентация жоспары",
      exam: "Емтиханға дайындық жоспары",
      diploma: "Диплом тарауының жоспары",
      assignment: "Тапсырма шешу жоспары",
    },
    templateTopics: {
      essay: "Аргумент, тезис, негізгі бөлімдер және қорытынды",
      research: "Сұрақ, әдіс, нәтижелер және талқылау",
      literature: "Дереккөздер, тақырыптар, бос орындар және синтез",
      presentation: "Слайдтар, сөйлеу жазбалары және дәлелдер",
      exam: "Тақырыптар, кесте, практика және соңғы қайталау",
      diploma: "Тарау мақсаты, аргументтер, дереккөздер және жетекші ескертпелері",
      assignment: "Талаптар, шешу қадамдары, дереккөздер және тапсыру чеклисті",
    },
  },
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

const documentsStorageKey = "studyai-local-documents";

const emptyForm: DocumentForm = {
  title: "",
  topic: "",
  type: "essay",
  language: "ru",
  tone: "academic",
};

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "ru";

  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "en" || value === "ru" || value === "kz") return value;
  }

  return "ru";
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function formatDate(value: string, language: Language) {
  const time = new Date(value).getTime();

  if (!Number.isFinite(time)) return "";

  return new Intl.DateTimeFormat(
    language === "en" ? "en-US" : language === "kz" ? "kk-KZ" : "ru-RU",
    { day: "2-digit", month: "2-digit", year: "2-digit" }
  ).format(new Date(time));
}

function readLocalDocuments(): StudyDocument[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(documentsStorageKey) ?? "[]");

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const document = item as Partial<StudyDocument>;
        const draft = typeof document.draft === "string" ? document.draft : "";

        return {
          id: String(document.id ?? crypto.randomUUID()),
          title: String(document.title ?? "").trim() || "Untitled document",
          topic: String(document.topic ?? "").trim() || "No topic",
          type: document.type ?? "essay",
          language: document.language ?? "ru",
          tone: document.tone ?? "academic",
          status: document.status ?? "draft",
          draft,
          words: countWords(draft),
          progress: Math.min(100, Math.max(15, document.progress ?? 45)),
          createdAt: document.createdAt ?? new Date().toISOString(),
          updatedAt: document.updatedAt ?? new Date().toISOString(),
          source: "local",
        };
      });
  } catch {
    return [];
  }
}

function saveLocalDocuments(documents: StudyDocument[]) {
  window.localStorage.setItem(
    documentsStorageKey,
    JSON.stringify(documents.map((document) => ({ ...document, source: "local" })))
  );
}

function buildDraft(form: DocumentForm, t: DocumentsCopy) {
  const type = t.types[form.type];
  const tone = t.tones[form.tone];
  const topic = form.topic.trim();

  return [
    `${form.title.trim()}`,
    "",
    `Type: ${type}`,
    `Tone: ${tone}`,
    "",
    `1. Introduction`,
    `Define the academic context and explain why "${topic}" matters.`,
    "",
    `2. Main points`,
    `- Key concept or argument`,
    `- Evidence, examples, or sources`,
    `- Counterargument or limitation`,
    "",
    `3. Structure`,
    `Use clear paragraphs, citations, and transitions between ideas.`,
    "",
    `4. Conclusion`,
    `Summarize the result and connect it back to the original task.`,
  ].join("\n");
}

function createDemoDocuments(t: DocumentsCopy): StudyDocument[] {
  const now = new Date();

  return [
    {
      id: "demo-ai-ethics",
      title: t.templates.essay,
      topic: t.templateTopics.essay,
      type: "essay",
      language: "en",
      tone: "academic",
      status: "draft",
      draft: t.templateTopics.essay,
      words: 1240,
      progress: 58,
      createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000).toISOString(),
      source: "demo",
    },
    {
      id: "demo-research-report",
      title: t.templates.research,
      topic: t.templateTopics.research,
      type: "report",
      language: "en",
      tone: "formal",
      status: "generated",
      draft: t.templateTopics.research,
      words: 860,
      progress: 100,
      createdAt: new Date(now.getTime() - 86400000 * 7).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      source: "demo",
    },
    {
      id: "demo-literature-review",
      title: t.templates.literature,
      topic: t.templateTopics.literature,
      type: "literature_review",
      language: "en",
      tone: "academic",
      status: "reviewed",
      draft: t.templateTopics.literature,
      words: 2100,
      progress: 92,
      createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      source: "demo",
    },
  ];
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
  const [theme, setTheme] = useState<Theme>(() => getCurrentTheme());
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [localDocuments, setLocalDocuments] = useState<StudyDocument[]>([]);
  const [ready, setReady] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DocumentForm>(emptyForm);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const t = copy[language];
  const isDark = theme === "dark";
  const documents = localDocuments.length ? localDocuments : createDemoDocuments(t);
  const mode = localDocuments.length ? "local" : "demo";

  useEffect(() => {
    const storedLanguage = getStoredLanguage();

    setLanguage(storedLanguage);
    setTheme(getCurrentTheme());
    setForm((current) => ({ ...current, language: storedLanguage }));
    setLocalDocuments(readLocalDocuments());
    setReady(true);

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
      setTheme(getCurrentTheme());
      setLocalDocuments(readLocalDocuments());
    }

    window.addEventListener("studyai:language-change", handleLanguageChange);
    window.addEventListener("studyai:theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("studyai:language-change", handleLanguageChange);
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function persistDocuments(nextDocuments: StudyDocument[]) {
    setLocalDocuments(nextDocuments);
    saveLocalDocuments(nextDocuments);
  }

  function openCreateEditor(initial?: Partial<DocumentForm>) {
    setEditingId(null);
    setError("");
    setForm({ ...emptyForm, language, ...initial });
    setDraft("");
    setEditorOpen(true);
  }

  function openEditor(document: StudyDocument) {
    setEditingId(document.source === "local" ? document.id : null);
    setError("");
    setForm({
      title: document.title,
      topic: document.topic,
      type: document.type,
      language: document.language,
      tone: document.tone,
    });
    setDraft(document.draft);
    setEditorOpen(true);

    if (document.source === "demo") showToast(t.demoCopyHint);
  }

  function handleGenerateDraft() {
    if (!form.title.trim()) {
      setError(t.titleRequired);
      return;
    }

    if (!form.topic.trim()) {
      setError(t.topicRequired);
      return;
    }

    setDraft(buildDraft(form, t));
    setError("");
    showToast(t.draftGenerated);
  }

  function handleSaveDocument() {
    if (!form.title.trim()) {
      setError(t.titleRequired);
      return;
    }

    if (!form.topic.trim()) {
      setError(t.topicRequired);
      return;
    }

    const now = new Date().toISOString();
    const currentDraft = draft.trim() || buildDraft(form, t);
    const nextDocument: StudyDocument = {
      id: editingId ?? crypto.randomUUID(),
      title: form.title.trim(),
      topic: form.topic.trim(),
      type: form.type,
      language: form.language,
      tone: form.tone,
      status: currentDraft ? "generated" : "draft",
      draft: currentDraft,
      words: countWords(currentDraft),
      progress: currentDraft ? 80 : 35,
      createdAt:
        localDocuments.find((document) => document.id === editingId)?.createdAt ?? now,
      updatedAt: now,
      source: "local",
    };
    const nextDocuments = editingId
      ? localDocuments.map((document) =>
          document.id === editingId ? nextDocument : document
        )
      : [nextDocument, ...localDocuments];

    persistDocuments(nextDocuments);
    setEditingId(nextDocument.id);
    setEditorOpen(false);
    setError("");
    showToast(t.saved);
  }

  function handleDeleteDocument(id: string) {
    const nextDocuments = localDocuments.filter((document) => document.id !== id);

    persistDocuments(nextDocuments);
    showToast(t.deleted);
  }

  function createFromTemplate(template: TemplateKey) {
    const templateType: Record<TemplateKey, DocumentType> = {
      essay: "essay",
      research: "report",
      literature: "literature_review",
      presentation: "presentation_outline",
      exam: "summary",
      diploma: "research_outline",
      assignment: "research_outline",
    };
    const nextForm = {
      title: t.templates[template],
      topic: t.templateTopics[template],
      type: templateType[template],
      language,
      tone: "academic" as Tone,
    };
    const now = new Date().toISOString();
    const nextDraft = buildDraft(nextForm, t);
    const nextDocument: StudyDocument = {
      id: crypto.randomUUID(),
      ...nextForm,
      status: "generated",
      draft: nextDraft,
      words: countWords(nextDraft),
      progress: 75,
      createdAt: now,
      updatedAt: now,
      source: "local",
    };

    persistDocuments([nextDocument, ...localDocuments]);
    showToast(t.saved);
  }

  const stats = useMemo(
    () => ({
      total: documents.length,
      drafts: documents.filter((item) => item.status === "draft").length,
      generated: documents.filter((item) => item.status === "generated").length,
      reviewed: documents.filter((item) => item.status === "reviewed").length,
    }),
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesStatus =
        activeFilter === "all" || document.status === activeFilter;
      const searchableText = [
        document.title,
        document.topic,
        t.statuses[document.status],
        t.types[document.type],
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [activeFilter, documents, search, t]);

  const recentDocument = useMemo(
    () =>
      [...documents].sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      )[0],
    [documents]
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

            <button
              type="button"
              onClick={() => openCreateEditor()}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {t.createDocument}
            </button>
          </div>

          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-bold ${
              mode === "local"
                ? isDark
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
                : isDark
                ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                : "border-blue-100 bg-blue-50 text-blue-700"
            }`}
          >
            {mode === "local" ? t.localBanner : t.demoBanner}
          </div>
        </section>

        <section className="min-w-0 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [t.stats.total, stats.total],
              [t.stats.drafts, stats.drafts],
              [t.stats.generated, stats.generated],
              [t.stats.reviewed, stats.reviewed],
            ].map(([label, value]) => (
              <div key={label} className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
                <p className={`text-sm font-bold ${mutedClass}`}>{label}</p>
                <p className={`mt-3 text-3xl font-black ${titleClass}`}>{value}</p>
              </div>
            ))}
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
            {(["all", "draft", "generated", "reviewed", "archived"] as FilterKey[]).map(
              (filter) => {
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
              }
            )}
          </div>

          <div className="mt-6 grid gap-4">
            {!ready ? (
              <div className={`rounded-[1.75rem] border p-8 ${softCardClass}`}>
                <p className={`text-sm font-black ${mutedClass}`}>{t.loading}</p>
              </div>
            ) : filteredDocuments.length > 0 ? (
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
                        {document.title}
                      </h3>
                      <p className={`mt-1 line-clamp-2 text-sm font-semibold ${mutedClass}`}>
                        {document.topic}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditor(document)}
                        className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-black transition ${
                          isDark
                            ? "border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/10"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {t.edit}
                      </button>

                      {document.source === "local" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(document.id)}
                          className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-black text-white transition hover:bg-rose-700"
                        >
                          {t.delete}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className={`rounded-2xl border p-4 ${softCardClass}`}>
                      <p className={`text-xs font-bold uppercase ${mutedClass}`}>
                        {t.updated}
                      </p>
                      <p className={`mt-1 text-sm font-black ${titleClass}`}>
                        {formatDate(document.updatedAt, language)}
                      </p>
                    </div>
                    <div className={`rounded-2xl border p-4 ${softCardClass}`}>
                      <p className={`text-xs font-bold uppercase ${mutedClass}`}>
                        {t.words}
                      </p>
                      <p className={`mt-1 text-sm font-black ${titleClass}`}>
                        {document.words}
                      </p>
                    </div>
                    <div className={`rounded-2xl border p-4 ${softCardClass}`}>
                      <p className={`text-xs font-bold uppercase ${mutedClass}`}>
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
                <h3 className={`text-xl font-black ${titleClass}`}>{t.emptyTitle}</h3>
                <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedClass}`}>
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
                  {recentDocument.title}
                </h3>
                <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                  {recentDocument.topic}
                </p>
                <button
                  type="button"
                  onClick={() => openEditor(recentDocument)}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  {t.edit}
                </button>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-sm shadow-blue-600/20">
            <h2 className="text-xl font-black">{t.assistantTitle}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-blue-100">
              {t.assistantSubtitle}
            </p>

            <div className="mt-5 grid gap-2">
              {(Object.keys(t.templates) as TemplateKey[]).map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => createFromTemplate(template)}
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-white/15 px-4 py-2 text-sm font-black text-white transition hover:bg-white/25"
                >
                  {t.templates[template]}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/70 p-4 sm:items-center">
          <section
            className={`max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border p-5 shadow-2xl sm:p-6 ${cardClass}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className={`text-2xl font-black ${titleClass}`}>
                  {t.formTitle}
                </h2>
                <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                  {t.formSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-black ${
                  isDark
                    ? "border-white/10 text-slate-200 hover:bg-white/10"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.close}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200">
                {error}
              </div>
            )}

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">
                {t.titleLabel}
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder={t.titlePlaceholder}
                  className={`h-11 rounded-2xl border px-4 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <label className="grid gap-2 text-sm font-black">
                {t.typesTitle}
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as DocumentType,
                    }))
                  }
                  className={`h-11 rounded-2xl border px-4 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
                >
                  {(Object.keys(t.types) as DocumentType[]).map((type) => (
                    <option key={type} value={type}>
                      {t.types[type]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black lg:col-span-2">
                {t.topicLabel}
                <textarea
                  value={form.topic}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, topic: event.target.value }))
                  }
                  placeholder={t.topicPlaceholder}
                  rows={3}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <label className="grid gap-2 text-sm font-black">
                {t.languageLabel}
                <select
                  value={form.language}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      language: event.target.value as Language,
                    }))
                  }
                  className={`h-11 rounded-2xl border px-4 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
                >
                  {(Object.keys(t.languages) as Language[]).map((item) => (
                    <option key={item} value={item}>
                      {t.languages[item]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black">
                {t.toneLabel}
                <select
                  value={form.tone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      tone: event.target.value as Tone,
                    }))
                  }
                  className={`h-11 rounded-2xl border px-4 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
                >
                  {(Object.keys(t.tones) as Tone[]).map((tone) => (
                    <option key={tone} value={tone}>
                      {t.tones[tone]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black lg:col-span-2">
                {t.draftLabel}
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={t.draftPlaceholder}
                  rows={12}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium leading-6 outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleGenerateDraft}
                className={`inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-black transition ${
                  isDark
                    ? "border-white/10 text-slate-200 hover:bg-white/10"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.generate}
              </button>
              <button
                type="button"
                onClick={handleSaveDocument}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
              >
                {t.save}
              </button>
            </div>
          </section>
        </div>
      )}
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
