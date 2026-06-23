"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";

type SettingsCopy = {
  back: string;
  pageTitle: string;
  pageSubtitle: string;
  profile: string;
  profileSubtitle: string;
  displayName: string;
  displayNamePlaceholder: string;
  university: string;
  universityPlaceholder: string;
  program: string;
  programPlaceholder: string;
  accountStatus: string;
  active: string;
  localProfile: string;
  localProfileHint: string;
  appearance: string;
  appearanceSubtitle: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  saveChanges: string;
  saved: string;
  saving: string;
  account: string;
  accountSubtitle: string;
  logout: string;
  logoutHint: string;
  logoutLoading: string;
  profilePreview: string;
  studentWorkspace: string;
  notSet: string;
  syncedLocally: string;
  lastUpdated: string;
  comingLater: string;
  supabaseLater: string;
};

const copy: Record<Language, SettingsCopy> = {
  en: {
    back: "Back",
    pageTitle: "Settings",
    pageSubtitle:
      "Manage your profile, language, theme, and account preferences.",
    profile: "Profile",
    profileSubtitle: "Basic information used across your StudyAI workspace.",
    displayName: "Display name",
    displayNamePlaceholder: "Enter your name",
    university: "University",
    universityPlaceholder: "Example: Hof University",
    program: "Program",
    programPlaceholder: "Example: Economics and Management",
    accountStatus: "Account status",
    active: "Active",
    localProfile: "Local profile",
    localProfileHint:
      "For now, profile details are stored on this device. Supabase profile saving can be added later.",
    appearance: "Appearance",
    appearanceSubtitle:
      "Choose how StudyAI looks and which language the interface uses.",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    saveChanges: "Save changes",
    saved: "Saved",
    saving: "Saving...",
    account: "Account",
    accountSubtitle: "Sign out from this device.",
    logout: "Log out",
    logoutHint:
      "You will be signed out of your Supabase session and redirected to login.",
    logoutLoading: "Signing out...",
    profilePreview: "Profile preview",
    studentWorkspace: "Student workspace",
    notSet: "Not set",
    syncedLocally: "Synced locally",
    lastUpdated: "Last updated",
    comingLater: "Later",
    supabaseLater: "Supabase profile sync",
  },
  ru: {
    back: "Назад",
    pageTitle: "Настройки",
    pageSubtitle:
      "Управляй профилем, языком, темой и настройками аккаунта.",
    profile: "Профиль",
    profileSubtitle:
      "Основная информация, которая используется в StudyAI workspace.",
    displayName: "Отображаемое имя",
    displayNamePlaceholder: "Введите ваше имя",
    university: "Университет",
    universityPlaceholder: "Например: Hof University",
    program: "Программа",
    programPlaceholder: "Например: Economics and Management",
    accountStatus: "Статус аккаунта",
    active: "Активен",
    localProfile: "Локальный профиль",
    localProfileHint:
      "Пока данные профиля сохраняются на этом устройстве. Позже можно добавить сохранение профиля в Supabase.",
    appearance: "Внешний вид",
    appearanceSubtitle: "Выбери тему StudyAI и язык интерфейса.",
    language: "Язык",
    theme: "Тема",
    light: "Светлая",
    dark: "Тёмная",
    saveChanges: "Сохранить изменения",
    saved: "Сохранено",
    saving: "Сохранение...",
    account: "Аккаунт",
    accountSubtitle: "Выйти из аккаунта на этом устройстве.",
    logout: "Выйти",
    logoutHint:
      "Сессия Supabase будет завершена, после этого откроется страница входа.",
    logoutLoading: "Выход...",
    profilePreview: "Превью профиля",
    studentWorkspace: "Студенческий workspace",
    notSet: "Не указано",
    syncedLocally: "Сохранено локально",
    lastUpdated: "Последнее обновление",
    comingLater: "Позже",
    supabaseLater: "Синхронизация профиля через Supabase",
  },
  kz: {
    back: "Артқа",
    pageTitle: "Баптаулар",
    pageSubtitle:
      "Профильді, тілді, тақырыпты және аккаунт баптауларын басқарыңыз.",
    profile: "Профиль",
    profileSubtitle:
      "StudyAI workspace ішінде қолданылатын негізгі ақпарат.",
    displayName: "Көрсетілетін атау",
    displayNamePlaceholder: "Атыңызды енгізіңіз",
    university: "Университет",
    universityPlaceholder: "Мысалы: Hof University",
    program: "Бағдарлама",
    programPlaceholder: "Мысалы: Economics and Management",
    accountStatus: "Аккаунт күйі",
    active: "Белсенді",
    localProfile: "Жергілікті профиль",
    localProfileHint:
      "Әзірге профиль деректері осы құрылғыда сақталады. Кейін Supabase арқылы профиль сақтауды қосуға болады.",
    appearance: "Көрініс",
    appearanceSubtitle:
      "StudyAI тақырыбын және интерфейс тілін таңдаңыз.",
    language: "Тіл",
    theme: "Тақырып",
    light: "Жарық",
    dark: "Қараңғы",
    saveChanges: "Өзгерістерді сақтау",
    saved: "Сақталды",
    saving: "Сақталуда...",
    account: "Аккаунт",
    accountSubtitle: "Осы құрылғыдан аккаунттан шығу.",
    logout: "Шығу",
    logoutHint:
      "Supabase сессиясы аяқталып, кіру бетіне бағытталасыз.",
    logoutLoading: "Шығу...",
    profilePreview: "Профиль көрінісі",
    studentWorkspace: "Студент workspace",
    notSet: "Көрсетілмеген",
    syncedLocally: "Жергілікті сақталды",
    lastUpdated: "Соңғы жаңарту",
    comingLater: "Кейін",
    supabaseLater: "Supabase профиль синхронизациясы",
  },
};

const languageLabels: Record<Language, string> = {
  en: "English",
  ru: "Русский",
  kz: "Қазақша",
};

const localeMap: Record<Language, string> = {
  en: "en-US",
  ru: "ru-RU",
  kz: "kk-KZ",
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

const themeStorageKeys = ["studyai-theme", "studyai_theme", "theme"];
const profileStorageKey = "studyai-settings-profile";

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

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.body.style.backgroundColor = theme === "dark" ? "#020617" : "#f8fafc";
}

function getInitials(name: string) {
  const cleaned = name.trim();

  if (!cleaned) return "S";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(date: Date, language: Language) {
  return new Intl.DateTimeFormat(localeMap[language], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function SettingsPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState("");
  const [program, setProgram] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const t = copy[language];
  const isDark = theme === "dark";
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  useEffect(() => {
    const storedLanguage = getStoredValue<Language>(
      languageStorageKeys,
      ["en", "ru", "kz"],
      "ru"
    );

    const storedTheme = getStoredValue<Theme>(
      themeStorageKeys,
      ["light", "dark"],
      "dark"
    );

    setLanguage(storedLanguage);
    setTheme(storedTheme);
    saveValueToStorage(languageStorageKeys, storedLanguage);
    saveValueToStorage(themeStorageKeys, storedTheme);
    applyTheme(storedTheme);

    const rawProfile = window.localStorage.getItem(profileStorageKey);

    if (rawProfile) {
      try {
        const profile = JSON.parse(rawProfile) as {
          displayName?: string;
          university?: string;
          program?: string;
          updatedAt?: string;
        };

        setDisplayName(profile.displayName || "");
        setUniversity(profile.university || "");
        setProgram(profile.program || "");

        if (profile.updatedAt) {
          setLastUpdated(new Date(profile.updatedAt));
        }
      } catch {
        window.localStorage.removeItem(profileStorageKey);
      }
    }

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<Theme>;

      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setTheme(customEvent.detail);
        saveValueToStorage(themeStorageKeys, customEvent.detail);
        applyTheme(customEvent.detail);
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
        saveValueToStorage(languageStorageKeys, customEvent.detail);
      }
    }

    window.addEventListener("studyai:theme-change", handleThemeChange);
    window.addEventListener("studyai:language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("studyai:language-change", handleLanguageChange);
    };
  }, []);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/dashboard");
  }

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage);
    saveValueToStorage(languageStorageKeys, nextLanguage);

    window.dispatchEvent(
      new CustomEvent("studyai:language-change", {
        detail: nextLanguage,
      })
    );
  }

  function handleThemeChange(nextTheme: Theme) {
    setTheme(nextTheme);
    saveValueToStorage(themeStorageKeys, nextTheme);
    applyTheme(nextTheme);

    window.dispatchEvent(
      new CustomEvent("studyai:theme-change", {
        detail: nextTheme,
      })
    );
  }

  function handleSave() {
    setIsSaving(true);
    setIsSaved(false);

    const updatedAt = new Date();

    window.localStorage.setItem(
      profileStorageKey,
      JSON.stringify({
        displayName,
        university,
        program,
        updatedAt: updatedAt.toISOString(),
      })
    );

    saveValueToStorage(languageStorageKeys, language);
    saveValueToStorage(themeStorageKeys, theme);
    applyTheme(theme);

    window.dispatchEvent(new CustomEvent("studyai:profile-change"));

    window.setTimeout(() => {
      setLastUpdated(updatedAt);
      setIsSaving(false);
      setIsSaved(true);

      window.setTimeout(() => {
        setIsSaved(false);
      }, 1800);
    }, 350);
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      if (supabase) {
        await supabase.auth.signOut();
      }

      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  const pageClass = isDark
    ? "min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"
    : "min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8";

  const cardClass = isDark
    ? "border-white/10 bg-slate-900/70 shadow-sm"
    : "border-slate-200 bg-white shadow-sm";

  const softCardClass = isDark
    ? "border-white/10 bg-slate-950/60"
    : "border-slate-200 bg-slate-50";

  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-blue-400 focus:bg-slate-950 focus:ring-blue-500/10"
    : "border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/10";

  const titleClass = isDark ? "text-white" : "text-slate-950";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const labelClass = isDark ? "text-slate-100" : "text-slate-800";

  return (
    <main className={pageClass}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className={`rounded-[2rem] border p-5 sm:p-6 lg:p-8 ${cardClass}`}>
          <div className="mb-5">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex h-10 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition ${
                isDark
                  ? "border-white/10 bg-slate-950/60 text-slate-200 hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-100"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              {t.back}
            </button>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div
                className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                  isDark
                    ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                    : "border-blue-100 bg-blue-50 text-blue-700"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                StudyAI
              </div>

              <h1 className={`text-3xl font-bold tracking-tight sm:text-4xl ${titleClass}`}>
                {t.pageTitle}
              </h1>

              <p className={`mt-2 max-w-2xl text-sm leading-6 sm:text-base ${textClass}`}>
                {t.pageSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? t.saving : isSaved ? t.saved : t.saveChanges}
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div className="flex flex-col gap-2">
              <h2 className={`text-xl font-bold ${titleClass}`}>{t.profile}</h2>
              <p className={`text-sm leading-6 ${textClass}`}>
                {t.profileSubtitle}
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className={`text-sm font-semibold ${labelClass}`}>
                  {t.displayName}
                </span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder={t.displayNamePlaceholder}
                  className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`text-sm font-semibold ${labelClass}`}>
                    {t.university}
                  </span>
                  <input
                    value={university}
                    onChange={(event) => setUniversity(event.target.value)}
                    placeholder={t.universityPlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={`text-sm font-semibold ${labelClass}`}>
                    {t.program}
                  </span>
                  <input
                    value={program}
                    onChange={(event) => setProgram(event.target.value)}
                    placeholder={t.programPlaceholder}
                    className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </label>
              </div>
            </div>

            <div
              className={`mt-6 rounded-3xl border p-4 ${
                isDark
                  ? "border-blue-400/20 bg-blue-400/10"
                  : "border-blue-100 bg-blue-50"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p
                    className={`text-sm font-bold ${
                      isDark ? "text-blue-100" : "text-blue-900"
                    }`}
                  >
                    {t.localProfile}
                  </p>

                  <p
                    className={`mt-1 text-sm leading-6 ${
                      isDark ? "text-blue-100/75" : "text-blue-800/80"
                    }`}
                  >
                    {t.localProfileHint}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    isDark
                      ? "border-blue-300/20 bg-white/10 text-blue-100"
                      : "border-blue-200 bg-white text-blue-700"
                  }`}
                >
                  {t.supabaseLater}
                </span>
              </div>
            </div>
          </section>

          <aside className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`text-xl font-bold ${titleClass}`}>
              {t.profilePreview}
            </h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-sky-400 text-xl font-black text-white shadow-sm shadow-blue-600/20">
                {initials}
              </div>

              <div className="min-w-0">
                <p className={`truncate text-base font-bold ${titleClass}`}>
                  {displayName || t.notSet}
                </p>
                <p className={`mt-1 truncate text-sm ${mutedClass}`}>
                  {t.studentWorkspace}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                [t.university, university || t.notSet],
                [t.program, program || t.notSet],
                [t.lastUpdated, lastUpdated ? formatDate(lastUpdated, language) : t.notSet],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-2xl border p-4 ${softCardClass}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide ${mutedClass}`}>
                    {label}
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${labelClass}`}>
                    {value}
                  </p>
                </div>
              ))}

              <div className={`flex items-center justify-between rounded-2xl border p-4 ${softCardClass}`}>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${mutedClass}`}>
                    {t.accountStatus}
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${labelClass}`}>
                    {t.active}
                  </p>
                </div>

                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div>
              <h2 className={`text-xl font-bold ${titleClass}`}>
                {t.appearance}
              </h2>

              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.appearanceSubtitle}
              </p>
            </div>

            <div className="mt-6 grid gap-6">
              <div>
                <p className={`mb-3 text-sm font-semibold ${labelClass}`}>
                  {t.language}
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {(["en", "ru", "kz"] as Language[]).map((item) => {
                    const active = language === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleLanguageChange(item)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                          active
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-500/10"
                            : isDark
                            ? "border-white/10 bg-slate-950/60 text-slate-200 hover:border-blue-400/30 hover:bg-blue-400/10"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        {languageLabels[item]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className={`mb-3 text-sm font-semibold ${labelClass}`}>
                  {t.theme}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(["light", "dark"] as Theme[]).map((item) => {
                    const active = theme === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleThemeChange(item)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-blue-500 bg-blue-50 ring-4 ring-blue-500/10"
                            : isDark
                            ? "border-white/10 bg-slate-950/60 hover:border-blue-400/30 hover:bg-blue-400/10"
                            : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                              item === "light"
                                ? "bg-white text-amber-500 shadow-sm"
                                : "bg-slate-950 text-blue-200"
                            }`}
                          >
                            {item === "light" ? "☀️" : "🌙"}
                          </span>

                          <div>
                            <p className={`text-sm font-bold ${titleClass}`}>
                              {item === "light" ? t.light : t.dark}
                            </p>

                            <p className={`mt-1 text-xs font-medium ${mutedClass}`}>
                              {t.syncedLocally}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div>
              <h2 className={`text-xl font-bold ${titleClass}`}>
                {t.account}
              </h2>

              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.accountSubtitle}
              </p>
            </div>

            <div
              className={`mt-6 rounded-3xl border p-5 ${
                isDark
                  ? "border-red-400/20 bg-red-400/10"
                  : "border-red-100 bg-red-50"
              }`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className={`text-sm font-bold ${
                      isDark ? "text-red-100" : "text-red-900"
                    }`}
                  >
                    {t.logout}
                  </p>

                  <p
                    className={`mt-1 max-w-md text-sm leading-6 ${
                      isDark ? "text-red-100/75" : "text-red-800/80"
                    }`}
                  >
                    {t.logoutHint}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoggingOut ? t.logoutLoading : t.logout}
                </button>
              </div>
            </div>

            <div className={`mt-5 rounded-3xl border p-5 ${softCardClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-bold ${titleClass}`}>
                    {t.supabaseLater}
                  </p>

                  <p className={`mt-1 text-sm leading-6 ${textClass}`}>
                    {t.localProfileHint}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                    isDark
                      ? "border-white/10 bg-white/10 text-slate-300"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {t.comingLater}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}