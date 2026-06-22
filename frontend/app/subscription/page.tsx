"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import {
  getCurrentSubscription,
  getPlans,
  type Plan,
  type Subscription,
} from "@/lib/dashboardData";

const pageText = {
  en: {
    title: "Subscription",
    subtitle: "Choose the plan that fits your study workflow.",
    backToDashboard: "Back to Dashboard",
    currentPlan: "Current Plan",
    status: "Status",
    active: "Active",
    aiRequestsMonth: "AI requests / month",
    for: "For",
    all: "All",
    student: "Student",
    teacher: "Teacher",
    month: "month",
    dailyLimit: "Daily AI limit",
    monthlyLimit: "Monthly AI limit",
    currency: "Currency",
    current: "Current",
    currentPlanButton: "Current Plan",
    goToPayment: "Go to Payment",
    loading: "Loading subscription...",
    noPlans: "No plans found.",
    free: "Free",
    studentPremium: "Student Premium",
    teacherPlan: "Teacher Plan",
  },

  ru: {
    title: "Подписка",
    subtitle: "Выберите план, который подходит для вашего обучения.",
    backToDashboard: "Назад в панель",
    currentPlan: "Текущий план",
    status: "Статус",
    active: "Активен",
    aiRequestsMonth: "AI запросов / месяц",
    for: "Для",
    all: "всех",
    student: "студентов",
    teacher: "преподавателей",
    month: "месяц",
    dailyLimit: "Дневной лимит AI",
    monthlyLimit: "Месячный лимит AI",
    currency: "Валюта",
    current: "Текущий",
    currentPlanButton: "Текущий план",
    goToPayment: "Перейти к оплате",
    loading: "Загрузка подписки...",
    noPlans: "Планы не найдены.",
    free: "Бесплатный",
    studentPremium: "Студент Premium",
    teacherPlan: "План для преподавателя",
  },

  kz: {
    title: "Жазылым",
    subtitle: "Оқуыңызға сәйкес келетін жоспарды таңдаңыз.",
    backToDashboard: "Панельге қайту",
    currentPlan: "Қазіргі жоспар",
    status: "Статус",
    active: "Белсенді",
    aiRequestsMonth: "AI сұраныс / ай",
    for: "Арналған",
    all: "барлығына",
    student: "студенттерге",
    teacher: "мұғалімдерге",
    month: "ай",
    dailyLimit: "Күндік AI лимит",
    monthlyLimit: "Айлық AI лимит",
    currency: "Валюта",
    current: "Қазіргі",
    currentPlanButton: "Қазіргі жоспар",
    goToPayment: "Төлемге өту",
    loading: "Жазылым жүктелуде...",
    noPlans: "Жоспарлар табылмады.",
    free: "Тегін",
    studentPremium: "Студент Premium",
    teacherPlan: "Мұғалім жоспары",
  },
};

export default function SubscriptionPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = pageText[language];

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    async function loadSubscriptionPage() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const { data: plansData } = await getPlans();
      const { data: subscriptionData } = await getCurrentSubscription();

      setPlans((plansData || []) as Plan[]);
      setSubscription(subscriptionData as Subscription | null);
      setLoading(false);
    }

    loadSubscriptionPage();
  }, [router]);

  const currentPlanRaw = subscription?.plans;
  const currentPlanFromSubscription = Array.isArray(currentPlanRaw)
    ? currentPlanRaw[0]
    : currentPlanRaw;

  const currentPlan =
    currentPlanFromSubscription ||
    plans.find((plan) => plan.monthly_price_cents === 0) ||
    plans[0] ||
    null;

  function formatPrice(priceCents: number) {
    const price = priceCents / 100;

    if (price === 0) {
      return "$0";
    }

    return `$${price.toFixed(2)}`;
  }

  function getPlanName(plan: Plan) {
    const name = plan.display_name.toLowerCase();

    if (name.includes("free")) return text.free;
    if (name.includes("student")) return text.studentPremium;
    if (name.includes("teacher")) return text.teacherPlan;

    return plan.display_name;
  }

  function getAudience(audience: string) {
    const value = audience.toLowerCase();

    if (value.includes("all")) return text.all;
    if (value.includes("student")) return text.student;
    if (value.includes("teacher")) return text.teacher;

    return audience;
  }

  function getPaymentUrl(plan: Plan) {
    const name = plan.display_name.toLowerCase();

    if (name.includes("teacher")) return "/payment?plan=teacher";
    if (name.includes("student")) return "/payment?plan=student";
    if (name.includes("free")) return "/payment?plan=free";

    return "/payment";
  }

  function isCurrentPlan(plan: Plan) {
    if (!currentPlan) return false;
    return plan.id === currentPlan.id;
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:ml-[300px] lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-[1680px]">
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{text.title}</h1>
              <p className="mt-2 text-slate-500">{text.subtitle}</p>
            </div>

            <Link
              href="/dashboard"
              className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {text.backToDashboard}
            </Link>
          </header>

          {currentPlan && (
            <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {text.currentPlan}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {getPlanName(currentPlan)}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {text.status}: {text.active}
                  </p>
                </div>

                <div className="w-fit rounded-full bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-600">
                  {currentPlan.monthly_ai_request_limit || 0}{" "}
                  {text.aiRequestsMonth}
                </div>
              </div>
            </section>
          )}

          {plans.length === 0 ? (
            <section className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <p className="font-semibold text-slate-700">{text.noPlans}</p>
            </section>
          ) : (
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {plans.map((plan) => {
                const current = isCurrentPlan(plan);

                return (
                  <div
                    key={plan.id}
                    className={
                      current
                        ? "rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-sm"
                        : "rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {getPlanName(plan)}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          {text.for} {getAudience(plan.audience)}
                        </p>
                      </div>

                      {current && (
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                          {text.current}
                        </span>
                      )}
                    </div>

                    <div className="mt-8 flex items-end gap-2">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.monthly_price_cents)}
                      </span>

                      <span className="pb-1 text-sm text-slate-500">
                        /{text.month}
                      </span>
                    </div>

                    <div className="mt-8 space-y-5 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          {text.dailyLimit}
                        </span>
                        <span className="font-bold">
                          {plan.daily_ai_request_limit || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          {text.monthlyLimit}
                        </span>
                        <span className="font-bold">
                          {plan.monthly_ai_request_limit || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">{text.currency}</span>
                        <span className="font-bold">{plan.currency}</span>
                      </div>
                    </div>

                    {current ? (
                      <button
                        disabled
                        className="mt-8 w-full cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
                      >
                        {text.currentPlanButton}
                      </button>
                    ) : (
                      <Link
                        href={getPaymentUrl(plan)}
                        className="mt-8 block w-full rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        {text.goToPayment}
                      </Link>
                    )}
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}