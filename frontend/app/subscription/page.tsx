"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { supabase } from "@/lib/supabase";
import {
  Plan,
  Subscription,
  getCurrentSubscription,
  getPlans,
} from "@/lib/dashboardData";

function formatPrice(cents: number, currency: string) {
  if (cents === 0) {
    return "$0";
  }

  const amount = cents / 100;
  const symbol = currency === "USD" ? "$" : currency;

  return `${symbol}${amount.toFixed(2)}`;
}

export default function SubscriptionPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const { data: plansData, error: plansError } = await getPlans();

      if (plansError) {
        console.error(plansError.message);
      }

      setPlans((plansData || []) as Plan[]);

      const { data: subscriptionData, error: subscriptionError } =
        await getCurrentSubscription();

      if (subscriptionError) {
        console.error(subscriptionError.message);
      }

      setSubscription(subscriptionData as Subscription | null);
      setLoading(false);
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading subscription...</p>
      </main>
    );
  }

  const currentPlanRaw = subscription?.plans;
  const currentPlan = Array.isArray(currentPlanRaw)
    ? currentPlanRaw[0]
    : currentPlanRaw;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="ml-[270px] min-h-screen px-10 py-10">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription</h1>
            <p className="mt-2 text-slate-500">
              Choose the plan that fits your study workflow.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Current Plan</p>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {currentPlan?.display_name || "Free"}
              </h2>
              <p className="mt-1 text-sm capitalize text-slate-500">
                Status: {subscription?.status || "active"}
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              {currentPlan?.monthly_ai_request_limit || 300} AI requests / month
            </div>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-600">No plans available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id;

              return (
                <div
                  key={plan.id}
                  className={
                    isCurrentPlan
                      ? "rounded-2xl border-2 border-blue-600 bg-white p-7 shadow-sm"
                      : "rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                  }
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {plan.display_name}
                      </h3>
                      <p className="mt-1 text-sm capitalize text-slate-500">
                        For {plan.audience}
                      </p>
                    </div>

                    {isCurrentPlan && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-8">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan.monthly_price_cents, plan.currency)}
                    </span>
                    <span className="ml-2 text-sm text-slate-500">/month</span>
                  </div>

                  <div className="mt-8 space-y-4 text-sm text-slate-700">
                    <div className="flex justify-between">
                      <span>Daily AI limit</span>
                      <span className="font-semibold">
                        {plan.daily_ai_request_limit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Monthly AI limit</span>
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
                    disabled={isCurrentPlan}
                    className={
                      isCurrentPlan
                        ? "mt-8 w-full rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-400"
                        : "mt-8 w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
                    }
                  >
                    {isCurrentPlan ? "Current Plan" : "Upgrade Coming Soon"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}