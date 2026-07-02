"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { readLocalProfile, saveLocalProfile } from "@/lib/profile";
import { getCurrentTheme } from "@/lib/theme";

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

const assignmentsStorageKey = "studyai-local-assignments";
const filesStorageKey = "studyai-local-files";
const documentsStorageKey = "studyai-local-documents";
const examStorageKey = "studyai-exam-prep-saved";
const diplomaChaptersStorageKey = "studyai-diploma-chapters";
const onboardingStorageKey = "studyai-onboarding-state";
const studyProgressStorageKey = "studyai-study-progress";

type StoredAssignment = {
  id?: string | number;
  title?: string;
  name?: string;
  subject?: string;
  course?: string;
  status?: string;
  priority?: string;
  deadline?: string;
  dueDate?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

type CalendarGroupKey = "overdue" | "today" | "week" | "later";

type CalendarItem = {
  id: string;
  title: string;
  due: string;
  href: string;
};

type StudyProgress = {
  lastActiveDate?: string;
  streak: number;
};

type StoredFile = {
  id?: string | number;
  title?: string;
  name?: string;
  date?: string;
  uploadedAt?: string;
  createdAt?: string;
};

type StoredDocument = {
  id?: string | number;
  title?: string;
  updatedAt?: string;
  createdAt?: string;
};

type StoredExam = {
  id?: string | number;
  title?: string;
  subject?: string;
  progress?: number;
  date?: string;
};

type DashboardActivity = {
  title: string;
  time: string;
  tag: string;
  icon: string;
  color: string;
};

type DashboardDeadline = {
  title: string;
  due: string;
  href: string;
  date: string;
};

type DashboardSnapshot = {
  activeAssignments: number;
  submittedAssignments: number;
  documents: number;
  files: number;
  examProgress: number;
  diplomaProgress: number;
  dueThisWeek: number;
  overdue: number;
  studyStreak: number;
  completedThisWeek: number;
  activities: Omit<DashboardActivity, "color">[];
  deadlines: DashboardDeadline[];
  calendar: Record<CalendarGroupKey, CalendarItem[]>;
};

const emptySnapshot: DashboardSnapshot = {
  activeAssignments: 0,
  submittedAssignments: 0,
  documents: 0,
  files: 0,
  examProgress: 0,
  diplomaProgress: 0,
  dueThisWeek: 0,
  overdue: 0,
  studyStreak: 0,
  completedThisWeek: 0,
  activities: [],
  deadlines: [],
  calendar: { overdue: [], today: [], week: [], later: [] },
};

const onboardingCopy = {
  en: {
    title: "Set up your academic workspace",
    subtitle: "Add a few study details so StudyAI feels less empty on first launch.",
    university: "University",
    program: "Program / major",
    level: "Study level",
    goal: "Main study goal",
    universityPlaceholder: "e.g. Hof University",
    programPlaceholder: "e.g. Computer Science",
    levelPlaceholder: "e.g. Bachelor, 2nd year",
    goalPlaceholder: "e.g. submit assignments on time and prepare for exams",
    save: "Save and start",
    skip: "Skip for now",
    quickStart: "Quick start",
    assignment: "Create first assignment",
    file: "Upload first file",
    exam: "Generate study plan",
    tutor: "Start AI Tutor",
  },
  ru: {
    title: "Настрой учебный workspace",
    subtitle: "Добавь несколько деталей, чтобы StudyAI не выглядел пустым при первом входе.",
    university: "Университет",
    program: "Программа / специальность",
    level: "Уровень обучения",
    goal: "Главная учебная цель",
    universityPlaceholder: "например: Hof University",
    programPlaceholder: "например: Computer Science",
    levelPlaceholder: "например: бакалавр, 2 курс",
    goalPlaceholder: "например: сдавать задания вовремя и готовиться к экзаменам",
    save: "Сохранить и начать",
    skip: "Пропустить",
    quickStart: "Быстрый старт",
    assignment: "Создать первое задание",
    file: "Загрузить первый файл",
    exam: "Создать учебный план",
    tutor: "Открыть AI Tutor",
  },
  kz: {
    title: "Оқу workspace баптау",
    subtitle: "StudyAI бірінші кіргенде бос көрінбеуі үшін бірнеше оқу дерегін қосыңыз.",
    university: "Университет",
    program: "Бағдарлама / мамандық",
    level: "Оқу деңгейі",
    goal: "Негізгі оқу мақсаты",
    universityPlaceholder: "мысалы: Hof University",
    programPlaceholder: "мысалы: Computer Science",
    levelPlaceholder: "мысалы: бакалавр, 2 курс",
    goalPlaceholder: "мысалы: тапсырмаларды уақытында тапсыру және емтиханға дайындалу",
    save: "Сақтап бастау",
    skip: "Кейін",
    quickStart: "Жылдам бастау",
    assignment: "Алғашқы тапсырма",
    file: "Алғашқы файл",
    exam: "Оқу жоспары",
    tutor: "AI Tutor ашу",
  },
} satisfies Record<Language, Record<string, string>>;

const progressCopy = {
  en: {
    streak: "Study streak",
    completed: "Completed this week",
    due: "Due this week",
    overdue: "Overdue",
    days: "days",
    calendar: "Academic calendar",
    calendarSubtitle: "Assignments grouped by urgency from your local workspace.",
    groups: {
      overdue: "Overdue",
      today: "Today",
      week: "This week",
      later: "Later",
    },
    empty: "No deadlines in this group.",
  },
  ru: {
    streak: "Учебная серия",
    completed: "Завершено за неделю",
    due: "Дедлайны недели",
    overdue: "Просрочено",
    days: "дн.",
    calendar: "Учебный календарь",
    calendarSubtitle: "Задания сгруппированы по срочности из локального workspace.",
    groups: {
      overdue: "Просрочено",
      today: "Сегодня",
      week: "На этой неделе",
      later: "Позже",
    },
    empty: "В этой группе нет дедлайнов.",
  },
  kz: {
    streak: "Оқу сериясы",
    completed: "Аптада аяқталды",
    due: "Осы апта дедлайндары",
    overdue: "Мерзімі өтті",
    days: "күн",
    calendar: "Оқу күнтізбесі",
    calendarSubtitle: "Тапсырмалар жергілікті workspace бойынша срочностьпен топтастырылды.",
    groups: {
      overdue: "Мерзімі өтті",
      today: "Бүгін",
      week: "Осы апта",
      later: "Кейін",
    },
    empty: "Бұл топта дедлайн жоқ.",
  },
} satisfies Record<
  Language,
  {
    streak: string;
    completed: string;
    due: string;
    overdue: string;
    days: string;
    calendar: string;
    calendarSubtitle: string;
    groups: Record<CalendarGroupKey, string>;
    empty: string;
  }
>;

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");

    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function readRecord(key: string): Record<string, unknown> {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "{}");

    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function parseTime(value?: string) {
  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : 0;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function readStudyProgress(): StudyProgress {
  if (typeof window === "undefined") return { streak: 0 };

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(studyProgressStorageKey) ?? "{}"
    ) as Partial<StudyProgress>;

    return {
      lastActiveDate: parsed.lastActiveDate,
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
    };
  } catch {
    return { streak: 0 };
  }
}

function touchStudyProgress() {
  if (typeof window === "undefined") return 0;

  const today = dateKey(new Date());
  const previous = readStudyProgress();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const nextStreak =
    previous.lastActiveDate === today
      ? Math.max(previous.streak, 1)
      : previous.lastActiveDate === dateKey(yesterday)
      ? previous.streak + 1
      : 1;

  window.localStorage.setItem(
    studyProgressStorageKey,
    JSON.stringify({ lastActiveDate: today, streak: nextStreak })
  );

  return nextStreak;
}

function formatShortDate(value: string | undefined, language: Language) {
  const time = parseTime(value);

  if (!time) return "";

  return new Intl.DateTimeFormat(
    language === "en" ? "en-US" : language === "kz" ? "kk-KZ" : "ru-RU",
    { day: "2-digit", month: "short" }
  ).format(new Date(time));
}

function getAssignmentTitle(assignment: StoredAssignment) {
  return (
    assignment.title?.trim() ||
    assignment.name?.trim() ||
    assignment.subject?.trim() ||
    assignment.course?.trim() ||
    "Assignment"
  );
}

function getAssignmentDeadline(assignment: StoredAssignment) {
  return assignment.deadline || assignment.dueDate;
}

function getAssignmentHref(assignment: StoredAssignment) {
  return assignment.id ? `/assignments/${assignment.id}` : "/assignments";
}

function getAssignmentTime(assignment: StoredAssignment) {
  return (
    assignment.updatedAt ||
    assignment.updated_at ||
    assignment.createdAt ||
    assignment.created_at ||
    getAssignmentDeadline(assignment)
  );
}

function readDashboardSnapshot(language: Language): DashboardSnapshot {
  const assignments = readArray<StoredAssignment>(assignmentsStorageKey);
  const files = readArray<StoredFile>(filesStorageKey);
  const documents = readArray<StoredDocument>(documentsStorageKey);
  const exams = readArray<StoredExam>(examStorageKey);
  const diplomaChapters = readRecord(diplomaChaptersStorageKey);
  const now = startOfDay(new Date());
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const calendar: Record<CalendarGroupKey, CalendarItem[]> = {
    overdue: [],
    today: [],
    week: [],
    later: [],
  };

  const activeAssignments = assignments.filter(
    (assignment) =>
      assignment.status !== "submitted" && assignment.status !== "done"
  ).length;
  const submittedAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "submitted" || assignment.status === "done"
  ).length;
  const examProgress = exams.length
    ? Math.round(
        exams.reduce((total, exam) => total + (exam.progress ?? 0), 0) /
          exams.length
      )
    : 0;
  const chapterStatuses = Object.values(diplomaChapters);
  const diplomaProgress = chapterStatuses.length
    ? Math.round(
        (chapterStatuses.filter(
          (status) => status === "reviewed" || status === "completed"
        ).length /
          chapterStatuses.length) *
          100
      )
    : 0;
  const dueAssignments = assignments.filter((assignment) =>
    Boolean(getAssignmentDeadline(assignment))
  );

  for (const assignment of dueAssignments) {
    const dueTime = parseTime(getAssignmentDeadline(assignment));
    if (!dueTime) continue;

    const dueDate = startOfDay(new Date(dueTime));
    const item = {
      id: String(assignment.id ?? getAssignmentTitle(assignment)),
      title: getAssignmentTitle(assignment),
      due: formatShortDate(getAssignmentDeadline(assignment), language),
      href: getAssignmentHref(assignment),
    };

    if (dueDate < now && assignment.status !== "submitted") {
      calendar.overdue.push(item);
    } else if (dateKey(dueDate) === dateKey(now)) {
      calendar.today.push(item);
    } else if (dueDate <= weekEnd) {
      calendar.week.push(item);
    } else {
      calendar.later.push(item);
    }
  }

  const completedThisWeek =
    assignments.filter((assignment) => {
      if (assignment.status !== "submitted" && assignment.status !== "done") {
        return false;
      }

      const time = parseTime(getAssignmentTime(assignment));
      return time >= weekStart.getTime() && time <= weekEnd.getTime();
    }).length +
    chapterStatuses.filter((status) => status === "completed").length;

  const assignmentActivities = assignments.map((assignment) => ({
    title: getAssignmentTitle(assignment),
    time: formatShortDate(getAssignmentTime(assignment), language),
    tag: "assignment",
    icon: "A",
    sortTime: parseTime(getAssignmentTime(assignment)),
  }));
  const fileActivities = files.map((file) => ({
    title: file.title?.trim() || file.name?.trim() || "File",
    time: formatShortDate(file.date || file.uploadedAt || file.createdAt, language),
    tag: "file",
    icon: "F",
    sortTime: parseTime(file.date || file.uploadedAt || file.createdAt),
  }));
  const documentActivities = documents.map((document) => ({
    title: document.title?.trim() || "Document",
    time: formatShortDate(document.updatedAt || document.createdAt, language),
    tag: "document",
    icon: "D",
    sortTime: parseTime(document.updatedAt || document.createdAt),
  }));

  const deadlines = assignments
    .filter((assignment) => Boolean(getAssignmentDeadline(assignment)))
    .sort(
      (first, second) =>
        parseTime(getAssignmentDeadline(first)) -
        parseTime(getAssignmentDeadline(second))
    )
    .slice(0, 3)
    .map((assignment) => ({
      title: getAssignmentTitle(assignment),
      due: formatShortDate(getAssignmentDeadline(assignment), language),
      href: getAssignmentHref(assignment),
      date: formatShortDate(getAssignmentDeadline(assignment), language),
    }));

  return {
    activeAssignments,
    submittedAssignments,
    documents: documents.length,
    files: files.length,
    examProgress,
    diplomaProgress,
    dueThisWeek: calendar.today.length + calendar.week.length,
    overdue: calendar.overdue.length,
    studyStreak: readStudyProgress().streak,
    completedThisWeek,
    activities: [
      ...assignmentActivities,
      ...fileActivities,
      ...documentActivities,
    ]
      .sort((first, second) => second.sortTime - first.sortTime)
      .slice(0, 4)
      .map((activity) => ({
        title: activity.title,
        time: activity.time,
        tag: activity.tag,
        icon: activity.icon,
      })),
    deadlines,
    calendar,
  };
}

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

function DashboardContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>(() => getCurrentTheme());
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(emptySnapshot);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    university: "",
    program: "",
    studyLevel: "",
    studyGoal: "",
  });

  const t = copy[language];
  const onboarding = onboardingCopy[language];
  const progressText = progressCopy[language];
  const isDark = theme === "dark";

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    const profile = readLocalProfile();
    const onboardingState = readRecord(onboardingStorageKey);

    setLanguage(storedLanguage);
    setTheme(getCurrentTheme());
    touchStudyProgress();
    setSnapshot(readDashboardSnapshot(storedLanguage));
    setOnboardingForm({
      university: profile.university ?? "",
      program: profile.program ?? "",
      studyLevel: profile.studyLevel ?? "",
      studyGoal: profile.studyGoal ?? "",
    });
    setShowOnboarding(
      onboardingState.completed !== true && onboardingState.skipped !== true
    );

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<Language>;

      if (
        customEvent.detail === "en" ||
        customEvent.detail === "ru" ||
        customEvent.detail === "kz"
      ) {
        setLanguage(customEvent.detail);
        setSnapshot(readDashboardSnapshot(customEvent.detail));
      }
    }

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<Theme>;

      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setTheme(customEvent.detail);
      }
    }

    function handleStorageChange() {
      const nextLanguage = getStoredLanguage();

      setLanguage(nextLanguage);
      setTheme(getCurrentTheme());
      setSnapshot(readDashboardSnapshot(nextLanguage));
    }

    window.addEventListener("studyai:language-change", handleLanguageChange);
    window.addEventListener("studyai:theme-change", handleThemeChange);
    window.addEventListener("studyai:profile-change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener(
        "studyai:language-change",
        handleLanguageChange
      );
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("studyai:profile-change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!showOnboarding) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        window.localStorage.setItem(
          onboardingStorageKey,
          JSON.stringify({ skipped: true, skippedAt: new Date().toISOString() })
        );
        setShowOnboarding(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showOnboarding]);

  function saveOnboarding() {
    saveLocalProfile({
      university: onboardingForm.university.trim(),
      program: onboardingForm.program.trim(),
      studyLevel: onboardingForm.studyLevel.trim(),
      studyGoal: onboardingForm.studyGoal.trim(),
    });
    window.localStorage.setItem(
      onboardingStorageKey,
      JSON.stringify({ completed: true, completedAt: new Date().toISOString() })
    );
    setShowOnboarding(false);
  }

  function skipOnboarding() {
    window.localStorage.setItem(
      onboardingStorageKey,
      JSON.stringify({ skipped: true, skippedAt: new Date().toISOString() })
    );
    setShowOnboarding(false);
  }

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
        {
          ...t.modules.assignments,
          stat: String(snapshot.activeAssignments),
        },
        {
          ...t.modules.documents,
          stat: String(snapshot.documents),
        },
        {
          ...t.modules.examPrep,
          stat: `${Math.max(snapshot.examProgress, snapshot.diplomaProgress)}%`,
        },
        {
          ...t.modules.files,
          stat: String(snapshot.files),
        },
      ] as const,
    [
      snapshot.activeAssignments,
      snapshot.diplomaProgress,
      snapshot.documents,
      snapshot.examProgress,
      snapshot.files,
      t,
    ]
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

  const displayedActivities = useMemo(() => {
    if (!snapshot.activities.length) return activities;

    return snapshot.activities.map((activity, index) => ({
      ...activity,
      tag:
        activity.tag === "assignment"
          ? t.activityTags.assignment
          : activity.tag === "document"
          ? t.activityTags.document
          : activity.tag === "file"
          ? t.modules.files.title
          : t.activityTags.examPrep,
      color:
        index % 4 === 0
          ? isDark
            ? "bg-blue-500/15 text-blue-300"
            : "bg-blue-50 text-blue-700"
          : index % 4 === 1
          ? isDark
            ? "bg-emerald-500/15 text-emerald-300"
            : "bg-emerald-50 text-emerald-700"
          : index % 4 === 2
          ? isDark
            ? "bg-violet-500/15 text-violet-300"
            : "bg-violet-50 text-violet-700"
          : isDark
          ? "bg-orange-500/15 text-orange-300"
          : "bg-orange-50 text-orange-700",
    }));
  }, [activities, isDark, snapshot.activities, t]);

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

  const displayedDeadlines = snapshot.deadlines.length
    ? snapshot.deadlines
    : deadlines;

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
  const progressCards = [
    {
      label: progressText.streak,
      value: `${snapshot.studyStreak || 1} ${progressText.days}`,
    },
    {
      label: progressText.completed,
      value: String(snapshot.completedThisWeek),
    },
    {
      label: progressText.due,
      value: String(snapshot.dueThisWeek),
    },
    {
      label: progressText.overdue,
      value: String(snapshot.overdue),
    },
  ];
  const calendarGroupKeys: CalendarGroupKey[] = [
    "overdue",
    "today",
    "week",
    "later",
  ];

  return (
    <div className={pageClass}>
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 sm:items-center">
          <section
            className={`max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border p-5 shadow-2xl sm:p-6 ${cardClass}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="studyai-onboarding-title"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2
                  id="studyai-onboarding-title"
                  className={`text-2xl font-black ${titleClass}`}
                >
                  {onboarding.title}
                </h2>
                <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>
                  {onboarding.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={skipOnboarding}
                className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-black ${
                  isDark
                    ? "border-white/10 text-slate-200 hover:bg-white/10"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {onboarding.skip}
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["university", onboarding.university, onboarding.universityPlaceholder],
                  ["program", onboarding.program, onboarding.programPlaceholder],
                  ["studyLevel", onboarding.level, onboarding.levelPlaceholder],
                  ["studyGoal", onboarding.goal, onboarding.goalPlaceholder],
                ] as const
              ).map(([key, label, placeholder]) => (
                <label key={key} className="grid gap-2 text-sm font-black">
                  {label}
                  <input
                    value={onboardingForm[key]}
                    onChange={(event) =>
                      setOnboardingForm((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className={`h-11 rounded-2xl border px-4 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>
              ))}
            </div>

            <div className={`mt-5 rounded-3xl border p-4 ${softCardClass}`}>
              <p className={`text-sm font-black ${titleClass}`}>
                {onboarding.quickStart}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  [onboarding.assignment, "/assignments"],
                  [onboarding.file, "/files"],
                  [onboarding.exam, "/exam-prep"],
                  [onboarding.tutor, "/ai-tutor"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={saveOnboarding}
                    className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-black ${
                      isDark
                        ? "border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/10"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={saveOnboarding}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 sm:w-auto"
            >
              {onboarding.save}
            </button>
          </section>
        </div>
      )}

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

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {progressCards.map((item) => (
              <div
                key={item.label}
                className={`min-w-0 rounded-[1.5rem] border p-4 ${cardClass}`}
              >
                <p className={`text-sm font-bold ${mutedClass}`}>{item.label}</p>
                <p className={`mt-2 text-2xl font-black ${titleClass}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <section
            className={`mt-6 min-w-0 overflow-hidden rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className={`text-xl font-black ${titleClass}`}>
                  {progressText.calendar}
                </h2>
                <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                  {progressText.calendarSubtitle}
                </p>
              </div>
              <Link
                href="/assignments"
                className="shrink-0 text-sm font-black text-blue-600 hover:text-blue-700"
              >
                {t.viewAll}
              </Link>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-4">
              {calendarGroupKeys.map((group) => (
                <div
                  key={group}
                  className={`min-w-0 rounded-[1.5rem] border p-4 ${softCardClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={`text-sm font-black ${titleClass}`}>
                      {progressText.groups[group]}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-black ${
                        isDark
                          ? "bg-slate-800 text-slate-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {snapshot.calendar[group].length}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {snapshot.calendar[group].length ? (
                      snapshot.calendar[group].slice(0, 3).map((item) => (
                        <Link
                          key={`${group}-${item.id}`}
                          href={item.href}
                          className={`rounded-2xl border p-3 transition ${
                            isDark
                              ? "border-white/10 bg-slate-950/60 hover:bg-white/10"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <p className={`truncate text-sm font-black ${titleClass}`}>
                            {item.title}
                          </p>
                          <p className={`mt-1 text-xs font-semibold ${mutedClass}`}>
                            {item.due}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <p className={`text-sm leading-6 ${mutedClass}`}>
                        {progressText.empty}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                {displayedActivities.map((item) => (
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
                {displayedDeadlines.map((item) => (
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
