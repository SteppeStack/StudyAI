"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { Subscription, getCurrentSubscription } from "@/lib/dashboardData";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_plan: string | null;
  account_role: "student" | "teacher" | null;
};

const pageText = {
  en: {
    title: "Settings",
    subtitle: "Manage your profile and account information.",
    backToDashboard: "Back to Dashboard",
    profileInfo: "Profile Information",
    profileInfoSubtitle:
      "You can update your name and avatar URL. Email, role, and plan are controlled by the system.",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    avatarUrl: "Avatar URL",
    avatarPlaceholder: "https://example.com/avatar.png",
    avatarNote: "File upload is not connected yet. Use an image URL for now.",
    email: "Email",
    accountRole: "Account role",
    currentPlan: "Current plan",
    saveChanges: "Save changes",
    saving: "Saving...",
    success: "Profile updated successfully.",
    errorLoad: "Could not load profile.",
    errorSave: "Could not save profile changes.",
    loading: "Loading settings...",
    accountSummary: "Account Summary",
    plan: "Plan",
    status: "Status",
    noteTitle: "Note",
    note:
      "Role and subscription cannot be changed from settings. They are managed by the backend and billing logic.",
    student: "Student",
    teacher: "Teacher",
    free: "Free",
    active: "Active",
  },

  ru: {
    title: "Настройки",
    subtitle: "Управляйте профилем и информацией аккаунта.",
    backToDashboard: "Назад в панель",
    profileInfo: "Информация профиля",
    profileInfoSubtitle:
      "Вы можете изменить имя и ссылку на аватар. Email, роль и план контролируются системой.",
    fullName: "Полное имя",
    fullNamePlaceholder: "Ваше полное имя",
    avatarUrl: "Ссылка на аватар",
    avatarPlaceholder: "https://example.com/avatar.png",
    avatarNote: "Загрузка файлов пока не подключена. Используйте ссылку на изображение.",
    email: "Email",
    accountRole: "Роль аккаунта",
    currentPlan: "Текущий план",
    saveChanges: "Сохранить изменения",
    saving: "Сохранение...",
    success: "Профиль успешно обновлён.",
    errorLoad: "Не удалось загрузить профиль.",
    errorSave: "Не удалось сохранить изменения.",
    loading: "Загрузка настроек...",
    accountSummary: "Информация аккаунта",
    plan: "План",
    status: "Статус",
    noteTitle: "Примечание",
    note:
      "Роль и подписку нельзя изменить в настройках. Они управляются backend и billing логикой.",
    student: "Студент",
    teacher: "Преподаватель",
    free: "Бесплатный",
    active: "Активен",
  },

  kz: {
    title: "Баптаулар",
    subtitle: "Профиль және аккаунт ақпаратын басқарыңыз.",
    backToDashboard: "Панельге қайту",
    profileInfo: "Профиль ақпараты",
    profileInfoSubtitle:
      "Атыңызды және аватар сілтемесін өзгерте аласыз. Email, рөл және жоспар жүйе арқылы басқарылады.",
    fullName: "Толық аты",
    fullNamePlaceholder: "Толық атыңыз",
    avatarUrl: "Аватар сілтемесі",
    avatarPlaceholder: "https://example.com/avatar.png",
    avatarNote: "Файл жүктеу әлі қосылмаған. Әзірге сурет сілтемесін қолданыңыз.",
    email: "Email",
    accountRole: "Аккаунт рөлі",
    currentPlan: "Қазіргі жоспар",
    saveChanges: "Өзгерістерді сақтау",
    saving: "Сақталуда...",
    success: "Профиль сәтті жаңартылды.",
    errorLoad: "Профильді жүктеу мүмкін болмады.",
    errorSave: "Өзгерістерді сақтау мүмкін болмады.",
    loading: "Баптаулар жүктелуде...",
    accountSummary: "Аккаунт ақпараты",
    plan: "Жоспар",
    status: "Статус",
    noteTitle: "Ескерту",
    note:
      "Рөл мен жазылымды баптаулардан өзгертуге болмайды. Олар backend және billing логикасы арқылы басқарылады.",
    student: "Студент",
    teacher: "Мұғалім",
    free: "Тегін",
    active: "Белсенді",
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = pageText[language];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const user = sessionData.session.user;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setErrorMessage(text.errorLoad);
      }

      if (profileData) {
        const loadedProfile = profileData as Profile;

        setProfile(loadedProfile);
        setFullName(loadedProfile.full_name || "");
        setAvatarUrl(loadedProfile.avatar_url || "");
      }

      const { data: subscriptionData } = await getCurrentSubscription();

      setSubscription(subscriptionData as Subscription | null);
      setLoading(false);
    }

    loadSettings();
  }, [router, text.errorLoad]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profile) return;

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      setErrorMessage(text.errorSave);
      setSaving(false);
      return;
    }

    setProfile(data as Profile);
    setSuccessMessage(text.success);
    setSaving(false);
  }

  function translateRole(role: string) {
    if (role.toLowerCase() === "student") return text.student;
    if (role.toLowerCase() === "teacher") return text.teacher;
    return role;
  }

  function translatePlan(plan: string) {
    if (plan.toLowerCase() === "free") return text.free;
    return plan;
  }

  function translateStatus(status: string) {
    if (status.toLowerCase() === "active") return text.active;
    return status;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <AppSidebar />

        <section className="min-h-screen px-4 pt-20 lg:ml-[300px] lg:flex lg:items-center lg:justify-center lg:pt-0">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              {text.loading}
            </p>
          </div>
        </section>
      </main>
    );
  }

  const currentPlanRaw = subscription?.plans;
  const currentPlan = Array.isArray(currentPlanRaw)
    ? currentPlanRaw[0]
    : currentPlanRaw;

  const planName = translatePlan(currentPlan?.display_name || "Free");
  const accountRole = translateRole(profile?.account_role || "student");
  const status = translateStatus(subscription?.status || "active");

  const initials = fullName
    ? fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:ml-[300px] lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-[1680px]">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{text.title}</h1>
              <p className="mt-2 text-slate-500">{text.subtitle}</p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {text.backToDashboard}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
            <form
              onSubmit={handleSave}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-bold">{text.profileInfo}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {text.profileInfoSubtitle}
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {text.fullName}
                  </label>

                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={text.fullNamePlaceholder}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {text.avatarUrl}
                  </label>

                  <input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={text.avatarPlaceholder}
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    {text.avatarNote}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {text.email}
                  </label>

                  <input
                    value={profile?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.accountRole}
                    </label>

                    <input
                      value={accountRole}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.currentPlan}
                    </label>

                    <input
                      value={planName}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {successMessage && (
                <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? text.saving : text.saveChanges}
                </button>
              </div>
            </form>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">{text.accountSummary}</h3>

                <div className="mt-6 flex items-center gap-4">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                      {initials}
                    </div>
                  )}

                  <div>
                    <p className="font-bold">{fullName || "Student"}</p>
                    <p className="text-sm text-slate-500">{accountRole}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">{text.plan}</span>
                    <span className="font-semibold">{planName}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">{text.status}</span>
                    <span className="font-semibold">{status}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">{text.email}</span>
                    <span className="max-w-[180px] truncate font-semibold">
                      {profile?.email || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="font-bold text-blue-700">{text.noteTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-blue-700">
                  {text.note}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}