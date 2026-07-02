export type PricingPlanKey = "free" | "pro" | "premium";
export type PaidPricingPlanKey = Exclude<PricingPlanKey, "free">;
export type PricingBillingCycle = "monthly" | "yearly";
export type PricingLanguage = "en" | "ru" | "kz";

export const STUDYAI_PRICING: Record<
  PricingPlanKey,
  Record<PricingBillingCycle, number>
> = {
  free: {
    monthly: 0,
    yearly: 0,
  },
  pro: {
    monthly: 2.99,
    yearly: 24.99,
  },
  premium: {
    monthly: 5.99,
    yearly: 49.99,
  },
};

const periodSuffixes: Record<
  PricingLanguage,
  Record<PricingBillingCycle, string>
> = {
  en: {
    monthly: "/month",
    yearly: "/year",
  },
  ru: {
    monthly: "/мес",
    yearly: "/год",
  },
  kz: {
    monthly: "/ай",
    yearly: "/жыл",
  },
};

export function formatUsdPrice(
  plan: PricingPlanKey,
  billingCycle: PricingBillingCycle
) {
  const value = STUDYAI_PRICING[plan][billingCycle];

  return value === 0 ? "$0" : `$${value.toFixed(2)}`;
}

export function formatUsdPriceWithPeriod(
  plan: PricingPlanKey,
  billingCycle: PricingBillingCycle,
  language: PricingLanguage
) {
  if (plan === "free") return "$0";

  return `${formatUsdPrice(plan, billingCycle)}${periodSuffixes[language][billingCycle]}`;
}
