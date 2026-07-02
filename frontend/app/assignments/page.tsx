"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentTheme } from "@/lib/theme";
import {
  createAssignment,
  deleteAssignment,
  generateAssignmentHelp,
  listAssignments,
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
type FilterKey = "all" | DisplayStatus;
type DataMode = "api" | "local" | "demo";
type ToastType = "success" | "error" | "info" | "warning";

type LiveAssignment = {
  id: string;
  source: "api" | "local" | "demo";
  title: string;
  subject: string;
  status: UiStatus;
  priority: AssignmentPriority;
  deadline: string | null;
  progress: number;
  description: string;
  studentAnswer: string;
  generatedHelp: string;
  updatedAt: string;
};

type AssignmentForm = {
  title: string;
  subject: string;
  status: UiStatus;
  priority: AssignmentPriority;
  deadline: string;
  progress: string;
  description: string;
  studentAnswer: string;
};

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type Copy = {
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
  edit: string;
  delete: string;
  cancel: string;
  save: string;
  create: string;
  saving: string;
  deleting: string;
  generating: string;
  generateHelp: string;
  due: string;
  progress: string;
  priority: string;
  subject: string;
  status: string;
  description: string;
  answer: string;
  title: string;
  deadline: string;
  low: string;
  medium: string;
  high: string;
  emptyTitle: string;
  emptySubtitle: string;
  resetFilters: string;
  loadingTitle: string;
  loadingSubtitle: string;
  errorTitle: string;
  retry: string;
  upcomingTitle: string;
  upcomingSubtitle: string;
  aiHelperTitle: string;
  aiHelperSubtitle: string;
  localBanner: string;
  demoBanner: string;
  apiBanner: string;
  formCreateTitle: string;
  formEditTitle: string;
  confirmDelete: string;
  helpTitle: string;
  helpEmpty: string;
  openAiTutor: string;
  toasts: {
    loadedLocal: string;
    backendUnavailable: string;
    created: string;
    saved: string;
    deleted: string;
    generated: string;
    savedLocally: string;
  };
  statuses: Record<DisplayStatus, string>;
};

const copy: Record<Language, Copy> = {
  en: {
    pageBadge: "Assignments workspace",
    pageTitle: "Assignments",
    pageSubtitle:
      "Create, track, update, and complete your academic tasks with API or local fallback.",
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
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save changes",
    create: "Create",
    saving: "Saving...",
    deleting: "Deleting...",
    generating: "Generating...",
    generateHelp: "Generate help",
    due: "Due",
    progress: "Progress",
    priority: "Priority",
    subject: "Subject",
    status: "Status",
    description: "Description",
    answer: "Student answer",
    title: "Title",
    deadline: "Deadline",
    low: "Low",
    medium: "Medium",
    high: "High",
    emptyTitle: "No assignments found",
    emptySubtitle:
      "Create a new assignment or reset filters to see everything again.",
    resetFilters: "Reset filters",
    loadingTitle: "Loading assignments",
    loadingSubtitle: "Checking API first, then local fallback.",
    errorTitle: "Assignments could not be loaded from the API",
    retry: "Retry",
    upcomingTitle: "Upcoming focus",
    upcomingSubtitle: "The next task that needs your attention.",
    aiHelperTitle: "AI assignment helper",
    aiHelperSubtitle:
      "Generate a plan, key points, or feedback without leaving this page.",
    localBanner:
      "Backend is unavailable. Changes are saved locally in this browser.",
    demoBanner:
      "Demo data is shown because the API is unavailable and no local assignments exist yet.",
    apiBanner: "Live API data is connected.",
    formCreateTitle: "Create assignment",
    formEditTitle: "Edit assignment",
    confirmDelete: "Delete this assignment?",
    helpTitle: "Generated help",
    helpEmpty: "No generated help yet.",
    openAiTutor: "Open AI Tutor",
    toasts: {
      loadedLocal: "Loaded local assignments.",
      backendUnavailable: "Backend unavailable. Local mode is active.",
      created: "Assignment created.",
      saved: "Assignment saved.",
      deleted: "Assignment deleted.",
      generated: "Help generated.",
      savedLocally: "Saved locally.",
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
      "Создавай, редактируй, отслеживай и завершай учебные задания через API или локальный fallback.",
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
    edit: "Редактировать",
    delete: "Удалить",
    cancel: "Отмена",
    save: "Сохранить",
    create: "Создать",
    saving: "Сохранение...",
    deleting: "Удаление...",
    generating: "Генерация...",
    generateHelp: "Сгенерировать помощь",
    due: "Срок",
    progress: "Прогресс",
    priority: "Приоритет",
    subject: "Предмет",
    status: "Статус",
    description: "Описание",
    answer: "Ответ студента",
    title: "Название",
    deadline: "Дедлайн",
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
    emptyTitle: "Задания не найдены",
    emptySubtitle:
      "Создай новое задание или сбрось фильтры, чтобы снова увидеть весь список.",
    resetFilters: "Сбросить фильтры",
    loadingTitle: "Загружаю задания",
    loadingSubtitle: "Сначала проверяю API, затем локальный fallback.",
    errorTitle: "Не удалось загрузить задания из API",
    retry: "Повторить",
    upcomingTitle: "Ближайший фокус",
    upcomingSubtitle: "Следующее задание, которое требует внимания.",
    aiHelperTitle: "AI-помощник по заданиям",
    aiHelperSubtitle:
      "Сгенерируй план, ключевые пункты или feedback прямо на этой странице.",
    localBanner:
      "Backend недоступен. Изменения сохраняются локально в этом браузере.",
    demoBanner:
      "Показаны demo-данные, потому что API недоступен и локальных заданий пока нет.",
    apiBanner: "Подключены живые данные из API.",
    formCreateTitle: "Создать задание",
    formEditTitle: "Редактировать задание",
    confirmDelete: "Удалить это задание?",
    helpTitle: "Сгенерированная помощь",
    helpEmpty: "Пока нет сгенерированной помощи.",
    openAiTutor: "Открыть AI Tutor",
    toasts: {
      loadedLocal: "Загружены локальные задания.",
      backendUnavailable: "Backend недоступен. Включён локальный режим.",
      created: "Задание создано.",
      saved: "Задание сохранено.",
      deleted: "Задание удалено.",
      generated: "Помощь сгенерирована.",
      savedLocally: "Сохранено локально.",
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
      "Оқу тапсырмаларын API немесе local fallback арқылы құрыңыз, өзгертіңіз және бақылаңыз.",
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
    edit: "Өзгерту",
    delete: "Жою",
    cancel: "Болдырмау",
    save: "Сақтау",
    create: "Құру",
    saving: "Сақталуда...",
    deleting: "Жойылуда...",
    generating: "Генерация...",
    generateHelp: "Көмек жасау",
    due: "Мерзім",
    progress: "Прогресс",
    priority: "Приоритет",
    subject: "Пән",
    status: "Статус",
    description: "Сипаттама",
    answer: "Студент жауабы",
    title: "Атауы",
    deadline: "Дедлайн",
    low: "Төмен",
    medium: "Орташа",
    high: "Жоғары",
    emptyTitle: "Тапсырмалар табылмады",
    emptySubtitle:
      "Жаңа тапсырма құрыңыз немесе барлық тізімді көру үшін фильтрді тазалаңыз.",
    resetFilters: "Фильтрді тазалау",
    loadingTitle: "Тапсырмалар жүктелуде",
    loadingSubtitle: "Алдымен API, кейін local fallback тексеріледі.",
    errorTitle: "API арқылы тапсырмаларды жүктеу мүмкін болмады",
    retry: "Қайталау",
    upcomingTitle: "Жақын фокус",
    upcomingSubtitle: "Назар аударуды қажет ететін келесі тапсырма.",
    aiHelperTitle: "AI тапсырма көмекшісі",
    aiHelperSubtitle:
      "Осы бетте жоспар, негізгі пункттер немесе feedback жасаңыз.",
    localBanner:
      "Backend қолжетімсіз. Өзгерістер осы браузерде локалды сақталады.",
    demoBanner:
      "API қолжетімсіз және локалды тапсырмалар жоқ болғандықтан demo-деректер көрсетілді.",
    apiBanner: "API арқылы live деректер қосылған.",
    formCreateTitle: "Тапсырма құру",
    formEditTitle: "Тапсырманы өзгерту",
    confirmDelete: "Бұл тапсырманы жою керек пе?",
    helpTitle: "Жасалған көмек",
    helpEmpty: "Әзірге жасалған көмек жоқ.",
    openAiTutor: "AI Tutor ашу",
    toasts: {
      loadedLocal: "Локалды тапсырмалар жүктелді.",
      backendUnavailable: "Backend қолжетімсіз. Local режим қосылды.",
      created: "Тапсырма құрылды.",
      saved: "Тапсырма сақталды.",
      deleted: "Тапсырма жойылды.",
      generated: "Көмек жасалды.",
      savedLocally: "Локалды сақталды.",
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
const localStorageKey = "studyai-local-assignments";

const emptyForm: AssignmentForm = {
  title: "",
  subject: "",
  status: "draft",
  priority: "medium",
  deadline: "",
  progress: "0",
  description: "",
  studentAnswer: "",
};

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "ru";

  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "en" || value === "ru" || value === "kz") return value;
  }

  return "ru";
}

function getFutureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
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
      updatedAt: now,
    },
    {
      id: "demo-economics",
      source: "demo",
      title: "Market Analysis Essay",
      subject: "Economics",
      status: "submitted",
      priority: "low",
      deadline: getFutureDate(-2),
      progress: 100,
      description: "Analyze market structure and pricing strategy.",
      studentAnswer: "",
      generatedHelp: "",
      updatedAt: now,
    },
  ];
}

function readLocalAssignments() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(localStorageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as LiveAssignment[];
    return parsed.map((assignment) => ({ ...assignment, source: "local" as const }));
  } catch {
    return [];
  }
}

function saveLocalAssignments(assignments: LiveAssignment[]) {
  if (typeof window === "undefined") return;

  const localAssignments = assignments
    .filter((assignment) => assignment.source !== "demo")
    .map((assignment) => ({ ...assignment, source: "local" as const }));

  window.localStorage.setItem(localStorageKey, JSON.stringify(localAssignments));
}

function apiStatusToUi(status: ApiAssignmentStatus): UiStatus {
  if (status === "in_progress") return "inProgress";
  return status;
}

function uiStatusToApi(status: UiStatus): ApiAssignmentStatus {
  if (status === "inProgress") return "in_progress";
  return status;
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
    updatedAt: assignment.updated_at,
  };
}

function payloadFromForm(form: AssignmentForm): AssignmentPayload {
  return {
    title: form.title.trim(),
    subject: form.subject.trim(),
    help_type: "solution_plan",
    deadline: form.deadline || null,
    priority: form.priority,
    status: uiStatusToApi(form.status),
    progress: Number(form.progress) || 0,
    description: form.description.trim(),
    student_answer: form.studentAnswer.trim() || null,
  };
}

function formFromAssignment(assignment: LiveAssignment): AssignmentForm {
  return {
    title: assignment.title,
    subject: assignment.subject,
    status: assignment.status,
    priority: assignment.priority,
    deadline: assignment.deadline ?? "",
    progress: String(assignment.progress),
    description: assignment.description,
    studentAnswer: assignment.studentAnswer,
  };
}

function assignmentFromForm(form: AssignmentForm, id?: string): LiveAssignment {
  const now = new Date().toISOString();

  return {
    id: id ?? `local-${Date.now()}`,
    source: "local",
    title: form.title.trim(),
    subject: form.subject.trim(),
    status: form.status,
    priority: form.priority,
    deadline: form.deadline || null,
    progress: Math.min(100, Math.max(0, Number(form.progress) || 0)),
    description: form.description.trim(),
    studentAnswer: form.studentAnswer.trim(),
    generatedHelp: "",
    updatedAt: now,
  };
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

function formatDate(value: string | null) {
  if (!value) return "-";

  const date = new Date(`${value}T12:00:00`);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}.${month}.${year}`;
}

function getStatusColor(status: DisplayStatus, isDark: boolean) {
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
  const [theme, setTheme] = useState<Theme>(() => getCurrentTheme());
  const [assignments, setAssignments] = useState<LiveAssignment[]>([]);
  const [dataMode, setDataMode] = useState<DataMode>("demo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AssignmentForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const t = copy[language];
  const isDark = theme === "dark";

  function showToast(type: ToastType, message: string) {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  }

  function updateAssignments(nextAssignments: LiveAssignment[]) {
    setAssignments(nextAssignments);

    if (dataMode !== "api") {
      saveLocalAssignments(nextAssignments);
    }
  }

  const loadAssignments = useCallback(async (showFeedback = false) => {
    setLoading(true);
    setError("");

    try {
      const apiAssignments = await listAssignments();
      setAssignments(apiAssignments.map(assignmentFromApi));
      setDataMode("api");
    } catch (loadError) {
      const localAssignments = readLocalAssignments();

      if (localAssignments.length > 0) {
        setAssignments(localAssignments);
        setDataMode("local");
        if (showFeedback) showToast("warning", t.toasts.loadedLocal);
      } else {
        setAssignments(getDemoAssignments());
        setDataMode("demo");
      }

      setError(loadError instanceof Error ? loadError.message : t.errorTitle);
      if (showFeedback) showToast("warning", t.toasts.backendUnavailable);
    } finally {
      setLoading(false);
    }
  }, [t.errorTitle, t.toasts.backendUnavailable, t.toasts.loadedLocal]);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getCurrentTheme());
    loadAssignments();

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

    function handleStorageChange() {
      setLanguage(getStoredLanguage());
      setTheme(getCurrentTheme());
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
  }, [loadAssignments]);

  const stats = useMemo(() => {
    return {
      total: assignments.length,
      inProgress: assignments.filter(
        (item) => getDisplayStatus(item) === "inProgress"
      ).length,
      submitted: assignments.filter(
        (item) => getDisplayStatus(item) === "submitted"
      ).length,
      overdue: assignments.filter((item) => getDisplayStatus(item) === "overdue")
        .length,
    };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const displayStatus = getDisplayStatus(assignment);
      const matchesStatus =
        activeFilter === "all" || displayStatus === activeFilter;
      const searchableText = [
        assignment.title,
        assignment.subject,
        assignment.description,
        t.statuses[displayStatus],
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [activeFilter, assignments, search, t]);

  const nextAssignment = useMemo(() => {
    return [...assignments]
      .filter((assignment) => getDisplayStatus(assignment) !== "submitted")
      .sort((a, b) => {
        const first = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const second = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return first - second;
      })[0];
  }, [assignments]);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(assignment: LiveAssignment) {
    setEditingId(assignment.id);
    setForm(formFromAssignment(assignment));
    setModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const trimmedForm = {
      ...form,
      title: form.title.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
    };

    try {
      if (dataMode === "api" && editingId) {
        const updated = await updateAssignment(editingId, payloadFromForm(trimmedForm));
        setAssignments((current) =>
          current.map((assignment) =>
            assignment.id === editingId ? assignmentFromApi(updated) : assignment
          )
        );
        showToast("success", t.toasts.saved);
      } else if (dataMode === "api") {
        const created = await createAssignment(payloadFromForm(trimmedForm));
        setAssignments((current) => [assignmentFromApi(created), ...current]);
        showToast("success", t.toasts.created);
      } else {
        const nextAssignment = assignmentFromForm(trimmedForm, editingId ?? undefined);
        const nextAssignments = editingId
          ? assignments.map((assignment) =>
              assignment.id === editingId
                ? { ...nextAssignment, generatedHelp: assignment.generatedHelp }
                : assignment
            )
          : [nextAssignment, ...assignments.filter((item) => item.source !== "demo")];

        updateAssignments(nextAssignments);
        setDataMode("local");
        showToast("success", t.toasts.savedLocally);
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch {
      const nextAssignment = assignmentFromForm(trimmedForm, editingId ?? undefined);
      const nextAssignments = editingId
        ? assignments.map((assignment) =>
            assignment.id === editingId
              ? {
                  ...nextAssignment,
                  source: "local" as const,
                  generatedHelp: assignment.generatedHelp,
                }
              : assignment
          )
        : [nextAssignment, ...readLocalAssignments()];

      setAssignments(nextAssignments);
      setDataMode("local");
      saveLocalAssignments(nextAssignments);
      showToast("warning", t.toasts.savedLocally);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(assignment: LiveAssignment) {
    const confirmed = window.confirm(t.confirmDelete);
    if (!confirmed) return;

    setDeletingId(assignment.id);

    try {
      if (dataMode === "api" && assignment.source === "api") {
        await deleteAssignment(assignment.id);
        setAssignments((current) =>
          current.filter((item) => item.id !== assignment.id)
        );
      } else {
        updateAssignments(assignments.filter((item) => item.id !== assignment.id));
        setDataMode("local");
      }

      showToast("success", t.toasts.deleted);
    } catch {
      const nextAssignments = assignments.filter((item) => item.id !== assignment.id);
      setAssignments(nextAssignments);
      setDataMode("local");
      saveLocalAssignments(nextAssignments);
      showToast("warning", t.toasts.savedLocally);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleQuickUpdate(
    assignment: LiveAssignment,
    update: Partial<LiveAssignment>
  ) {
    const nextValue = { ...assignment, ...update, updatedAt: new Date().toISOString() };

    if (dataMode === "api" && assignment.source === "api") {
      try {
        const updated = await updateAssignment(assignment.id, {
          status: update.status ? uiStatusToApi(update.status) : undefined,
          priority: update.priority,
          progress: update.progress,
        });
        setAssignments((current) =>
          current.map((item) =>
            item.id === assignment.id ? assignmentFromApi(updated) : item
          )
        );
        showToast("success", t.toasts.saved);
        return;
      } catch {
        showToast("warning", t.toasts.savedLocally);
      }
    }

    const nextAssignments = assignments.map((item) =>
      item.id === assignment.id ? { ...nextValue, source: "local" as const } : item
    );
    setDataMode("local");
    setAssignments(nextAssignments);
    saveLocalAssignments(nextAssignments);
  }

  async function handleGenerateHelp(assignment: LiveAssignment) {
    setGeneratingId(assignment.id);

    try {
      let result = "";
      const action: AssignmentHelpType = "solution_plan";

      if (dataMode === "api" && assignment.source === "api") {
        const response = await generateAssignmentHelp(assignment.id, action);
        result = response.result;
      } else {
        result = [
          `1. Clarify the main goal for "${assignment.title}".`,
          "2. Split the work into research, outline, draft, and review.",
          "3. Write the strongest argument first, then support it with examples.",
          "4. Reserve time for citation and final proofreading.",
        ].join("\n");
      }

      const nextAssignments = assignments.map((item) =>
        item.id === assignment.id
          ? {
              ...item,
              generatedHelp: result,
              source: item.source === "api" ? ("api" as const) : ("local" as const),
            }
          : item
      );

      setAssignments(nextAssignments);
      if (dataMode !== "api") saveLocalAssignments(nextAssignments);
      showToast("success", t.toasts.generated);
    } catch {
      const fallbackHelp = [
        `Plan for "${assignment.title}"`,
        "- Define the expected deliverable.",
        "- Create a short outline before writing.",
        "- Add evidence, examples, and final checks.",
      ].join("\n");
      const nextAssignments = assignments.map((item) =>
        item.id === assignment.id
          ? { ...item, generatedHelp: fallbackHelp, source: "local" as const }
          : item
      );

      setAssignments(nextAssignments);
      setDataMode("local");
      saveLocalAssignments(nextAssignments);
      showToast("warning", t.toasts.savedLocally);
    } finally {
      setGeneratingId(null);
    }
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
  const bannerText =
    dataMode === "api" ? t.apiBanner : dataMode === "local" ? t.localBanner : t.demoBanner;

  return (
    <div className={pageClass}>
      <div className="fixed right-4 top-20 z-[70] grid w-[min(360px,calc(100vw-2rem))] gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm font-bold shadow-xl ${
              toast.type === "success"
                ? "border-emerald-500/20 bg-emerald-500 text-white"
                : toast.type === "error"
                  ? "border-red-500/20 bg-red-500 text-white"
                  : toast.type === "warning"
                    ? "border-amber-500/20 bg-amber-500 text-white"
                    : "border-blue-500/20 bg-blue-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className={`min-w-0 overflow-hidden rounded-[2rem] border p-5 sm:p-6 lg:p-8 xl:col-span-2 ${cardClass}`}>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                isDark
                  ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                  : "border-blue-100 bg-blue-50 text-blue-700"
              }`}>
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {t.pageBadge}
              </div>

              <h1 className={`text-3xl font-black tracking-tight sm:text-4xl ${titleClass}`}>
                {t.pageTitle}
              </h1>
              <p className={`mt-3 max-w-3xl text-sm leading-6 sm:text-base ${textClass}`}>
                {t.pageSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {t.createAssignment}
            </button>
          </div>
        </section>

        <section className={`rounded-[1.5rem] border px-4 py-3 text-sm font-bold xl:col-span-2 ${
          dataMode === "api"
            ? isDark
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
            : isDark
              ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
              : "border-amber-100 bg-amber-50 text-amber-800"
        }`}>
          {bannerText}
        </section>

        <section className="min-w-0 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [t.stats.total, stats.total],
              [t.stats.inProgress, stats.inProgress],
              [t.stats.submitted, stats.submitted],
              [t.stats.overdue, stats.overdue],
            ].map(([label, value]) => (
              <div key={label} className={`rounded-[1.75rem] border p-5 ${cardClass}`}>
                <p className={`text-sm font-bold ${mutedClass}`}>{label}</p>
                <p className={`mt-3 text-3xl font-black ${titleClass}`}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`min-w-0 rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <h2 className={`text-xl font-black ${titleClass}`}>{t.sectionTitle}</h2>
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
            {(["all", "draft", "inProgress", "submitted", "overdue"] as FilterKey[]).map((filter) => {
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
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-44 animate-pulse rounded-[1.75rem] border ${softCardClass}`}
                />
              ))
            ) : filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => {
                const displayStatus = getDisplayStatus(assignment);

                return (
                  <article key={assignment.id} className={`min-w-0 rounded-[1.75rem] border p-5 ${softCardClass}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusColor(displayStatus, isDark)}`}>
                            {t.statuses[displayStatus]}
                          </span>
                          <span className={`text-xs font-bold ${mutedClass}`}>
                            {t.due}: {formatDate(assignment.deadline)}
                          </span>
                          <span className={`text-xs font-bold ${mutedClass}`}>
                            {t.priority}: {t[assignment.priority]}
                          </span>
                        </div>

                        <h3 className={`mt-4 text-lg font-black ${titleClass}`}>
                          {assignment.title}
                        </h3>
                        <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                          {assignment.subject}
                        </p>
                        <p className={`mt-3 line-clamp-2 text-sm leading-6 ${textClass}`}>
                          {assignment.description || "-"}
                        </p>
                      </div>

                      <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
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
                        <button
                          type="button"
                          onClick={() => openEditModal(assignment)}
                          className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-black transition ${
                            isDark
                              ? "border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/10"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {t.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateHelp(assignment)}
                          disabled={generatingId === assignment.id}
                          className="inline-flex h-10 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {generatingId === assignment.id ? t.generating : t.generateHelp}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-4">
                        <p className={`text-sm font-bold ${mutedClass}`}>{t.progress}</p>
                        <p className={`text-sm font-black ${titleClass}`}>{assignment.progress}%</p>
                      </div>
                      <div className={`mt-2 h-3 overflow-hidden rounded-full ${isDark ? "bg-slate-950" : "bg-slate-200"}`}>
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${assignment.progress}%` }} />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 lg:grid-cols-[1fr_1fr_auto]">
                      <select
                        value={assignment.status}
                        onChange={(event) =>
                          handleQuickUpdate(assignment, {
                            status: event.target.value as UiStatus,
                            progress:
                              event.target.value === "submitted"
                                ? 100
                                : assignment.progress,
                          })
                        }
                        className={`h-10 rounded-2xl border px-3 text-sm font-bold outline-none ${inputClass}`}
                      >
                        <option value="draft">{t.statuses.draft}</option>
                        <option value="inProgress">{t.statuses.inProgress}</option>
                        <option value="submitted">{t.statuses.submitted}</option>
                      </select>

                      <select
                        value={assignment.priority}
                        onChange={(event) =>
                          handleQuickUpdate(assignment, {
                            priority: event.target.value as AssignmentPriority,
                          })
                        }
                        className={`h-10 rounded-2xl border px-3 text-sm font-bold outline-none ${inputClass}`}
                      >
                        <option value="low">{t.low}</option>
                        <option value="medium">{t.medium}</option>
                        <option value="high">{t.high}</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDelete(assignment)}
                        disabled={deletingId === assignment.id}
                        className="h-10 rounded-2xl border border-red-500/20 px-4 text-sm font-black text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === assignment.id ? t.deleting : t.delete}
                      </button>
                    </div>

                    {assignment.generatedHelp && (
                      <div className={`mt-4 whitespace-pre-line rounded-2xl border p-4 text-sm leading-6 ${softCardClass}`}>
                        <p className={`mb-2 font-black ${titleClass}`}>{t.helpTitle}</p>
                        <p className={textClass}>{assignment.generatedHelp}</p>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className={`rounded-[1.75rem] border p-8 text-center ${softCardClass}`}>
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${isDark ? "bg-blue-500/15" : "bg-blue-600/10"}`}>
                  🔎
                </div>
                <h3 className={`mt-4 text-xl font-black ${titleClass}`}>{t.emptyTitle}</h3>
                <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedClass}`}>
                  {t.emptySubtitle}
                </p>
                <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
                  >
                    {t.createAssignment}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("all");
                      setSearch("");
                    }}
                    className={`inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-black transition ${
                      isDark
                        ? "border-white/10 text-slate-200 hover:bg-white/10"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t.resetFilters}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="grid min-w-0 gap-6">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className={`text-xl font-black ${titleClass}`}>{t.upcomingTitle}</h2>
                <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>{t.upcomingSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => loadAssignments(true)}
                className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-black text-blue-600"
              >
                {t.retry}
              </button>
            </div>

            {nextAssignment ? (
              <div className={`mt-5 rounded-3xl border p-4 ${softCardClass}`}>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusColor(getDisplayStatus(nextAssignment), isDark)}`}>
                  {t.statuses[getDisplayStatus(nextAssignment)]}
                </span>
                <h3 className={`mt-4 text-base font-black ${titleClass}`}>{nextAssignment.title}</h3>
                <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>{nextAssignment.subject}</p>
                <div className={`mt-4 rounded-2xl border p-4 ${softCardClass}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}>{t.due}</p>
                  <p className={`mt-1 text-sm font-black ${titleClass}`}>{formatDate(nextAssignment.deadline)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEditModal(nextAssignment)}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  {t.continue}
                </button>
              </div>
            ) : (
              <p className={`mt-5 text-sm leading-6 ${mutedClass}`}>{t.emptyTitle}</p>
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
              <button
                type="button"
                onClick={() => nextAssignment && handleGenerateHelp(nextAssignment)}
                disabled={!nextAssignment || Boolean(generatingId)}
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generatingId ? t.generating : t.generateHelp}
              </button>
              <Link
                href="/ai-tutor"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-black text-white transition hover:bg-white/20"
              >
                {t.openAiTutor}
              </Link>
            </div>
          </section>

          {error && dataMode !== "api" && (
            <section className={`rounded-[2rem] border p-5 text-sm leading-6 ${cardClass}`}>
              <p className={`font-black ${titleClass}`}>{t.errorTitle}</p>
              <p className={`mt-2 ${mutedClass}`}>{error}</p>
            </section>
          )}
        </aside>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 px-4 py-4 backdrop-blur sm:items-center">
          <form
            onSubmit={handleSubmit}
            className={`w-full max-w-2xl rounded-[2rem] border p-5 shadow-2xl sm:p-6 ${cardClass}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className={`text-xl font-black ${titleClass}`}>
                  {editingId ? t.formEditTitle : t.formCreateTitle}
                </h2>
                <p className={`mt-1 text-sm ${mutedClass}`}>{t.localBanner}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={`h-10 w-10 rounded-2xl border text-lg font-black ${inputClass}`}
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.title}</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.subject}</span>
                <input
                  required
                  value={form.subject}
                  onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.deadline}</span>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) => setForm({ ...form, deadline: event.target.value })}
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.status}</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as UiStatus })
                  }
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
                  value={form.priority}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priority: event.target.value as AssignmentPriority,
                    })
                  }
                  className={`h-11 rounded-2xl border px-4 text-sm outline-none ${inputClass}`}
                >
                  <option value="low">{t.low}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="high">{t.high}</option>
                </select>
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>
                  {t.progress}: {form.progress}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(event) => setForm({ ...form, progress: event.target.value })}
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.description}</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  rows={3}
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none ${inputClass}`}
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className={`text-sm font-black ${titleClass}`}>{t.answer}</span>
                <textarea
                  value={form.studentAnswer}
                  onChange={(event) =>
                    setForm({ ...form, studentAnswer: event.target.value })
                  }
                  rows={3}
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none ${inputClass}`}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={`h-11 rounded-2xl border px-5 text-sm font-black ${inputClass}`}
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-11 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? t.saving : editingId ? t.save : t.create}
              </button>
            </div>
          </form>
        </div>
      )}
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
