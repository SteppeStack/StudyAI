"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";

const pageText = {
  en: {
    title: "Payment",
    subtitle: "Complete your subscription upgrade.",
    backToSubscription: "Back to Subscription",
    paymentDetails: "Payment Details",
    paymentSubtitle:
      "This is a frontend payment page for MVP. Real payment processing will be connected later.",
    choosePlan: "Choose plan",
    billingInfo: "Billing information",
    fullName: "Full name",
    email: "Email",
    country: "Country",
    paymentMethod: "Payment method",
    cardNumber: "Card number",
    expiryDate: "Expiry date",
    cvc: "CVC",
    cardholderName: "Cardholder name",
    orderSummary: "Order Summary",
    selectedPlan: "Selected plan",
    monthlyPrice: "Monthly price",
    tax: "Tax",
    total: "Total",
    payNow: "Pay now",
    processing: "Processing...",
    successTitle: "Payment page ready.",
    successText:
      "Real payment gateway is not connected yet. This page is ready for backend/payment integration.",
    required: "Please fill in all required fields.",
    secureNote:
      "Payment processing is not active yet. Do not enter real card details.",
    studentPlan: "Student Plan",
    teacherPlan: "Teacher Plan",
    freePlan: "Free Plan",
    month: "month",
  },

  ru: {
    title: "Оплата",
    subtitle: "Завершите обновление подписки.",
    backToSubscription: "Назад к подписке",
    paymentDetails: "Данные оплаты",
    paymentSubtitle:
      "Это frontend-страница оплаты для MVP. Реальная обработка платежей будет подключена позже.",
    choosePlan: "Выберите план",
    billingInfo: "Платёжная информация",
    fullName: "Полное имя",
    email: "Email",
    country: "Страна",
    paymentMethod: "Способ оплаты",
    cardNumber: "Номер карты",
    expiryDate: "Срок действия",
    cvc: "CVC",
    cardholderName: "Имя владельца карты",
    orderSummary: "Итог заказа",
    selectedPlan: "Выбранный план",
    monthlyPrice: "Цена в месяц",
    tax: "Налог",
    total: "Итого",
    payNow: "Оплатить",
    processing: "Обработка...",
    successTitle: "Страница оплаты готова.",
    successText:
      "Реальный платёжный шлюз пока не подключён. Страница готова для интеграции с backend/payment.",
    required: "Пожалуйста, заполните все обязательные поля.",
    secureNote:
      "Обработка платежей пока не активна. Не вводите настоящие данные карты.",
    studentPlan: "Студент",
    teacherPlan: "Преподаватель",
    freePlan: "Бесплатный",
    month: "месяц",
  },

  kz: {
    title: "Төлем",
    subtitle: "Жазылымды жаңартуды аяқтаңыз.",
    backToSubscription: "Жазылымға қайту",
    paymentDetails: "Төлем мәліметтері",
    paymentSubtitle:
      "Бұл MVP үшін frontend төлем беті. Нақты төлем өңдеу кейін қосылады.",
    choosePlan: "Жоспар таңдаңыз",
    billingInfo: "Төлем ақпараты",
    fullName: "Толық аты",
    email: "Email",
    country: "Ел",
    paymentMethod: "Төлем әдісі",
    cardNumber: "Карта нөмірі",
    expiryDate: "Жарамдылық мерзімі",
    cvc: "CVC",
    cardholderName: "Карта иесінің аты",
    orderSummary: "Тапсырыс қорытындысы",
    selectedPlan: "Таңдалған жоспар",
    monthlyPrice: "Айлық баға",
    tax: "Салық",
    total: "Барлығы",
    payNow: "Төлеу",
    processing: "Өңделуде...",
    successTitle: "Төлем беті дайын.",
    successText:
      "Нақты төлем жүйесі әлі қосылмаған. Бұл бет backend/payment интеграциясына дайын.",
    required: "Барлық міндетті өрістерді толтырыңыз.",
    secureNote:
      "Төлем өңдеу әлі белсенді емес. Нақты карта деректерін енгізбеңіз.",
    studentPlan: "Студент",
    teacherPlan: "Мұғалім",
    freePlan: "Тегін",
    month: "ай",
  },
};

const planData = {
  free: {
    id: "free",
    price: 0,
  },
  student: {
    id: "student",
    price: 9,
  },
  teacher: {
    id: "teacher",
    price: 19,
  },
};

type PlanId = keyof typeof planData;

export default function PaymentPage() {
  const { language } = useLanguage();
  const text = pageText[language];

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("student");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const planName = useMemo(() => {
    if (selectedPlan === "free") return text.freePlan;
    if (selectedPlan === "student") return text.studentPlan;
    return text.teacherPlan;
  }, [selectedPlan, text]);

  const monthlyPrice = planData[selectedPlan].price;
  const tax = Number((monthlyPrice * 0.21).toFixed(2));
  const total = Number((monthlyPrice + tax).toFixed(2));

  function handlePayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !country.trim() ||
      !cardNumber.trim() ||
      !expiryDate.trim() ||
      !cvc.trim() ||
      !cardholderName.trim()
    ) {
      setErrorMessage(text.required);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(`${text.successTitle} ${text.successText}`);
    }, 900);
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
              href="/subscription"
              className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {text.backToSubscription}
            </Link>
          </header>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_420px]">
            <form
              onSubmit={handlePayment}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div>
                <h2 className="text-2xl font-bold">{text.paymentDetails}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {text.paymentSubtitle}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-bold">{text.choosePlan}</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("free")}
                    className={
                      selectedPlan === "free"
                        ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5 text-left"
                        : "rounded-2xl border border-slate-200 bg-white p-5 text-left hover:bg-slate-50"
                    }
                  >
                    <p className="font-bold">{text.freePlan}</p>
                    <p className="mt-2 text-sm text-slate-500">$0 / {text.month}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("student")}
                    className={
                      selectedPlan === "student"
                        ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5 text-left"
                        : "rounded-2xl border border-slate-200 bg-white p-5 text-left hover:bg-slate-50"
                    }
                  >
                    <p className="font-bold">{text.studentPlan}</p>
                    <p className="mt-2 text-sm text-slate-500">$9 / {text.month}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("teacher")}
                    className={
                      selectedPlan === "teacher"
                        ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5 text-left"
                        : "rounded-2xl border border-slate-200 bg-white p-5 text-left hover:bg-slate-50"
                    }
                  >
                    <p className="font-bold">{text.teacherPlan}</p>
                    <p className="mt-2 text-sm text-slate-500">$19 / {text.month}</p>
                  </button>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="mb-4 text-lg font-bold">{text.billingInfo}</h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.fullName}
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.email}
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.country}
                    </label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Czech Republic"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="mb-4 text-lg font-bold">{text.paymentMethod}</h3>

                <div className="mb-5 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={
                      paymentMethod === "card"
                        ? "rounded-2xl border-2 border-blue-600 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700"
                        : "rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    }
                  >
                    Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={
                      paymentMethod === "paypal"
                        ? "rounded-2xl border-2 border-blue-600 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700"
                        : "rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    }
                  >
                    PayPal
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.cardNumber}
                    </label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.expiryDate}
                    </label>
                    <input
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12/28"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.cvc}
                    </label>
                    <input
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {text.cardholderName}
                    </label>
                    <input
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Smith"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                  {successMessage}
                </div>
              )}

              <div className="mt-8 rounded-2xl border border-yellow-100 bg-yellow-50 p-5 text-sm leading-6 text-yellow-700">
                {text.secureNote}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? text.processing : text.payNow}
              </button>
            </form>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-10">
              <h2 className="text-xl font-bold">{text.orderSummary}</h2>

              <div className="mt-6 rounded-2xl bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-600">
                  {text.selectedPlan}
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-700">
                  {planName}
                </p>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">{text.monthlyPrice}</span>
                  <span className="font-bold">${monthlyPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">{text.tax}</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-lg font-bold">{text.total}</span>
                    <span className="text-lg font-bold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                {text.paymentSubtitle}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}