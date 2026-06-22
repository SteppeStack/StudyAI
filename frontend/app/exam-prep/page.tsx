"use client";

import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";

const pageText = {
  en: {
    title: "Exam Prep",
    subtitle: "Prepare for exams with structured revision tools.",
    mainTitle: "Exam preparation",
    description:
      "This tool will help students revise topics, generate practice questions, create flashcards, and track exam readiness.",
    card1: "Practice questions",
    card1Text: "Generate questions by topic.",
    card2: "Flashcards",
    card2Text: "Review key terms quickly.",
    card3: "Readiness",
    card3Text: "Track your preparation progress.",
    comingSoon: "Coming soon",
    soonText: "Exam preparation tools will be added in a later sprint.",
    back: "Back to Dashboard",
  },
  ru: {
    title: "Подготовка",
    subtitle: "Готовьтесь к экзаменам с помощью структурированных инструментов.",
    mainTitle: "Подготовка к экзаменам",
    description:
      "Этот инструмент поможет студентам повторять темы, создавать практические вопросы, делать карточки и отслеживать готовность к экзамену.",
    card1: "Практические вопросы",
    card1Text: "Создавайте вопросы по выбранной теме.",
    card2: "Карточки",
    card2Text: "Быстро повторяйте ключевые термины.",
    card3: "Готовность",
    card3Text: "Отслеживайте прогресс подготовки.",
    comingSoon: "Скоро будет",
    soonText: "Инструменты подготовки к экзаменам будут добавлены позже.",
    back: "Назад в панель",
  },
  kz: {
    title: "Емтиханға дайындық",
    subtitle: "Емтиханға құрылымды оқу құралдарымен дайындалыңыз.",
    mainTitle: "Емтиханға дайындық",
    description:
      "Бұл құрал студенттерге тақырыптарды қайталауға, практикалық сұрақтар жасауға, карточкалар құруға және дайындық деңгейін бақылауға көмектеседі.",
    card1: "Практикалық сұрақтар",
    card1Text: "Тақырып бойынша сұрақтар жасаңыз.",
    card2: "Карточкалар",
    card2Text: "Негізгі терминдерді тез қайталаңыз.",
    card3: "Дайындық деңгейі",
    card3Text: "Дайындық прогресін бақылаңыз.",
    comingSoon: "Жақында",
    soonText: "Емтиханға дайындық құралдары кейінгі sprint кезінде қосылады.",
    back: "Панельге қайту",
  },
};

export default function ExamPrepPage() {
  const { language } = useLanguage();
  const text = pageText[language];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:ml-[300px] lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-[1680px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{text.title}</h1>
            <p className="mt-2 text-slate-500">{text.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                E
              </div>

              <h2 className="text-2xl font-bold">{text.mainTitle}</h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-500">
                {text.description}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="font-semibold">{text.card1}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {text.card1Text}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="font-semibold">{text.card2}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {text.card2Text}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="font-semibold">{text.card3}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {text.card3Text}
                  </p>
                </div>
              </div>
            </section>

            <aside className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
              <h3 className="text-lg font-bold text-blue-700">
                {text.comingSoon}
              </h3>

              <p className="mt-3 text-sm leading-6 text-blue-700">
                {text.soonText}
              </p>

              <Link
                href="/dashboard"
                className="mt-6 block rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                {text.back}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}