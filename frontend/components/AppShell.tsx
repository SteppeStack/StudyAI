"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { readLocalProfile, type LocalProfile } from "@/lib/profile";
import {
  applyTheme,
  getCurrentTheme,
  saveTheme,
  type Theme,
} from "@/lib/theme";
import {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Language = "en" | "ru" | "kz";

type Copy = {
  search: string;
  searchShortcut: string;
  searchEmpty: string;
  actions: {
    goTo: string;
    createAssignment: string;
    uploadFile: string;
    createDocument: string;
  };
  student: string;
  studentPlan: string;
  unlockTitle: string;
  unlockText: string;
  upgradePlan: string;
  nav: {
    dashboard: string;
    aiTutor: string;
    assignments: string;
    diploma: string;
    documents: string;
    examPrep: string;
    files: string;
    subscription: string;
    settings: string;
  };
};

const copy: Record<Language, Copy> = {
  en: {
    search: "Search...",
    searchShortcut: "⌘K",
    searchEmpty: "No command found",
    actions: {
      goTo: "Go to",
      createAssignment: "Create Assignment",
      uploadFile: "Upload File",
      createDocument: "Create Document",
    },
    student: "Student",
    studentPlan: "Student plan",
    unlockTitle: "Unlock your potential",
    unlockText: "Upgrade to StudyAI Pro to get more AI credits and study tools.",
    upgradePlan: "Upgrade plan",
    nav: {
      dashboard: "Dashboard",
      aiTutor: "AI Tutor",
      assignments: "Assignments",
      diploma: "Diploma",
      documents: "Documents",
      examPrep: "Exams",
      files: "Files",
      subscription: "Subscription",
      settings: "Settings",
    },
  },
  ru: {
    search: "Поиск...",
    searchShortcut: "⌘K",
    searchEmpty: "Команда не найдена",
    actions: {
      goTo: "Перейти",
      createAssignment: "Создать задание",
      uploadFile: "Загрузить файл",
      createDocument: "Создать документ",
    },
    student: "Студент",
    studentPlan: "Студенческий план",
    unlockTitle: "Раскрой свой потенциал",
    unlockText:
      "Перейди на StudyAI Pro, чтобы получить больше AI-кредитов и учебных инструментов.",
    upgradePlan: "Улучшить план",
    nav: {
      dashboard: "Главная",
      aiTutor: "AI Tutor",
      assignments: "Задания",
      diploma: "Диплом",
      documents: "Документы",
      examPrep: "Экзамены",
      files: "Файлы",
      subscription: "Подписка",
      settings: "Настройки",
    },
  },
  kz: {
    search: "Іздеу...",
    searchShortcut: "⌘K",
    searchEmpty: "Команда табылмады",
    actions: {
      goTo: "Өту",
      createAssignment: "Тапсырма құру",
      uploadFile: "Файл жүктеу",
      createDocument: "Құжат құру",
    },
    student: "Студент",
    studentPlan: "Студент жоспары",
    unlockTitle: "Мүмкіндігіңізді ашыңыз",
    unlockText:
      "Көбірек AI-кредиттер мен оқу құралдарын алу үшін StudyAI Pro жоспарына өтіңіз.",
    upgradePlan: "Жоспарды жақсарту",
    nav: {
      dashboard: "Басты бет",
      aiTutor: "AI Tutor",
      assignments: "Тапсырмалар",
      diploma: "Диплом",
      documents: "Құжаттар",
      examPrep: "Емтихандар",
      files: "Файлдар",
      subscription: "Жазылым",
      settings: "Баптаулар",
    },
  },
};

const languageLabels: Record<Language, string> = {
  en: "English",
  ru: "Русский",
  kz: "Қазақша",
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: "▣" },
  { key: "aiTutor", href: "/ai-tutor", icon: "🤖" },
  { key: "assignments", href: "/assignments", icon: "☑" },
  { key: "diploma", href: "/diploma", icon: "🎓" },
  { key: "documents", href: "/documents", icon: "📄" },
  { key: "examPrep", href: "/exam-prep", icon: "🎯" },
  { key: "files", href: "/files", icon: "📁" },
  { key: "subscription", href: "/subscription", icon: "💳" },
  { key: "settings", href: "/settings", icon: "⚙" },
] as const;

const mobileNavItems = [
  { key: "dashboard", href: "/dashboard", icon: "▣" },
  { key: "aiTutor", href: "/ai-tutor", icon: "🤖" },
  { key: "assignments", href: "/assignments", icon: "☑" },
  { key: "examPrep", href: "/exam-prep", icon: "🎯" },
  { key: "settings", href: "/settings", icon: "⚙" },
] as const;

function getStoredValue<T extends string>(
  keys: string[],
  allowedValues: readonly T[],
  fallback: T
): T {
  if (typeof window === "undefined") return fallback;

  for (const key of keys) {
    const value = window.localStorage.getItem(key);

    if (value && allowedValues.includes(value as T)) {
      return value as T;
    }
  }

  return fallback;
}

function saveValueToStorage(keys: string[], value: string) {
  if (typeof window === "undefined") return;

  for (const key of keys) {
    window.localStorage.setItem(key, value);
  }
}

function getInitials(name: string) {
  const cleaned = name.trim();

  if (!cleaned) return "ST";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/" || pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const commandMenuRef = useRef<HTMLDivElement | null>(null);

  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>(() => getCurrentTheme());
  const [profile, setProfile] = useState<LocalProfile>({});
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");

  const t = copy[language];

  const isDark = theme === "dark";
  const displayName = profile.displayName?.trim() || t.student;
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const currentPageTitle =
    navItems.find((item) => isActivePath(pathname, item.href))?.key || null;

  const commands = useMemo(() => {
    const pageCommands = navItems.map((item) => ({
      id: item.href,
      label: `${t.actions.goTo} ${t.nav[item.key]}`,
      href: item.href,
      icon: item.icon,
      keywords: `${item.key} ${t.nav[item.key]} ${item.href}`,
    }));

    return [
      ...pageCommands,
      {
        id: "create-assignment",
        label: t.actions.createAssignment,
        href: "/assignments",
        icon: "☑",
        keywords: "assignment task create new",
      },
      {
        id: "upload-file",
        label: t.actions.uploadFile,
        href: "/files",
        icon: "📁",
        keywords: "file upload materials",
      },
      {
        id: "create-document",
        label: t.actions.createDocument,
        href: "/documents",
        icon: "📄",
        keywords: "document draft essay report",
      },
    ];
  }, [t]);

  const filteredCommands = useMemo(() => {
    const query = commandSearch.trim().toLowerCase();
    if (!query) return commands;

    return commands.filter((command) =>
      [command.label, command.keywords].join(" ").toLowerCase().includes(query)
    );
  }, [commandSearch, commands]);

  useEffect(() => {
    const storedLanguage = getStoredValue<Language>(
      languageStorageKeys,
      ["en", "ru", "kz"],
      "ru"
    );

    const storedTheme = getCurrentTheme();

    setLanguage(storedLanguage);
    applyTheme(storedTheme);
    setTheme(storedTheme);
    saveValueToStorage(languageStorageKeys, storedLanguage);
    saveTheme(storedTheme);
    setProfile(readLocalProfile());
  }, []);

  useEffect(() => {
    setProfile(readLocalProfile());
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setLanguageMenuOpen(false);
      }

      if (
        commandMenuRef.current &&
        !commandMenuRef.current.contains(event.target as Node)
      ) {
        setCommandMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleStorageChange() {
      const storedLanguage = getStoredValue<Language>(
        languageStorageKeys,
        ["en", "ru", "kz"],
        language
      );

      const storedTheme = getCurrentTheme();

      setProfile(readLocalProfile());
      setLanguage(storedLanguage);
      applyTheme(storedTheme);
      setTheme(storedTheme);
      saveValueToStorage(languageStorageKeys, storedLanguage);
      saveTheme(storedTheme);
    }

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<Language>;

      if (
        customEvent.detail === "en" ||
        customEvent.detail === "ru" ||
        customEvent.detail === "kz"
      ) {
        setLanguage(customEvent.detail);
        saveValueToStorage(languageStorageKeys, customEvent.detail);
      }
    }

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<Theme>;

      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        applyTheme(customEvent.detail);
        setTheme(customEvent.detail);
        saveTheme(customEvent.detail);
      }
    }

    function handleProfileChange() {
      setProfile(readLocalProfile());
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("studyai:language-change", handleLanguageChange);
    window.addEventListener("studyai:theme-change", handleThemeChange);
    window.addEventListener("studyai:profile-change", handleProfileChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "studyai:language-change",
        handleLanguageChange
      );
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("studyai:profile-change", handleProfileChange);
    };
  }, [language, theme]);

  function handleLanguageSelect(nextLanguage: Language) {
    setLanguage(nextLanguage);
    saveValueToStorage(languageStorageKeys, nextLanguage);
    setLanguageMenuOpen(false);

    window.dispatchEvent(
      new CustomEvent("studyai:language-change", {
        detail: nextLanguage,
      })
    );
  }

  function handleThemeToggle() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    setTheme(nextTheme);
    saveTheme(nextTheme);

    window.dispatchEvent(
      new CustomEvent("studyai:theme-change", {
        detail: nextTheme,
      })
    );
  }

  function runCommand(href: string) {
    setCommandMenuOpen(false);
    setCommandSearch("");
    router.push(href);
  }

  const shellClass = isDark
    ? "min-h-screen bg-slate-950 text-white"
    : "min-h-screen bg-slate-50 text-slate-950";

  const sidebarClass = isDark
    ? "fixed left-0 top-0 z-40 hidden h-screen w-[280px] border-r border-white/10 bg-slate-900/95 px-4 py-5 shadow-sm backdrop-blur lg:block"
    : "fixed left-0 top-0 z-40 hidden h-screen w-[280px] border-r border-slate-200 bg-white/95 px-4 py-5 shadow-sm backdrop-blur lg:block";

  const headerClass = isDark
    ? "sticky top-0 z-30 border-b border-white/10 bg-slate-900/90 px-4 py-3 backdrop-blur sm:px-6"
    : "sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6";

  const controlClass = isDark
    ? "border-white/10 bg-slate-950/70 text-slate-100 hover:border-blue-400/30 hover:bg-blue-400/10"
    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50";

  return (
    <div className={shellClass}>
      <aside className={sidebarClass}>
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-sm shadow-blue-600/25">
            ▣
          </div>

          <p
            className={`text-xl font-black tracking-tight ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            StudyAI
          </p>
        </Link>

        <nav className="mt-10 grid gap-2">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const label = t.nav[item.key];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-bold transition ${
                  active
                    ? isDark
                      ? "bg-blue-500/15 text-blue-100"
                      : "bg-blue-50 text-blue-700"
                    : isDark
                    ? "text-slate-300 hover:bg-white/10 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : isDark
                      ? "bg-slate-950 text-slate-300 group-hover:bg-slate-800"
                      : "bg-slate-100 text-slate-600 group-hover:bg-white"
                  }`}
                >
                  {item.icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div
          className={`absolute bottom-5 left-4 right-4 rounded-3xl border p-4 ${
            isDark
              ? "border-white/10 bg-slate-950/60"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg text-white shadow-sm shadow-blue-600/25">
            ✨
          </div>

          <p
            className={`mt-4 text-sm font-black ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            {t.unlockTitle}
          </p>

          <p
            className={`mt-2 text-xs leading-5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {t.unlockText}
          </p>

          <Link
            href="/subscription"
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {t.upgradePlan}
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className={headerClass}>
          <div className="flex items-center justify-between gap-4">
            <div className="hidden min-w-[180px] lg:block">
              <h1
                className={`truncate text-2xl font-black tracking-tight ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                {currentPageTitle ? t.nav[currentPageTitle] : "StudyAI"}
              </h1>
            </div>

            <Link href="/dashboard" className="flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
                ▣
              </div>
              <span
                className={`text-lg font-black ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                StudyAI
              </span>
            </Link>

            <div
              ref={commandMenuRef}
              className="relative hidden min-w-0 flex-1 justify-center 2xl:flex"
            >
              <div
                className={`flex h-11 w-full max-w-[560px] items-center gap-3 rounded-2xl border px-4 text-left text-sm transition ${controlClass}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                <input
                  value={commandSearch}
                  onChange={(event) => {
                    setCommandSearch(event.target.value);
                    setCommandMenuOpen(true);
                  }}
                  onFocus={() => setCommandMenuOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && filteredCommands[0]) {
                      event.preventDefault();
                      runCommand(filteredCommands[0].href);
                    }

                    if (event.key === "Escape") {
                      setCommandMenuOpen(false);
                    }
                  }}
                  placeholder={t.search}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:opacity-75"
                />

                <span
                  className={`shrink-0 rounded-xl border px-2.5 py-1 text-xs font-black ${
                    isDark
                      ? "border-white/10 bg-white/5 text-slate-500"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {t.searchShortcut}
                </span>
              </div>

              {commandMenuOpen && (
                <div
                  className={`absolute top-13 z-50 w-full max-w-[560px] overflow-hidden rounded-2xl border p-2 shadow-xl ${
                    isDark
                      ? "border-white/10 bg-slate-900 shadow-black/30"
                      : "border-slate-200 bg-white shadow-slate-900/10"
                  }`}
                >
                  {filteredCommands.length > 0 ? (
                    filteredCommands.slice(0, 8).map((command) => (
                      <button
                        key={command.id}
                        type="button"
                        onClick={() => runCommand(command.href)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                          isDark
                            ? "text-slate-200 hover:bg-white/10"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs text-white">
                          {command.icon}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {command.label}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p
                      className={`px-3 py-3 text-sm font-bold ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {t.searchEmpty}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleThemeToggle}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm transition ${controlClass}`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>

              <div ref={languageMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen((value) => !value)}
                  className={`flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-black uppercase transition ${controlClass}`}
                >
                  <span className="text-sm">🌐</span>
                  <span>{language}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 transition ${
                      languageMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {languageMenuOpen && (
                  <div
                    className={`absolute right-0 top-13 z-50 w-44 overflow-hidden rounded-2xl border p-1.5 shadow-xl ${
                      isDark
                        ? "border-white/10 bg-slate-900 shadow-black/30"
                        : "border-slate-200 bg-white shadow-slate-900/10"
                    }`}
                  >
                    {(["en", "ru", "kz"] as Language[]).map((item) => {
                      const active = language === item;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleLanguageSelect(item)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                            active
                              ? isDark
                                ? "bg-blue-500/15 text-blue-100"
                                : "bg-blue-50 text-blue-700"
                              : isDark
                              ? "text-slate-300 hover:bg-white/10 hover:text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                          }`}
                        >
                          <span>{languageLabels[item]}</span>
                          <span className="text-xs uppercase opacity-70">
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`relative hidden h-11 w-11 items-center justify-center rounded-2xl border text-sm transition sm:flex ${controlClass}`}
                aria-label="Notifications"
              >
                🔔
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                  3
                </span>
              </button>

              <Link
                href="/settings"
                className={`flex h-11 items-center gap-3 rounded-2xl border px-2 pr-3 transition ${controlClass}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xs font-black text-white">
                  {initials}
                </span>

                <span className="hidden min-w-0 text-left md:block">
                  <span
                    className={`block max-w-[160px] truncate text-sm font-black ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {displayName}
                  </span>
                  <span
                    className={`block max-w-[160px] truncate text-xs font-semibold ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {t.studentPlan}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-73px)] pb-24 lg:pb-0">
          {children}
        </main>
      </div>

      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 border-t px-2 py-2 backdrop-blur lg:hidden ${
          isDark
            ? "border-white/10 bg-slate-900/95"
            : "border-slate-200 bg-white/95"
        }`}
      >
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const label = t.nav[item.key];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold transition ${
                  active
                    ? isDark
                      ? "bg-blue-500/15 text-blue-100"
                      : "bg-blue-50 text-blue-700"
                    : isDark
                    ? "text-slate-400 hover:bg-white/10"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="max-w-full truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
