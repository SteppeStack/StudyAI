"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlans, Plan } from "@/lib/dashboardData";

const features = [
  {
    icon: "AI",
    title: "AI Tutor",
    description:
      "Get personalized explanations, ask study questions, and learn step by step.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: "AH",
    title: "Assignment Helper",
    description:
      "Analyze assignments, improve answers, and receive structured guidance.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: "DA",
    title: "Diploma Assistant",
    description:
      "Get support with diploma projects, research structure, and academic writing.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: "DG",
    title: "Document Generator",
    description:
      "Create essays, reports, summaries, and study documents faster.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: "TT",
    title: "Teacher Tools",
    description:
      "Prepare assignments, tests, rubrics, and study materials for students.",
    color: "bg-pink-50 text-pink-600",
  },
];

function formatPrice(cents: number, currency: string) {
  if (cents === 0) {
    return "$0";
  }

  const amount = cents / 100;
  const symbol = currency === "USD" ? "$" : currency;

  return `${symbol}${amount.toFixed(2)}`;
}

export default function HomePage() {
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      const { data, error } = await getPlans();

      if (error) {
        console.error(error.message);
      } else {
        setPlans((data || []) as Plan[]);
      }

      setPlansLoading(false);
    }

    loadPlans();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold tracking-tight"
          >
            StudyAI
          </button>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="hover:text-blue-600">
              Pricing
            </a>
            <a href="#teachers" className="hover:text-blue-600">
              For Teachers
            </a>
            <button
              onClick={() => router.push("/login")}
              className="hover:text-blue-600"
            >
              Login
            </button>
          </nav>

          <button
            onClick={() => router.push("/register")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-8 py-20 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
            Your AI study companion for academic success
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Study smarter with{" "}
            <span className="text-blue-600">AI</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
            StudyAI helps students and teachers save time, understand better,
            and work with powerful AI tools in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => router.push("/register")}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push("/login")}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-slate-50"
            >
              Login
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-12 h-16 w-16 rounded-2xl border border-slate-200 bg-white shadow-sm" />
          <div className="absolute -right-6 top-10 h-14 w-14 rounded-2xl border border-slate-200 bg-white shadow-sm" />
          <div className="absolute -bottom-8 left-8 h-16 w-16 rounded-2xl border border-slate-200 bg-white shadow-sm" />

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <div className="grid grid-cols-[160px_1fr] gap-7">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="mb-6 font-bold">StudyAI</h3>

                <div className="space-y-4 text-sm font-medium text-slate-600">
                  <p className="text-slate-900">Dashboard</p>
                  <p>AI Tutor</p>
                  <p>Documents</p>
                  <p>Diploma</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-bold text-slate-500">
                    AI Score
                  </p>
                  <p className="mt-2 text-4xl font-bold">92%</p>
                  <p className="mt-2 text-sm font-semibold text-green-500">
                    Excellent
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-bold text-slate-500">
                    Progress
                  </p>
                  <p className="mt-3 text-sm font-semibold">
                    Documents generated
                  </p>
                  <p className="mt-2 text-lg font-bold text-blue-600">
                    128
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Everything you need to succeed
          </h2>
          <p className="mt-3 text-slate-500">
            Powerful AI tools designed for students and teachers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.slice(0, 3).map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
          {features.slice(3).map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-slate-500">
            Choose the plan that is right for you.
          </p>
        </div>

        {plansLoading ? (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-500">No plans available yet.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-bold">{plan.display_name}</h3>

                <p className="mt-2 text-sm capitalize text-slate-500">
                  For {plan.audience}
                </p>

                <div className="mt-8">
                  <span className="text-4xl font-bold">
                    {formatPrice(
                      plan.monthly_price_cents,
                      plan.currency
                    )}
                  </span>
                  <span className="ml-2 text-sm text-slate-500">
                    /month
                  </span>
                </div>

                <div className="mt-8 space-y-4 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Daily AI requests</span>
                    <span className="font-semibold">
                      {plan.daily_ai_request_limit}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Monthly AI requests</span>
                    <span className="font-semibold">
                      {plan.monthly_ai_request_limit}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Currency</span>
                    <span className="font-semibold">{plan.currency}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/register")}
                  className="mt-8 w-full rounded-xl border border-blue-100 bg-blue-50 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        id="teachers"
        className="mx-auto max-w-7xl px-8 py-16"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm md:p-14">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">
                Built for students and teachers
              </h2>
              <p className="mt-4 leading-7 text-slate-500">
                Students can learn faster, prepare for exams, and organize
                assignments. Teachers can prepare study materials, tasks, and
                structured feedback faster.
              </p>
            </div>

            <div className="flex justify-start md:justify-end">
              <button
                onClick={() => router.push("/register")}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                Start Using StudyAI
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-8 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 StudyAI. All rights reserved.</p>

          <div className="flex gap-5">
            <button
              onClick={() => router.push("/login")}
              className="hover:text-blue-600"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="hover:text-blue-600"
            >
              Register
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}