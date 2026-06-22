"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import {
  ActivityEvent,
  MonthlyUsage,
  Subscription,
  getCurrentMonthUsage,
  getCurrentSubscription,
  getRecentActivity,
} from "@/lib/dashboardData";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  subscription_plan: string | null;
  account_role: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<MonthlyUsage | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  const tools = [
    {
      title: t.tools.aiTutorTitle,
      description: t.tools.aiTutorDescription,
      href: "/ai-tutor",
    },
    {
      title: t.tools.assignmentsTitle,
      description: t.tools.assignmentsDescription,
      href: "/assignments",
    },
    {
      title: t.tools.diplomaTitle,
      description: t.tools.diplomaDescription,
      href: "/diploma",
    },
    {
      title: t.tools.documentsTitle,
      description: t.tools.documentsDescription,
      href: "/documents",
    },
    {
      title: t.tools.examPrepTitle,
      description: t.tools.examPrepDescription,
      href: "/exam-prep",
    },
    {
      title: t.tools.filesTitle,
      description: t.tools.filesDescription,
      href: "/files",
    },
  ];

  useEffect(() => {
    async function loadDashboard() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const user = sessionData.session.user;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name,email,avatar_url,subscription_plan,account_role")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: subscriptionData } = await getCurrentSubscription();
      const { data: usageData } = await getCurrentMonthUsage();
      const { data: activityData } = await getRecentActivity();

      setSubscription(subscriptionData as Subscription | null);
      setUsage(usageData as MonthlyUsage | null);
      setActivity((activityData || []) as ActivityEvent[]);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function translatePlanName(planName: string) {
    if (planName.toLowerCase() === "free") return t.common.free;
    return planName;
  }

  function translateRole(role: string) {
    if (role.toLowerCase() === "student") return t.common.student;
    return role;
  }

  function translateStatus(status: string) {
    if (status.toLowerCase() === "active") return t.common.active;
    return status;
  }

  const currentPlanRaw = subscription?.plans;
  const currentPlan = Array.isArray(currentPlanRaw)
    ? currentPlanRaw[0]
    : currentPlanRaw;

  const planName = translatePlanName(currentPlan?.display_name || "Free");
  const monthlyLimit = currentPlan?.monthly_ai_request_limit || 100;
  const usedRequests = usage?.ai_requests_used || 0;
  const documentsGenerated = usage?.documents_generated || 0;
  const usagePercent = Math.min((usedRequests / monthlyLimit) * 100, 100);

  const displayName = profile?.full_name || "Student";
  const email = profile?.email || "";
  const avatarUrl = profile?.avatar_url || "";

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <AppSidebar />

        <section className="min-h-screen px-4 pt-20 lg:ml-[300px] lg:flex lg:items-center lg:justify-center lg:pt-0">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              Loading dashboard...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:ml-[300px] lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-[1680px]">
          <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {t.dashboardPage.welcomeBack}, {displayName}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {t.dashboardPage.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 sm:w-[280px] xl:w-[360px]"
                placeholder={t.dashboardPage.search}
              />

              <button
                onClick={() => router.push("/settings")}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:bg-slate-50"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {initials || "ST"}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{email}</p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {t.common.logout}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {tools.map((tool) => (
                  <button
                    key={tool.href}
                    onClick={() => router.push(tool.href)}
                    className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600">
                      {tool.title[0]}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                      {tool.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {tool.description}
                    </p>
                  </button>
                ))}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {t.dashboardPage.recentActivity}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {t.dashboardPage.recentActivitySubtitle}
                    </p>
                  </div>

                  <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    {t.dashboardPage.viewAll}
                  </button>
                </div>

                {activity.length > 0 ? (
                  <div className="space-y-4">
                    {activity.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {item.description || item.event_type}
                            </p>
                          </div>

                          <span className="text-xs font-medium text-slate-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <p className="font-semibold text-slate-700">
                      {t.dashboardPage.noRecentActivity}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {t.dashboardPage.noRecentActivitySubtitle}
                    </p>
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">
                  {t.dashboardPage.yourPlan}
                </h2>

                <div className="mt-5 rounded-2xl bg-blue-50 p-5">
                  <p className="text-sm font-medium text-blue-600">
                    {t.dashboardPage.currentPlan}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-700">
                    {planName}
                  </p>

                  <p className="mt-2 text-sm text-blue-700">
                    {monthlyLimit} {t.dashboardPage.aiRequestsPerMonth}
                  </p>
                </div>

                <button
                  onClick={() => router.push("/subscription")}
                  className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {t.dashboardPage.manageSubscription}
                </button>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">
                  {t.dashboardPage.usageThisMonth}
                </h2>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-500">
                      {t.dashboardPage.aiRequests}
                    </span>
                    <span className="font-semibold">
                      {usedRequests} / {monthlyLimit}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      {t.dashboardPage.documents}
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      {documentsGenerated}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      {t.dashboardPage.chats}
                    </p>
                    <p className="mt-1 text-xl font-bold">{activity.length}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">
                  {t.dashboardPage.quickStats}
                </h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      {t.dashboardPage.accountRole}
                    </span>
                    <span className="font-semibold">
                      {translateRole(profile?.account_role || "student")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      {t.dashboardPage.planStatus}
                    </span>
                    <span className="font-semibold">
                      {translateStatus(subscription?.status || "active")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      {t.dashboardPage.workspace}
                    </span>
                    <span className="font-semibold">StudyAI</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}