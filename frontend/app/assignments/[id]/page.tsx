"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import AppShell from "@/components/AppShell";
import {
  deleteAssignment,
  generateAssignmentHelp,
  getAssignment,
  updateAssignment,
  type Assignment,
  type AssignmentHelpType,
  type AssignmentPayload,
  type AssignmentPriority,
  type AssignmentStatus as ApiAssignmentStatus,
} from "@/lib/studyApi";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type UiStatus = "draft" | "inProgress" | "submitted";
type DisplayStatus = UiStatus | "overdue";
type Source = "api" | "local" | "demo";
type ChecklistId =
  | "requirements"
  | "outline"
  | "sources"
  | "draft"
  | "review"
  | "submit";

type LiveAssignment = {
  id: string;
  source: Source;
  title: string;
  subject: string;
  status: UiStatus;
  priority: AssignmentPriority;
  deadline: string | null;
  progress: number;
  description: string;
  studentAnswer: string;
  generatedHelp: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type WorkspaceState = {
  notes: string;
  checklist: Array<{ id: ChecklistId; done: boolean }>;
};

type Copy = {
  back: string;
  loadingTitle: string;
  loadingSubtitle: string;
  notFoundTitle: string;
  notFoundSubtitle: string;
  retry: string;
  status: string;
  priority: string;
  deadline: string;
  created: string;
  updated: string;
  progress: string;
  details: string;
  description: string;
  checklist: Record<ChecklistId, string>;
  checklistTitle: string;
  notesTitle: string;
  notesPlaceholder: string;
  saveNotes: string;
  notesSaved: string;
  aiTitle: string;
  aiSubtitle: string;
  generateHelp: string;
  generating: string;
  localPreview: string;
  helpEmpty: string;
  linkedFiles: string;
  filesPlaceholder: string;
  actions: string;
  edit: string;
  save: string;
  cancel: string;
  delete: string;
  deleting: string;
  markSubmitted: string;
  confirmDelete: string;
  backendUnavailable: string;
  localMode: string;
  apiMode: string;
  savedLocally: string;
  saved: string;
  deleted: string;
  title: string;
  subject: string;
  studentAnswer: string;
  low: string;
  medium: string;
  high: string;
  statuses: Record<DisplayStatus, string>;
};

const copy: Record<Language, Copy> = {
  en: {
    back: "Back to Assignments",
    loadingTitle: "Loading assignment",
    loadingSubtitle: "Checking API first, then local workspace data.",
    notFoundTitle: "Assignment not found",
    notFoundSubtitle: "This assignment may have been deleted or is unavailable.",
    retry: "Retry",
    status: "Status",
    priority: "Priority",
    deadline: "Deadline",
    created: "Created",
    updated: "Updated",
    progress: "Progress",
    details: "Assignment details",
    description: "Description",
    checklistTitle: "Study checklist",
    notesTitle: "Personal notes",
    notesPlaceholder: "Personal notes for this assignment",
    saveNotes: "Save notes",
    notesSaved: "Notes saved.",
    aiTitle: "AI Assignment Helper",
    aiSubtitle: "Generate a plan, key points, or feedback for this assignment.",
    generateHelp: "Generate help",
    generating: "Generating...",
    localPreview: "Backend is unavailable. Showing local preview response.",
    helpEmpty: "No generated help yet.",
    linkedFiles: "Linked files",
    filesPlaceholder:
      "File attachments will be connected after backend storage integration.",
    actions: "Actions",
    edit: "Edit assignment",
    save: "Save changes",
    cancel: "Cancel",
    delete: "Delete assignment",
    deleting: "Deleting...",
    markSubmitted: "Mark as submitted",
    confirmDelete: "Delete this assignment?",
    backendUnavailable: "Backend is unavailable. Local mode is active.",
    localMode: "Local workspace mode",
    apiMode: "Live API workspace",
    savedLocally: "Saved locally.",
    saved: "Assignment saved.",
    deleted: "Assignment deleted.",
    title: "Title",
    subject: "Subject",
    studentAnswer: "Student answer",
    low: "Low",
    medium: "Medium",
    high: "High",
    statuses: {
      draft: "Draft",
      inProgress: "In progress",
      submitted: "Submitted",
      overdue: "Overdue",
    },
    checklist: {
      requirements: "Understand assignment requirements",
      outline: "Prepare outline",
      sources: "Collect sources/materials",
      draft: "Write first draft",
      review: "Review and improve",
      submit: "Submit assignment",
    },
  },
  ru: {
    back: "Назад к заданиям",
    loadingTitle: "Загружаю задание",
    loadingSubtitle: "Сначала проверяю API, затем локальные данные workspace.",
    notFoundTitle: "Задание не найдено",
    notFoundSubtitle: "Задание могло быть удалено или сейчас недоступно.",
    retry: "Повторить",
    status: "Статус",
    priority: "Приоритет",
    deadline: "Дедлайн",
    created: "Создано",
    updated: "Обновлено",
    progress: "Прогресс",
    details: "Детали задания",
    description: "Описание",
    checklistTitle: "Учебный checklist",
    notesTitle: "Личные заметки",
    notesPlaceholder: "Личные заметки по этому заданию",
    saveNotes: "Сохранить заметки",
    notesSaved: "Заметки сохранены.",
    aiTitle: "AI-помощник по заданию",
    aiSubtitle: "Сгенерируй план, ключевые пункты или feedback по заданию.",
    generateHelp: "Сгенерировать помощь",
    generating: "Генерация...",
    localPreview: "Backend недоступен. Показан локальный preview-ответ.",
    helpEmpty: "Пока нет сгенерированной помощи.",
    linkedFiles: "Связанные файлы",
    filesPlaceholder:
      "Файлы будут подключены после интеграции backend storage.",
    actions: "Действия",
    edit: "Редактировать задание",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить задание",
    deleting: "Удаление...",
    markSubmitted: "Отметить отправленным",
    confirmDelete: "Удалить это задание?",
    backendUnavailable: "Backend недоступен. Включён локальный режим.",
    localMode: "Локальный workspace режим",
    apiMode: "Live API workspace",
    savedLocally: "Сохранено локально.",
    saved: "Задание сохранено.",
    deleted: "Задание удалено.",
    title: "Название",
    subject: "Предмет",
    studentAnswer: "Ответ студента",
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
    statuses: {
      draft: "Черновик",
      inProgress: "В работе",
      submitted: "Отправлено",
      overdue: "Просрочено",
    },
    checklist: {
      requirements: "Понять требования задания",
      outline: "Подготовить план",
      sources: "Собрать источники/материалы",
      draft: "Написать первый черновик",
      review: "Проверить и улучшить",
      submit: "Отправить задание",
    },
  },
  kz: {
    back: "Тапсырмаларға қайту",
    loadingTitle: "Тапсырма жүктелуде",
    loadingSubtitle: "Алдымен API, кейін local workspace деректері тексеріледі.",
    notFoundTitle: "Тапсырма табылмады",
    notFoundSubtitle: "Бұл тапсырма жойылған немесе қазір қолжетімсіз болуы мүмкін.",
    retry: "Қайталау",
    status: "Статус",
    priority: "Приоритет",
    deadline: "Дедлайн",
    created: "Құрылды",
    updated: "Жаңартылды",
    progress: "Прогресс",
    details: "Тапсырма мәліметтері",
    description: "Сипаттама",
    checklistTitle: "Оқу checklist",
    notesTitle: "Жеке жазбалар",
    notesPlaceholder: "Осы тапсырмаға арналған жеке жазбалар",
    saveNotes: "Жазбаларды сақтау",
    notesSaved: "Жазбалар сақталды.",
    aiTitle: "AI тапсырма көмекшісі",
    aiSubtitle: "Осы тапсырмаға жоспар, негізгі пункттер немесе feedback жасаңыз.",
    generateHelp: "Көмек жасау",
    generating: "Генерация...",
    localPreview: "Backend қолжетімсіз. Local preview жауабы көрсетілді.",
    helpEmpty: "Әзірге жасалған көмек жоқ.",
    linkedFiles: "Байланысты файлдар",
    filesPlaceholder:
      "Файлдар backend storage интеграциясынан кейін қосылады.",
    actions: "Әрекеттер",
    edit: "Тапсырманы өзгерту",
    save: "Сақтау",
    cancel: "Болдырмау",
    delete: "Тапсырманы жою",
    deleting: "Жойылуда...",
    markSubmitted: "Жіберілді деп белгілеу",
    confirmDelete: "Бұл тапсырманы жою керек пе?",
    backendUnavailable: "Backend қолжетімсіз. Local режим қосылды.",
    localMode: "Local workspace режимі",
    apiMode: "Live API workspace",
    savedLocally: "Локалды сақталды.",
    saved: "Тапсырма сақталды.",
    deleted: "Тапсырма жойылды.",
    title: "Атауы",
    subject: "Пән",
    studentAnswer: "Студент жауабы",
    low: "Төмен",
    medium: "Орташа",
    high: "Жоғары",
    statuses: {
      draft: "Черновик",
      inProgress: "Жұмыста",
      submitted: "Жіберілді",
      overdue: "Мерзімі өтті",
    },
    checklist: {
      requirements: "Тапсырма талаптарын түсіну",
      outline: "Жоспар дайындау",
      sources: "Дереккөздер/материалдар жинау",
      draft: "Алғашқы черновик жазу",
      review: "Тексеру және жақсарту",
      submit: "Тапсырманы жіберу",
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
const assignmentsStorageKey = "studyai-local-assignments";
const workspaceStoragePrefix = "studyai-assignment-workspace";
const checklistIds: ChecklistId[] = [
  "requirements",
  "outline",
  "sources",
  "draft",
  "review",
  "submit",
];

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "ru";
  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);
    if (value === "en" || value === "ru" || value === "kz") return value;
  }
  return "ru";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  for (const key of themeStorageKeys) {
    const value = window.localStorage.getItem(key);
    if (value === "light" || value === "dark") return value;
  }
  return "dark";
}

function getFutureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getDefaultChecklist() {
  return checklistIds.map((id) => ({ id, done: false }));
}

function apiStatusToUi(status: ApiAssignmentStatus): UiStatus {
  return status === "in_progress" ? "inProgress" : status;
}

function uiStatusToApi(status: UiStatus): ApiAssignmentStatus {
  return status === "inProgress" ? "in_progress" : status;
}

function assignmentFromApi(assignment: Assignment): LiveAssignment {
  return {
    id: assignment.id,
    source: "api",
    title: assignment.title,
    subject: assignment.subject,
    status: apiStatusToUi(assignment.status),
    priority: assignment.priority,
    deadline: assignment.deadline,
    progress: assignment.progress,
    description: assignment.description,
    studentAnswer: assignment.student_answer ?? "",
    generatedHelp:
      assignment.generated_solution_plan ??
      assignment.generated_key_points ??
      assignment.ai_feedback ??
      "",
    createdAt: assignment.created_at,
    updatedAt: assignment.updated_at,
  };
}

function getDemoAssignments(): LiveAssignment[] {
  const now = new Date().toISOString();
  return [
    {
      id: "demo-data-structures",
      source: "demo",
      title: "Data Structures Assignment",
      subject: "Computer Science",
      status: "inProgress",
      priority: "high",
      deadline: getFutureDate(2),
      progress: 68,
      description: "Implement binary tree operations and explain complexity.",
      studentAnswer: "",
      generatedHelp: "",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "demo-research-paper",
      source: "demo",
      title: "Research Paper Draft",
      subject: "Academic Writing",
      status: "draft",
      priority: "medium",
      deadline: getFutureDate(5),
      progress: 42,
      description: "Prepare an outline and first draft for the research paper.",
      studentAnswer: "",
      generatedHelp: "",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function readLocalAssignments() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(assignmentsStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LiveAssignment[];
    return parsed.map((assignment) => ({ ...assignment, source: "local" as const }));
  } catch {
    return [];
  }
}

function saveLocalAssignment(assignment: LiveAssignment) {
  if (typeof window === "undefined") return;
  const current = readLocalAssignments().filter((item) => item.id !== assignment.id);
  const next = [{ ...assignment, source: "local" as const }, ...current];
  window.localStorage.setItem(assignmentsStorageKey, JSON.stringify(next));
}

function deleteLocalAssignment(id: string) {
  if (typeof window === "undefined") return;
  const next = readLocalAssignments().filter((item) => item.id !== id);
  window.localStorage.setItem(assignmentsStorageKey, JSON.stringify(next));
}

function readWorkspace(id: string): WorkspaceState {
  if (typeof window === "undefined") {
    return { notes: "", checklist: getDefaultChecklist() };
  }

  try {
    const raw = window.localStorage.getItem(`${workspaceStoragePrefix}-${id}`);
    if (!raw) return { notes: "", checklist: getDefaultChecklist() };
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
    return {
      notes: parsed.notes ?? "",
      checklist:
        parsed.checklist?.filter((item) =>
          checklistIds.includes(item.id as ChecklistId)
        ) ?? getDefaultChecklist(),
    };
  } catch {
    return { notes: "", checklist: getDefaultChecklist() };
  }
}

function saveWorkspace(id: string, workspace: WorkspaceState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    `${workspaceStoragePrefix}-${id}`,
    JSON.stringify(workspace)
  );
}

function getDisplayStatus(assignment: LiveAssignment): DisplayStatus {
  if (
    assignment.status !== "submitted" &&
    assignment.deadline &&
    new Date(`${assignment.deadline}T23:59:59`).getTime() < Date.now()
  ) {
    return "overdue";
  }
  return assignment.status;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("de-DE");
}

function payloadFromAssignment(assignment: LiveAssignment): Partial<AssignmentPayload> {
  return {
    title: assignment.title,
    subject: assignment.subject,
    help_type: "solution_plan",
    deadline: assignment.deadline,
    priority: assignment.priority,
    status: uiStatusToApi(assignment.status),
    progress: assignment.progress,
    description: assignment.description,
    student_answer: assignment.studentAnswer || null,
  };
}

function AssignmentDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const assignmentId = decodeURIComponent(params.id);

  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");
  const [assignment, setAssignment] = useState<LiveAssignment | null>(null);
  const [draft, setDraft] = useState<LiveAssignment | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    notes: "",
    checklist: getDefaultChecklist(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const t = copy[language];
  const isDark = theme === "dark";

  const loadAssignment = useCallback(async (showMessage = false) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const apiAssignment = await getAssignment(assignmentId);
      const nextAssignment = assignmentFromApi(apiAssignment);
      setAssignment(nextAssignment);
      setDraft(nextAssignment);
      if (showMessage) setMessage(t.apiMode);
    } catch (loadError) {
      const localAssignment = readLocalAssignments().find(
        (item) => item.id === assignmentId
      );
      const demoAssignment = getDemoAssignments().find(
        (item) => item.id === assignmentId
      );
      const fallbackAssignment = localAssignment ?? demoAssignment ?? null;

      setAssignment(fallbackAssignment);
      setDraft(fallbackAssignment);
      setError(loadError instanceof Error ? loadError.message : t.backendUnavailable);

      if (fallbackAssignment) {
        setMessage(t.backendUnavailable);
      }
    } finally {
      setWorkspace(readWorkspace(assignmentId));
      setLoading(false);
    }
  }, [assignmentId, t.apiMode, t.backendUnavailable]);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getStoredTheme());
    loadAssignment();

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<Language>;
      if (["en", "ru", "kz"].includes(customEvent.detail)) {
        setLanguage(customEvent.detail);
      }
    }

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<Theme>;
      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setTheme(customEvent.detail);
      }
    }

    window.addEventListener("studyai:language-change", handleLanguageChange);
    window.addEventListener("studyai:theme-change", handleThemeChange);

    return () => {
      window.removeEventListener(
        "studyai:language-change",
        handleLanguageChange
      );
      window.removeEventListener("studyai:theme-change", handleThemeChange);
    };
  }, [assignmentId, loadAssignment]);

  const displayStatus = assignment ? getDisplayStatus(assignment) : "draft";
  const completedChecklist = workspace.checklist.filter((item) => item.done).length;
  const checklistProgress = Math.round(
    (completedChecklist / workspace.checklist.length) * 100
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

  async function saveAssignment(nextAssignment: LiveAssignment) {
    setSaving(true);
    setError("");

    try {
      if (nextAssignment.source === "api") {
        const updated = await updateAssignment(
          nextAssignment.id,
          payloadFromAssignment(nextAssignment)
        );
        const normalized = assignmentFromApi(updated);
        setAssignment(normalized);
        setDraft(normalized);
      } else {
        saveLocalAssignment(nextAssignment);
        setAssignment({ ...nextAssignment, source: "local" });
        setDraft({ ...nextAssignment, source: "local" });
      }

      setEditing(false);
      setMessage(nextAssignment.source === "api" ? t.saved : t.savedLocally);
    } catch {
      const localAssignment = { ...nextAssignment, source: "local" as const };
      saveLocalAssignment(localAssignment);
      setAssignment(localAssignment);
      setDraft(localAssignment);
      setEditing(false);
      setMessage(t.savedLocally);
    } finally {
      setSaving(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    await saveAssignment({
      ...draft,
      updatedAt: new Date().toISOString(),
    });
  }

  async function handleQuickUpdate(update: Partial<LiveAssignment>) {
    if (!assignment) return;
    await saveAssignment({
      ...assignment,
      ...update,
      updatedAt: new Date().toISOString(),
    });
  }

  async function handleDelete() {
    if (!assignment || !window.confirm(t.confirmDelete)) return;
    setDeleting(true);

    try {
      if (assignment.source === "api") {
        await deleteAssignment(assignment.id);
      } else {
        deleteLocalAssignment(assignment.id);
      }
      setMessage(t.deleted);
      router.push("/assignments");
    } catch {
      deleteLocalAssignment(assignment.id);
      setMessage(t.deleted);
      router.push("/assignments");
    } finally {
      setDeleting(false);
    }
  }

  async function handleGenerateHelp() {
    if (!assignment) return;
    setGenerating(true);
    setError("");

    try {
      const action: AssignmentHelpType = "solution_plan";
      const response =
        assignment.source === "api"
          ? await generateAssignmentHelp(assignment.id, action)
          : null;
      const result =
        response?.result ??
        [
          t.localPreview,
          "",
          `1. ${assignment.title}: clarify requirements and expected output.`,
          "2. Prepare outline, examples, and sources.",
          "3. Write the first draft, then review structure and citations.",
        ].join("\n");
      const nextAssignment = { ...assignment, generatedHelp: result };
      setAssignment(nextAssignment);
      setDraft(nextAssignment);
      if (assignment.source !== "api") saveLocalAssignment(nextAssignment);
    } catch {
      const result = [
        t.localPreview,
        "",
        `1. ${assignment.title}: clarify requirements and expected output.`,
        "2. Prepare outline, examples, and sources.",
        "3. Write the first draft, then review structure and citations.",
      ].join("\n");
      const nextAssignment = {
        ...assignment,
        source: "local" as const,
        generatedHelp: result,
      };
      setAssignment(nextAssignment);
      setDraft(nextAssignment);
      saveLocalAssignment(nextAssignment);
      setMessage(t.localPreview);
    } finally {
      setGenerating(false);
    }
  }

  function updateWorkspace(nextWorkspace: WorkspaceState, notify = false) {
    setWorkspace(nextWorkspace);
    saveWorkspace(assignmentId, nextWorkspace);
    if (notify) setMessage(t.notesSaved);
  }

  if (loading) {
    return (
      <div className={pageClass}>
        <div className={`mx-auto max-w-5xl rounded-[2rem] border p-8 ${cardClass}`}>
          <div className="h-8 w-56 animate-pulse rounded-full bg-blue-500/20" />
          <div className="mt-8 h-48 animate-pulse rounded-[1.75rem] bg-blue-500/10" />
          <p className={`mt-5 text-sm font-bold ${mutedClass}`}>
            {t.loadingTitle} - {t.loadingSubtitle}
          </p>
        </div>
      </div>
    );
  }

  if (!assignment || !draft) {
    return (
      <div className={pageClass}>
        <div className={`mx-auto max-w-3xl rounded-[2rem] border p-8 text-center ${cardClass}`}>
          <h1 className={`text-2xl font-black ${titleClass}`}>{t.notFoundTitle}</h1>
          <p className={`mt-3 text-sm leading-6 ${mutedClass}`}>{t.notFoundSubtitle}</p>
          {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => loadAssignment(true)}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white"
            >
              {t.retry}
            </button>
            <Link
              href="/assignments"
              className={`inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-black ${inputClass}`}
            >
              {t.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClass}>
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className={`rounded-[2rem] border p-5 sm:p-6 xl:col-span-2 ${cardClass}`}>
          <Link href="/assignments" className="text-sm font-black text-blue-600">
            ← {t.back}
          </Link>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">
                  {t.status}: {t.statuses[displayStatus]}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"
                }`}>
                  {t.priority}: {t[assignment.priority]}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"
                }`}>
                  {t.deadline}: {formatDate(assignment.deadline)}
                </span>
              </div>
              <h1 className={`mt-5 text-3xl font-black tracking-tight sm:text-4xl ${titleClass}`}>
                {assignment.title}
              </h1>
              <p className={`mt-2 text-sm font-bold ${mutedClass}`}>{assignment.subject}</p>
            </div>
            <div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
              assignment.source === "api"
                ? isDark
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
                : isDark
                  ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
                  : "border-amber-100 bg-amber-50 text-amber-800"
            }`}>
              {assignment.source === "api" ? t.apiMode : t.localMode}
            </div>
          </div>
          {message && (
            <p className="mt-4 rounded-2xl bg-blue-600/10 px-4 py-3 text-sm font-bold text-blue-500">
              {message}
            </p>
          )}
        </section>

        <main className="grid gap-6">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.description}</h2>
            <p className={`mt-3 whitespace-pre-line text-sm leading-7 ${textClass}`}>
              {assignment.description || "-"}
            </p>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.checklistTitle}</h2>
            <div className="mt-5 grid gap-3">
              {workspace.checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 ${softCardClass}`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(event) =>
                      updateWorkspace({
                        ...workspace,
                        checklist: workspace.checklist.map((checkItem) =>
                          checkItem.id === item.id
                            ? { ...checkItem, done: event.target.checked }
                            : checkItem
                        ),
                      })
                    }
                    className="h-5 w-5"
                  />
                  <span className={`text-sm font-bold ${titleClass}`}>
                    {t.checklist[item.id]}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.notesTitle}</h2>
            <textarea
              value={workspace.notes}
              onChange={(event) =>
                setWorkspace({ ...workspace, notes: event.target.value })
              }
              placeholder={t.notesPlaceholder}
              rows={6}
              className={`mt-4 w-full rounded-2xl border px-4 py-3 text-sm outline-none ${inputClass}`}
            />
            <button
              type="button"
              onClick={() => updateWorkspace(workspace, true)}
              className="mt-4 h-11 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white"
            >
              {t.saveNotes}
            </button>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.aiTitle}</h2>
            <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>{t.aiSubtitle}</p>
            <button
              type="button"
              onClick={handleGenerateHelp}
              disabled={generating}
              className="mt-4 h-11 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? t.generating : t.generateHelp}
            </button>
            <div className={`mt-4 whitespace-pre-line rounded-2xl border p-4 text-sm leading-7 ${softCardClass}`}>
              {assignment.generatedHelp || t.helpEmpty}
            </div>
          </section>
        </main>

        <aside className="grid gap-6">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.details}</h2>
            <div className="mt-5 grid gap-3 text-sm">
              {[
                [t.status, t.statuses[displayStatus]],
                [t.priority, t[assignment.priority]],
                [t.deadline, formatDate(assignment.deadline)],
                [t.created, formatDate(assignment.createdAt)],
                [t.updated, formatDate(assignment.updatedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className={mutedClass}>{label}</span>
                  <span className={`text-right font-black ${titleClass}`}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.progress}</h2>
            <p className={`mt-4 text-4xl font-black ${titleClass}`}>
              {assignment.progress}%
            </p>
            <div className={`mt-4 h-3 overflow-hidden rounded-full ${isDark ? "bg-slate-950" : "bg-slate-200"}`}>
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${assignment.progress}%` }} />
            </div>
            <p className={`mt-3 text-sm font-bold ${mutedClass}`}>
              {completedChecklist}/{workspace.checklist.length} checklist - {checklistProgress}%
            </p>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.actions}</h2>
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                className={`h-11 rounded-2xl border px-4 text-sm font-black ${inputClass}`}
              >
                {editing ? t.cancel : t.edit}
              </button>
              <button
                type="button"
                onClick={() => handleQuickUpdate({ status: "submitted", progress: 100 })}
                className="h-11 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white"
              >
                {t.markSubmitted}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-11 rounded-2xl border border-red-500/20 px-4 text-sm font-black text-red-500 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? t.deleting : t.delete}
              </button>
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-black ${titleClass}`}>{t.linkedFiles}</h2>
            <p className={`mt-3 text-sm leading-6 ${mutedClass}`}>{t.filesPlaceholder}</p>
          </section>
        </aside>

        {editing && (
          <section className={`rounded-[2rem] border p-5 sm:p-6 xl:col-span-2 ${cardClass}`}>
            <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.title}</span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.subject}</span>
                <input
                  value={draft.subject}
                  onChange={(event) => setDraft({ ...draft, subject: event.target.value })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.deadline}</span>
                <input
                  type="date"
                  value={draft.deadline ?? ""}
                  onChange={(event) => setDraft({ ...draft, deadline: event.target.value || null })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.status}</span>
                <select
                  value={draft.status}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value as UiStatus })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                >
                  <option value="draft">{t.statuses.draft}</option>
                  <option value="inProgress">{t.statuses.inProgress}</option>
                  <option value="submitted">{t.statuses.submitted}</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.priority}</span>
                <select
                  value={draft.priority}
                  onChange={(event) => setDraft({ ...draft, priority: event.target.value as AssignmentPriority })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                >
                  <option value="low">{t.low}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="high">{t.high}</option>
                </select>
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.progress}: {draft.progress}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={draft.progress}
                  onChange={(event) => setDraft({ ...draft, progress: Number(event.target.value) })}
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.description}</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  rows={4}
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.studentAnswer}</span>
                <textarea
                  value={draft.studentAnswer}
                  onChange={(event) => setDraft({ ...draft, studentAnswer: event.target.value })}
                  rows={4}
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none ${inputClass}`}
                />
              </label>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(assignment);
                    setEditing(false);
                  }}
                  className={`h-11 rounded-2xl border px-5 text-sm font-black ${inputClass}`}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? `${t.save}...` : t.save}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default function AssignmentDetailPage() {
  return (
    <AppShell>
      <AssignmentDetailContent />
    </AppShell>
  );
}
