import { supabase } from "@/lib/supabase";

export type Plan = {
  id: string;
  display_name: string;
  audience: string;
  monthly_price_cents: number;
  currency: string;
  daily_ai_request_limit: number | null;
  monthly_ai_request_limit: number | null;
  is_active?: boolean;
};

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

export async function getPlans() {
  return await supabase
    .from("plans")
    .select(
      "id,display_name,audience,monthly_price_cents,currency,daily_ai_request_limit,monthly_ai_request_limit"
    )
    .order("monthly_price_cents", { ascending: true });
}

export async function getCurrentSubscription() {
  return await supabase
    .from("subscriptions")
    .select(
      "id,status,started_at,expires_at,plans(id,display_name,monthly_price_cents,currency,daily_ai_request_limit,monthly_ai_request_limit)"
    )
    .in("status", ["active", "trialing"])
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function getCurrentMonthUsage() {
  const currentMonthStart = getCurrentMonthStart();

  return await supabase
    .from("monthly_usage")
    .select("ai_requests_used,documents_generated,period_start")
    .eq("period_start", currentMonthStart)
    .maybeSingle();
}

export async function getRecentActivity() {
  return await supabase
    .from("activity_events")
    .select(
      "id,event_type,title,description,status,resource_type,resource_id,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(5);
}