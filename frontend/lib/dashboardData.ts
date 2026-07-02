import {
  getDashboardData,
  getDashboardPlans,
  type DashboardPlan,
} from "@/lib/studyApi";

export type Plan = DashboardPlan & { is_active?: boolean };

export type Subscription = {
  id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  plans: Plan | null;
};

export type MonthlyUsage = {
  period_start: string;
  ai_requests_used: number;
  documents_generated: number;
};

export type ActivityEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  status: string | null;
  resource_type: string | null;
  resource_id: string | null;
  created_at: string;
};

export function getCurrentMonthStart() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}-01`;
}

function missingSupabaseResponse() {
  return {
    data: null,
    error: new Error("Dashboard API data is unavailable."),
  };
}

export async function getPlans() {
  try {
    const data = await getDashboardPlans();

    return { data, error: null };
  } catch (error) {
    return { ...missingSupabaseResponse(), error };
  }
}

export async function getCurrentSubscription() {
  try {
    const data = await getDashboardData();

    return {
      data: {
        ...data.subscription,
        plans: data.subscription.plan,
      },
      error: null,
    };
  } catch (error) {
    return { ...missingSupabaseResponse(), error };
  }
}

export async function getCurrentMonthUsage() {
  try {
    const data = await getDashboardData();

    return { data: data.usage, error: null };
  } catch (error) {
    return { ...missingSupabaseResponse(), error };
  }
}

export async function getRecentActivity() {
  try {
    const data = await getDashboardData();

    return { data: data.recent_activity, error: null };
  } catch (error) {
    return { ...missingSupabaseResponse(), error };
  }
}
