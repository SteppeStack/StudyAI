"use client";

import AppShell from "@/components/AppShell";
import { type Language } from "@/lib/i18n";
import {
  STUDYAI_PRICING,
  type PaidPricingPlanKey,
} from "@/lib/pricing";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PlanKey = PaidPricingPlanKey;
type BillingCycle = "monthly" | "yearly";
type PaymentMethod = "card" | "paypal" | "bank";

const paymentText = {
  en: {
    title: "Payment",
    subtitle: "Complete your subscription upgrade securely.",
    badge: "Secure Checkout",
    mainTitle: "Complete your StudyAI upgrade",
    mainText:
      "Review your plan, choose a payment method, and confirm your subscription. This is currently an interface preview.",
    checkout: "Checkout",
    checkoutHint:
      "Payments are currently preview-only. Payment provider integration will be connected later through backend/API.",
    selectedPlan: "Selected plan",
    billingCycle: "Billing cycle",
    paymentMethod: "Payment method",
    cardDetails: "Card details",
    cardName: "Name on card",
    cardNamePlaceholder: "e.g. Alex Student",
    cardNumber: "Card number",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiry: "Expiry date",
    expiryPlaceholder: "MM/YY",
    cvc: "CVC",
    cvcPlaceholder: "123",
    billingEmail: "Billing email",
    billingEmailPlaceholder: "you@example.com",
    country: "Country",
    countryPlaceholder: "Select country",
    summary: "Order summary",
    subtotal: "Subtotal",
    discount: "Discount",
    taxes: "Taxes",
    total: "Total",
    payNow: "Pay now",
    processing: "Processing...",
    successTitle: "Payment preview completed",
    successText:
      "No real payment was made. Later this action will create a real subscription through the payment provider.",
    backToSubscription: "Back to subscription",
    secureNote: "Your payment will be processed securely.",
    previewNotice: "Interface preview",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Yearly price",
    planLabels: {
      pro: "Pro",
      premium: "Premium",
    },
    methodLabels: {
      card: "Card",
      paypal: "PayPal",
      bank: "Bank transfer",
    },
    planDescriptions: {
      pro: "For active students who use StudyAI every week.",
      premium: "For heavy academic work, thesis writing, and exam periods.",
    },
    countries: ["Czech Republic", "Germany", "Kazakhstan", "Poland", "Slovakia", "Other"],
    features: [
      "More AI credits",
      "Advanced academic tools",
      "Exam preparation support",
      "Document generation",
      "File-based study features",
    ],
  },

  ru: {
    title: "Оплата",
    subtitle: "Безопасно заверши улучшение подписки.",
    badge: "Безопасная оплата",
    mainTitle: "Заверши улучшение StudyAI",
    mainText:
      "Проверь выбранный план, выбери способ оплаты и подтверди подписку. Сейчас это предпросмотр интерфейса.",
    checkout: "Оплата",
    checkoutHint:
      "Платежи пока работают в preview-режиме. Интеграция платёжного провайдера будет подключена позже через сервер/API.",
    selectedPlan: "Выбранный план",
    billingCycle: "Период оплаты",
    paymentMethod: "Способ оплаты",
    cardDetails: "Данные карты",
    cardName: "Имя на карте",
    cardNamePlaceholder: "например: Alex Student",
    cardNumber: "Номер карты",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiry: "Срок действия",
    expiryPlaceholder: "ММ/ГГ",
    cvc: "CVC",
    cvcPlaceholder: "123",
    billingEmail: "Email для оплаты",
    billingEmailPlaceholder: "you@example.com",
    country: "Страна",
    countryPlaceholder: "Выбери страну",
    summary: "Итог заказа",
    subtotal: "Промежуточная сумма",
    discount: "Скидка",
    taxes: "Налоги",
    total: "Итого",
    payNow: "Оплатить",
    processing: "Обработка...",
    successTitle: "Предпросмотр оплаты завершён",
    successText:
      "Реальная оплата не была выполнена. Позже это действие будет создавать настоящую подписку через платёжного провайдера.",
    backToSubscription: "Вернуться к подписке",
    secureNote: "Оплата будет обработана безопасно.",
    previewNotice: "Предпросмотр интерфейса",
    monthly: "Ежемесячно",
    yearly: "Ежегодно",
    save: "Годовая цена",
    planLabels: {
      pro: "Pro",
      premium: "Premium",
    },
    methodLabels: {
      card: "Карта",
      paypal: "PayPal",
      bank: "Банковский перевод",
    },
    planDescriptions: {
      pro: "Для активных студентов, которые используют StudyAI каждую неделю.",
      premium: "Для интенсивной учёбы, диплома и периода экзаменов.",
    },
    countries: ["Чехия", "Германия", "Казахстан", "Польша", "Словакия", "Другое"],
    features: [
      "Больше AI-кредитов",
      "Продвинутые учебные инструменты",
      "Поддержка подготовки к экзаменам",
      "Генерация документов",
      "Учёба на основе файлов",
    ],
  },

  kz: {
    title: "Төлем",
    subtitle: "Жазылымды қауіпсіз түрде жақсарт.",
    badge: "Қауіпсіз төлем",
    mainTitle: "StudyAI жоспарын жақсартуды аяқта",
    mainText:
      "Таңдалған жоспарды тексер, төлем әдісін таңда және жазылымды раста. Қазір бұл интерфейс preview режимінде.",
    checkout: "Төлем",
    checkoutHint:
      "Төлемдер әзірге preview режимінде жұмыс істейді. Төлем провайдері кейін сервер/API арқылы қосылады.",
    selectedPlan: "Таңдалған жоспар",
    billingCycle: "Төлем кезеңі",
    paymentMethod: "Төлем әдісі",
    cardDetails: "Карта деректері",
    cardName: "Картадағы аты",
    cardNamePlaceholder: "мысалы: Alex Student",
    cardNumber: "Карта нөмірі",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiry: "Жарамдылық мерзімі",
    expiryPlaceholder: "АА/ЖЖ",
    cvc: "CVC",
    cvcPlaceholder: "123",
    billingEmail: "Төлем email",
    billingEmailPlaceholder: "you@example.com",
    country: "Ел",
    countryPlaceholder: "Елді таңда",
    summary: "Тапсырыс қорытындысы",
    subtotal: "Аралық сома",
    discount: "Жеңілдік",
    taxes: "Салықтар",
    total: "Барлығы",
    payNow: "Төлеу",
    processing: "Өңделуде...",
    successTitle: "Төлем preview аяқталды",
    successText:
      "Нақты төлем жасалған жоқ. Кейін бұл әрекет төлем провайдері арқылы нақты жазылым жасайды.",
    backToSubscription: "Жазылымға оралу",
    secureNote: "Төлем қауіпсіз өңделеді.",
    previewNotice: "Интерфейс preview режимінде",
    monthly: "Ай сайын",
    yearly: "Жыл сайын",
    save: "Жылдық баға",
    planLabels: {
      pro: "Pro",
      premium: "Premium",
    },
    methodLabels: {
      card: "Карта",
      paypal: "PayPal",
      bank: "Банк аударымы",
    },
    planDescriptions: {
      pro: "StudyAI-ды апта сайын қолданатын белсенді студенттер үшін.",
      premium: "Интенсивті оқу, диплом және емтихан кезеңдері үшін.",
    },
    countries: ["Чехия", "Германия", "Қазақстан", "Польша", "Словакия", "Басқа"],
    features: [
      "Көбірек AI кредиттері",
      "Кеңейтілген оқу құралдары",
      "Емтиханға дайындық қолдауы",
      "Құжат генерациясы",
      "Файлдар арқылы оқу",
    ],
  },
};

const planPrices = {
  pro: STUDYAI_PRICING.pro,
  premium: STUDYAI_PRICING.premium,
};

const planPreviewStorageKey = "studyai-subscription-preview";
const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

function getStoredLanguage(): Language {
  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "en" || value === "ru" || value === "kz") return value;
  }

  return "en";
}

function formatPrice(value: number) {
  return value === 0 ? "$0" : `$${value.toFixed(2)}`;
}

function formatBillingPrice(
  value: number,
  billingCycle: BillingCycle,
  language: Language
) {
  const suffixes: Record<Language, Record<BillingCycle, string>> = {
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

  return `${formatPrice(value)}${suffixes[language][billingCycle]}`;
}

export default function PaymentPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [plan, setPlan] = useState<PlanKey>("pro");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = useMemo(() => paymentText[language], [language]);

  const subtotal = planPrices[plan][billingCycle];
  const discount = 0;
  const taxes = 0;
  const total = subtotal - discount + taxes;

  useEffect(() => {
    setLanguage(getStoredLanguage());

    const params = new URLSearchParams(window.location.search);
    const queryPlan = params.get("plan");
    const queryBilling = params.get("billing");
    const savedPlan = window.localStorage.getItem(planPreviewStorageKey);

    if (queryPlan === "pro" || queryPlan === "premium") {
      setPlan(queryPlan);
      window.localStorage.setItem(planPreviewStorageKey, queryPlan);
    } else if (savedPlan === "pro" || savedPlan === "premium") {
      setPlan(savedPlan);
    }

    if (queryBilling === "monthly" || queryBilling === "yearly") {
      setBillingCycle(queryBilling);
    }
  }, []);

  function handlePayment() {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 700);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-indigo-100/70 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                🔒 {t.badge}
              </div>

              <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {t.mainTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                {t.mainText}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-bold text-blue-700">
                {t.previewNotice}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                {t.checkoutHint}
              </p>
            </div>
          </div>
        </section>

        {success ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
              ✅
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">
              {t.successTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              {t.successText}
            </p>

            <Link
              href="/subscription"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700"
            >
              {t.backToSubscription}
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-950">
                    {t.checkout}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {t.checkoutHint}
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {t.selectedPlan}
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {(["pro", "premium"] as PlanKey[]).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setPlan(item);
                            window.localStorage.setItem(
                              planPreviewStorageKey,
                              item
                            );
                          }}
                          className={`rounded-3xl border p-4 text-left transition ${
                            plan === item
                              ? "border-blue-300 bg-blue-50 shadow-sm"
                              : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-slate-950">
                              {t.planLabels[item]}
                            </h3>
                            <span className="text-xl">
                              {item === "pro" ? "⚡" : "🚀"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {t.planDescriptions[item]}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {t.billingCycle}
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setBillingCycle("monthly")}
                        className={`h-12 rounded-full border text-sm font-bold transition ${
                          billingCycle === "monthly"
                            ? "border-blue-300 bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
                        }`}
                      >
                        {t.monthly}
                      </button>

                      <button
                        type="button"
                        onClick={() => setBillingCycle("yearly")}
                        className={`h-12 rounded-full border text-sm font-bold transition ${
                          billingCycle === "yearly"
                            ? "border-blue-300 bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
                        }`}
                      >
                        {t.yearly} · {t.save}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {t.paymentMethod}
                    </label>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {(["card", "paypal", "bank"] as PaymentMethod[]).map(
                        (method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`h-12 rounded-full border text-sm font-bold transition ${
                              paymentMethod === method
                                ? "border-blue-300 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
                            }`}
                          >
                            {method === "card" ? "💳 " : method === "paypal" ? "🅿️ " : "🏦 "}
                            {t.methodLabels[method]}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-lg font-black text-slate-950">
                        {t.cardDetails}
                      </h3>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            {t.cardName}
                          </label>
                          <input
                            value={cardName}
                            onChange={(event) => setCardName(event.target.value)}
                            placeholder={t.cardNamePlaceholder}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            {t.cardNumber}
                          </label>
                          <input
                            value={cardNumber}
                            onChange={(event) =>
                              setCardNumber(event.target.value)
                            }
                            placeholder={t.cardNumberPlaceholder}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                              {t.expiry}
                            </label>
                            <input
                              value={expiry}
                              onChange={(event) => setExpiry(event.target.value)}
                              placeholder={t.expiryPlaceholder}
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                              {t.cvc}
                            </label>
                            <input
                              value={cvc}
                              onChange={(event) => setCvc(event.target.value)}
                              placeholder={t.cvcPlaceholder}
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        {t.billingEmail}
                      </label>
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={t.billingEmailPlaceholder}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        {t.country}
                      </label>
                      <select
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="">{t.countryPlaceholder}</option>
                        {t.countries.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-black text-slate-950">
                  {t.summary}
                </h2>

                <div className="mt-5 rounded-3xl bg-blue-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-blue-700">
                        {t.planLabels[plan]}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {t.planDescriptions[plan]}
                      </p>
                    </div>

                    <span className="text-2xl">
                      {plan === "pro" ? "⚡" : "🚀"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{t.subtotal}</span>
                    <span className="font-bold text-slate-950">
                      {formatBillingPrice(subtotal, billingCycle, language)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{t.discount}</span>
                      <span className="font-bold text-emerald-600">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{t.taxes}</span>
                    <span className="font-bold text-slate-950">
                      {formatPrice(taxes)}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-slate-950">
                        {t.total}
                      </span>
                      <span className="text-3xl font-black text-slate-950">
                        {formatBillingPrice(total, billingCycle, language)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={processing}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {processing ? t.processing : t.payNow}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  🔒 {t.secureNote}
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">
                  {t.selectedPlan}
                </h2>

                <div className="mt-4 space-y-3">
                  {t.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-700">
                        ✓
                      </span>
                      <p className="text-sm leading-6 text-slate-600">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </AppShell>
  );
}
