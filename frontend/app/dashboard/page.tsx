"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
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
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_plan: string | null;
  account_role: "student" | "teacher" | null;
};

const tools = [
  {
    icon: "AI",
    title: "AI Tutor",
    description: "Get personalized explanations and step-by-step guidance.",
    button: "Start Learning →",
    href: "/ai-tutor",
    color: "bg-blue-50 text-blue-600",
    buttonColor: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: "AH",
    title: "Assignment Helper",
    description: "Analyze assignments, get feedback, and improve your answers.",
    button: "Open Helper →",
    href: "/dashboard",
    color: "bg-green-50 text-green-500",
    buttonColor: "bg-green-50 text-green-600 border-green-100",
  },
  {
    icon: "DA",
    title: "Diploma Assistant",
    description: "Get help with diploma projects and academic writing.",
    button: "Go to Diploma →",
    href: "/dashboard",
    color: "bg-violet-50 text-violet-600",
    buttonColor: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    icon: "DG",
    title: "Document Generator",
    description: "Create reports, essays, summaries, and documents.",
    button: "Create Document →",
    href: "/dashboard",
    color: "bg-orange-50 text-orange-500",
    buttonColor: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    icon: "EP",
    title: "Exam Preparation",
    description: "Prepare for exams with quizzes, flashcards, and study plans.",
    button: "Start Preparing →",
    href: "/dashboard",
    color: "bg-emerald-50 text-emerald-500",
    buttonColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: "FA",
    title: "File Assistant",
    description: "Upload study files and get summaries, key points, and questions.",
    button: "Open Files →",
    href: "/dashboard",
    color: "bg-cyan-50 text-cyan-600",
    buttonColor: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<MonthlyUsage | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    async function loadDashboard() {
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
        console.error(profileError.message);
      }

      setProfile(profileData as Profile);

      const { data: subscriptionData, error: subscriptionError } =
        await getCurrentSubscription();

      if (subscriptionError) {
        console.error(subscriptionError.message);
      }

      setSubscription(subscriptionData as Subscription | null);

      const { data: usageData, error: usageError } =
        await getCurrentMonthUsage();

      if (usageError) {
        console.error(usageError.message);
      }

      setUsage(usageData as MonthlyUsage | null);

      const { data: activityData, error: activityError } =
        await getRecentActivity();

      if (activityError) {
        console.error(activityError.message);
      }

      setActivity((activityData || []) as ActivityEvent[]);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading...</p>
      </main>
    );
  }

  const currentPlanRaw = subscription?.plans;
  const currentPlan = Array.isArray(currentPlanRaw)
    ? currentPlanRaw[0]
    : currentPlanRaw;

  const planName = currentPlan?.display_name || "Free";
  const subscriptionStatus = subscription?.status || "active";

  const monthlyLimit = currentPlan?.monthly_ai_request_limit || 300;
  const aiRequestsUsed = usage?.ai_requests_used || 0;
  const documentsGenerated = usage?.documents_generated || 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="ml-[270px] flex min-h-screen flex-col">
        <header className="fixed left-[270px] right-0 top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-10">
          <input
            className="w-[420px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search anything..."
          />

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200" />

            <div>
              <p className="text-sm font-bold">
                {profile?.full_name || "Student"}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {profile?.account_role || "student"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="ml-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-500"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="px-10 pb-10 pt-28">
          <div className="mb-10">
            <h2 className="text-3xl font-bold">
              Welcome back, {profile?.full_name || "Student"}!
            </h2>
            <p className="mt-2 text-slate-500">
              Ready to continue your learning journey?
            </p>
          </div>

          <div className="grid grid-cols-[700px_360px] gap-10">
            <div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                {tools.map((tool) => (
                  <div key={tool.title}>
                    <div className="h-[170px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div
                        className={`mb-5 flex h-[42px] w-[42px] items-center justify-center rounded-xl text-xs font-bold ${tool.color}`}
                      >
                        {tool.icon}
                      </div>

                      <h3 className="text-lg font-bold">{tool.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {tool.description}
                      </p>
                    </div>

                    <button
                      onClick={() => router.push(tool.href)}
                      className={`mt-3 rounded-lg border px-4 py-2 text-xs font-medium ${tool.buttonColor}`}
                    >
                      {tool.button}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-20 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-xl font-bold">Recent Activity</h3>
                  <button className="text-sm font-medium text-blue-600">
                    View all
                  </button>
                </div>

                {activity.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No activity yet.
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Your recent AI chats, documents, and study actions will
                      appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activity.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                            {event.event_type?.slice(0, 1).toUpperCase() ||
                              "A"}
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {event.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {event.description ||
                                new Date(event.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-medium capitalize text-green-500">
                          {event.status || "Completed"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">Your Plan</p>
                  <span className="text-xs font-medium capitalize text-green-500">
                    {subscriptionStatus}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold">{planName}</h3>

                <p className="mt-2 text-sm text-slate-500">
                  Monthly limit: {monthlyLimit} AI requests
                </p>

                <button
  onClick={() => router.push("/subscription")}
  className="mt-6 w-full rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-blue-600"
>
  Manage Subscription
</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold">Usage This Month</p>

                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold">
                    {aiRequestsUsed} / {monthlyLimit}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    AI requests used
                  </p>
                </div>

                <button
  onClick={() => router.push("/subscription")}
  className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white"
>
  Upgrade Plan
</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Quick Stats</h3>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Requests</span>
                    <span className="font-semibold">
                      {aiRequestsUsed} / {monthlyLimit}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Documents Generated
                    </span>
                    <span className="font-semibold">{documentsGenerated}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Role</span>
                    <span className="font-semibold capitalize">
                      {profile?.account_role || "student"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan Status</span>
                    <span className="font-semibold capitalize">
                      {subscriptionStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Study Streak</h3>
                <p className="mt-4 text-2xl font-bold">🔥 7 days</p>
                <p className="mt-1 text-sm text-slate-500">Keep it up!</p>

                <div className="mt-5 flex gap-3">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div key={`${day}-${index}`} className="text-center">
                      <p className="mb-2 text-xs text-slate-500">{day}</p>
                      <div
                        className={`h-4 w-4 rounded-full ${
                          index < 5 ? "bg-blue-600" : "bg-blue-100"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}