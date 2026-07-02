"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell, {
  type AuthLanguage,
  type AuthTheme,
} from "@/components/AuthShell";
import { saveDisplayName } from "@/lib/profile";
import { supabase } from "@/lib/supabaseClient";

type RegisterCopy = {
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
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    submit: string;
    loading: string;
    hasAccount: string;
    login: string;
    passwordMismatch: string;
    firstNameRequired: string;
    lastNameRequired: string;
    successTitle: string;
    successText: string;
    errorFallback: string;
    supabaseMissing: string;
  };
};

const copy: Record<AuthLanguage, RegisterCopy> = {
  en: {
    shell: {
      badge: "Academic AI workspace",
      title: "Build your study system with AI.",
      subtitle:
        "Start with AI Tutor, assignment tracking, exam preparation, and document tools in one workspace.",
      benefitAiTutor: "Clear explanations for difficult topics",
      benefitAssignments: "Organized assignment workflow",
      benefitExamPrep: "Exam preparation with practice plans",
      previewTitle: "Your workspace starts here",
      previewSubtitle: "Create an account and continue building StudyAI.",
      previewCardOne: "Tutor",
      previewCardTwo: "Tasks",
      previewCardThree: "Files",
    },
    form: {
      badge: "Create account",
      title: "Join StudyAI",
      subtitle: "Create your account and start organizing your study workflow.",
      firstName: "First name",
      firstNamePlaceholder: "First name",
      lastName: "Last name",
      lastNamePlaceholder: "Last name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Password",
      passwordPlaceholder: "Create a password",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "Repeat your password",
      submit: "Create account",
      loading: "Creating account...",
      hasAccount: "Already have an account?",
      login: "Log in",
      passwordMismatch: "Passwords do not match.",
      firstNameRequired: "First name is required.",
      lastNameRequired: "Last name is required.",
      successTitle: "Check your email",
      successText:
        "Your account was created. Confirm your email if Supabase email confirmation is enabled.",
      errorFallback: "Could not create account. Try again.",
      supabaseMissing: "Supabase client is not configured.",
    },
  },
  ru: {
    shell: {
      badge: "Academic AI workspace",
      title: "Создай свою учебную систему с AI.",
      subtitle:
        "Начни с AI Tutor, отслеживания заданий, подготовки к экзаменам и работы с документами в одном workspace.",
      benefitAiTutor: "Понятные объяснения сложных тем",
      benefitAssignments: "Организованный workflow для заданий",
      benefitExamPrep: "Подготовка к экзаменам по плану",
      previewTitle: "Твой workspace начинается здесь",
      previewSubtitle: "Создай аккаунт и продолжи развивать StudyAI.",
      previewCardOne: "Tutor",
      previewCardTwo: "Задачи",
      previewCardThree: "Файлы",
    },
    form: {
      badge: "Создание аккаунта",
      title: "Присоединиться к StudyAI",
      subtitle:
        "Создай аккаунт и начни организовывать свой учебный процесс.",
      firstName: "Имя",
      firstNamePlaceholder: "Имя",
      lastName: "Фамилия",
      lastNamePlaceholder: "Фамилия",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Пароль",
      passwordPlaceholder: "Создайте пароль",
      confirmPassword: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Повторите пароль",
      submit: "Создать аккаунт",
      loading: "Создание аккаунта...",
      hasAccount: "Уже есть аккаунт?",
      login: "Войти",
      passwordMismatch: "Пароли не совпадают.",
      firstNameRequired: "Введите имя.",
      lastNameRequired: "Введите фамилию.",
      successTitle: "Проверь email",
      successText:
        "Аккаунт создан. Подтверди email, если в Supabase включено подтверждение почты.",
      errorFallback: "Не удалось создать аккаунт. Попробуй снова.",
      supabaseMissing: "Supabase client не настроен.",
    },
  },
  kz: {
    shell: {
      badge: "Academic AI workspace",
      title: "AI арқылы оқу жүйеңізді жасаңыз.",
      subtitle:
        "AI Tutor, тапсырма бақылау, емтиханға дайындық және құжат құралдарын бір workspace ішінде қолданыңыз.",
      benefitAiTutor: "Күрделі тақырыптарға түсінікті жауаптар",
      benefitAssignments: "Тапсырмаларға арналған жүйелі workflow",
      benefitExamPrep: "Жоспар бойынша емтиханға дайындық",
      previewTitle: "Workspace осы жерден басталады",
      previewSubtitle: "Аккаунт жасап, StudyAI жұмысын жалғастырыңыз.",
      previewCardOne: "Tutor",
      previewCardTwo: "Тапсырмалар",
      previewCardThree: "Файлдар",
    },
    form: {
      badge: "Аккаунт жасау",
      title: "StudyAI-ға қосылу",
      subtitle: "Аккаунт жасап, оқу процесіңізді ұйымдастыруды бастаңыз.",
      firstName: "Аты",
      firstNamePlaceholder: "Аты",
      lastName: "Тегі",
      lastNamePlaceholder: "Тегі",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Құпиясөз",
      passwordPlaceholder: "Құпиясөз жасаңыз",
      confirmPassword: "Құпиясөзді растау",
      confirmPasswordPlaceholder: "Құпиясөзді қайталаңыз",
      submit: "Аккаунт жасау",
      loading: "Аккаунт жасалуда...",
      hasAccount: "Аккаунтыңыз бар ма?",
      login: "Кіру",
      passwordMismatch: "Құпиясөздер сәйкес емес.",
      firstNameRequired: "Атыңызды енгізіңіз.",
      lastNameRequired: "Тегіңізді енгізіңіз.",
      successTitle: "Email тексеріңіз",
      successText:
        "Аккаунт жасалды. Supabase email растауы қосулы болса, поштаңызды растаңыз.",
      errorFallback: "Аккаунт жасау мүмкін болмады. Қайта көріңіз.",
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

export default function RegisterPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<AuthLanguage>("ru");
  const [theme, setTheme] = useState<AuthTheme>("dark");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");

    const cleanedFirstName = firstName.trim();
    const cleanedLastName = lastName.trim();
    const displayName = `${cleanedFirstName} ${cleanedLastName}`.trim();

    if (!cleanedFirstName) {
      setErrorMessage(t.form.firstNameRequired);
      return;
    }

    if (!cleanedLastName) {
      setErrorMessage(t.form.lastNameRequired);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t.form.passwordMismatch);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error(t.form.supabaseMissing);
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: cleanedFirstName,
            last_name: cleanedLastName,
            display_name: displayName,
          },
        },
      });

      if (error) {
        throw error;
      }

      saveDisplayName(displayName);
      setSuccessMessage(t.form.successText);

      window.setTimeout(() => {
        router.replace("/login");
      }, 1600);
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className={`text-sm font-bold ${titleClass}`}>
                {t.form.firstName}
              </span>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder={t.form.firstNamePlaceholder}
                required
                className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
              />
            </label>

            <label className="grid gap-2">
              <span className={`text-sm font-bold ${titleClass}`}>
                {t.form.lastName}
              </span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder={t.form.lastNamePlaceholder}
                required
                className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
              />
            </label>
          </div>

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
            <span className={`text-sm font-bold ${titleClass}`}>
              {t.form.password}
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t.form.passwordPlaceholder}
              required
              minLength={6}
              className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
            />
          </label>

          <label className="grid gap-2">
            <span className={`text-sm font-bold ${titleClass}`}>
              {t.form.confirmPassword}
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={t.form.confirmPasswordPlaceholder}
              required
              minLength={6}
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

          {successMessage && (
            <div
              className={`rounded-2xl border p-4 text-sm font-semibold ${
                isDark
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }`}
            >
              <p className="font-black">{t.form.successTitle}</p>
              <p className="mt-1">{successMessage}</p>
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
          {t.form.hasAccount}{" "}
          <Link
            href="/login"
            className="font-black text-blue-600 hover:text-blue-700"
          >
            {t.form.login}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
