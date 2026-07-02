"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell, {
  type AuthLanguage,
  type AuthTheme,
} from "@/components/AuthShell";
import { getDisplayNameFromMetadata, saveDisplayName } from "@/lib/profile";
import { supabase } from "@/lib/supabaseClient";

type LoginCopy = {
  shell: {
    badge: string;
    title: string;
    subtitle: string;
    benefitAiTutor: string;
    benefitAssignments: string;
    benefitExamPrep: string;
    previewTitle: string;
    previewSubtitle: string;
    previewCardOne: string;
    previewCardTwo: string;
    previewCardThree: string;
  };
  form: {
    badge: string;
    title: string;
    subtitle: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    submit: string;
    loading: string;
    noAccount: string;
    createAccount: string;
    errorFallback: string;
    supabaseMissing: string;
  };
};

const copy: Record<AuthLanguage, LoginCopy> = {
  en: {
    shell: {
      badge: "Academic AI workspace",
      title: "Study smarter with your AI study workspace.",
      subtitle:
        "Organize assignments, prepare for exams, review documents, and keep your study workflow in one clean place.",
      benefitAiTutor: "Ask AI Tutor for clear explanations",
      benefitAssignments: "Track assignments and deadlines",
      benefitExamPrep: "Prepare for exams with practice plans",
      previewTitle: "Weekly study progress",
      previewSubtitle: "Keep your academic tasks visible and organized.",
      previewCardOne: "AI Tutor",
      previewCardTwo: "Assignments",
      previewCardThree: "Exam prep",
    },
    form: {
      badge: "Welcome back",
      title: "Log in to StudyAI",
      subtitle: "Continue your academic workspace.",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot password?",
      submit: "Log in",
      loading: "Logging in...",
      noAccount: "Don’t have an account?",
      createAccount: "Create account",
      errorFallback: "Could not log in. Check your email and password.",
      supabaseMissing: "Supabase client is not configured.",
    },
  },
  ru: {
    shell: {
      badge: "Academic AI workspace",
      title: "Учись умнее вместе со своим AI workspace.",
      subtitle:
        "Организуй задания, готовься к экзаменам, работай с документами и держи учебный процесс в одном месте.",
      benefitAiTutor: "Задавай вопросы AI Tutor",
      benefitAssignments: "Отслеживай задания и дедлайны",
      benefitExamPrep: "Готовься к экзаменам по плану",
      previewTitle: "Учебный прогресс за неделю",
      previewSubtitle: "Держи учебные задачи под контролем.",
      previewCardOne: "AI Tutor",
      previewCardTwo: "Задания",
      previewCardThree: "Экзамены",
    },
    form: {
      badge: "С возвращением",
      title: "Войти в StudyAI",
      subtitle: "Продолжи работу в своём учебном workspace.",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Пароль",
      passwordPlaceholder: "Введите пароль",
      forgotPassword: "Забыли пароль?",
      submit: "Войти",
      loading: "Вход...",
      noAccount: "Нет аккаунта?",
      createAccount: "Создать аккаунт",
      errorFallback: "Не удалось войти. Проверь email и пароль.",
      supabaseMissing: "Supabase client не настроен.",
    },
  },
  kz: {
    shell: {
      badge: "Academic AI workspace",
      title: "AI workspace арқылы тиімді оқыңыз.",
      subtitle:
        "Тапсырмаларды реттеңіз, емтиханға дайындалыңыз, құжаттармен жұмыс істеңіз және оқу процесін бір жерде ұстаңыз.",
      benefitAiTutor: "AI Tutor арқылы түсіндірме алыңыз",
      benefitAssignments: "Тапсырмалар мен дедлайндарды бақылаңыз",
      benefitExamPrep: "Емтиханға жоспар бойынша дайындалыңыз",
      previewTitle: "Апталық оқу прогресі",
      previewSubtitle: "Оқу тапсырмаларын бақылауда ұстаңыз.",
      previewCardOne: "AI Tutor",
      previewCardTwo: "Тапсырмалар",
      previewCardThree: "Емтихандар",
    },
    form: {
      badge: "Қайта қош келдіңіз",
      title: "StudyAI жүйесіне кіру",
      subtitle: "Оқу workspace жұмысыңызды жалғастырыңыз.",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Құпиясөз",
      passwordPlaceholder: "Құпиясөзді енгізіңіз",
      forgotPassword: "Құпиясөзді ұмыттыңыз ба?",
      submit: "Кіру",
      loading: "Кіру...",
      noAccount: "Аккаунтыңыз жоқ па?",
      createAccount: "Аккаунт жасау",
      errorFallback: "Кіру мүмкін болмады. Email және құпиясөзді тексеріңіз.",
      supabaseMissing: "Supabase client бапталмаған.",
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

function getStoredLanguage(): AuthLanguage {
  if (typeof window === "undefined") return "ru";

  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "en" || value === "ru" || value === "kz") {
      return value;
    }
  }

  return "ru";
}

function getStoredTheme(): AuthTheme {
  if (typeof window === "undefined") return "dark";

  for (const key of themeStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "light" || value === "dark") {
      return value;
    }
  }

  return "dark";
}

function saveValueToStorage(keys: string[], value: string) {
  if (typeof window === "undefined") return;

  for (const key of keys) {
    window.localStorage.setItem(key, value);
  }
}

function applyTheme(theme: AuthTheme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.body.style.backgroundColor = theme === "dark" ? "#020617" : "#f8fafc";
}

export default function LoginPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<AuthLanguage>("ru");
  const [theme, setTheme] = useState<AuthTheme>("dark");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const t = copy[language];
  const isDark = theme === "dark";

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    const storedTheme = getStoredTheme();

    setLanguage(storedLanguage);
    setTheme(storedTheme);
    saveValueToStorage(languageStorageKeys, storedLanguage);
    saveValueToStorage(themeStorageKeys, storedTheme);
    applyTheme(storedTheme);
  }, []);

  function handleLanguageChange(nextLanguage: AuthLanguage) {
    setLanguage(nextLanguage);
    saveValueToStorage(languageStorageKeys, nextLanguage);

    window.dispatchEvent(
      new CustomEvent("studyai:language-change", {
        detail: nextLanguage,
      })
    );
  }

  function handleThemeToggle() {
    const nextTheme: AuthTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    saveValueToStorage(themeStorageKeys, nextTheme);
    applyTheme(nextTheme);

    window.dispatchEvent(
      new CustomEvent("studyai:theme-change", {
        detail: nextTheme,
      })
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error(t.form.supabaseMissing);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const metadata = data.user?.user_metadata;
      if (metadata) {
        const displayName = getDisplayNameFromMetadata(metadata);
        if (displayName) saveDisplayName(displayName);
      }

      router.replace("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t.form.errorFallback
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const titleClass = isDark ? "text-white" : "text-slate-950";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-500/10"
    : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/10";

  return (
    <AuthShell
      language={language}
      theme={theme}
      copy={t.shell}
      onLanguageChange={handleLanguageChange}
      onThemeToggle={handleThemeToggle}
    >
      <div>
        <div className="mb-8">
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${
              isDark
                ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                : "border-blue-100 bg-blue-50 text-blue-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            {t.form.badge}
          </div>

          <h1 className={`text-3xl font-black tracking-tight ${titleClass}`}>
            {t.form.title}
          </h1>

          <p className={`mt-2 text-sm leading-6 ${textClass}`}>
            {t.form.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="grid gap-2">
            <span className={`text-sm font-bold ${titleClass}`}>
              {t.form.email}
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.form.emailPlaceholder}
              required
              className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
            />
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className={`text-sm font-bold ${titleClass}`}>
                {t.form.password}
              </span>
              <button
                type="button"
                className="text-xs font-black text-blue-600 hover:text-blue-700"
              >
                {t.form.forgotPassword}
              </button>
            </div>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t.form.passwordPlaceholder}
              required
              className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
            />
          </label>

          {errorMessage && (
            <div
              className={`rounded-2xl border p-4 text-sm font-semibold ${
                isDark
                  ? "border-red-400/20 bg-red-400/10 text-red-100"
                  : "border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t.form.loading : t.form.submit}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm font-semibold ${mutedClass}`}>
          {t.form.noAccount}{" "}
          <Link
            href="/register"
            className="font-black text-blue-600 hover:text-blue-700"
          >
            {t.form.createAccount}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
