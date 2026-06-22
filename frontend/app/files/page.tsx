"use client";

import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";

const pageText = {
  en: {
    title: "Files",
    subtitle: "Upload and manage study materials.",
    mainTitle: "File workspace",
    description:
      "This tool will allow students to upload, organize, and manage study files inside the StudyAI workspace.",
    card1: "Upload files",
    card1Text: "Add documents and study materials.",
    card2: "Organize",
    card2Text: "Keep files grouped by subject.",
    card3: "Use with AI",
    card3Text: "Prepare files for future AI features.",
    comingSoon: "Coming soon",
    soonText: "File upload and storage will be connected after backend support.",
    back: "Back to Dashboard",
  },
  ru: {
    title: "Файлы",
    subtitle: "Загружайте и управляйте учебными материалами.",
    mainTitle: "Рабочая область файлов",
    description:
      "Этот инструмент позволит студентам загружать, организовывать и управлять учебными файлами внутри StudyAI.",
    card1: "Загрузка файлов",
    card1Text: "Добавляйте документы и учебные материалы.",
    card2: "Организация",
    card2Text: "Группируйте файлы по предметам.",
    card3: "Использование с AI",
    card3Text: "Подготовьте файлы для будущих AI функций.",
    comingSoon: "Скоро будет",
    soonText: "Загрузка и хранение файлов будут подключены после backend поддержки.",
    back: "Назад в панель",
  },
  kz: {
    title: "Файлдар",
    subtitle: "Оқу материалдарын жүктеп, басқарыңыз.",
    mainTitle: "Файл жұмыс кеңістігі",
    description:
      "Бұл құрал студенттерге StudyAI ішінде оқу файлдарын жүктеуге, ұйымдастыруға және басқаруға мүмкіндік береді.",
    card1: "Файл жүктеу",
    card1Text: "Құжаттар мен оқу материалдарын қосыңыз.",
    card2: "Ұйымдастыру",
    card2Text: "Файлдарды пәндер бойынша топтастырыңыз.",
    card3: "AI арқылы қолдану",
    card3Text: "Файлдарды болашақ AI функцияларына дайындаңыз.",
    comingSoon: "Жақында",
    soonText: "Файл жүктеу және сақтау backend қолдауынан кейін қосылады.",
    back: "Панельге қайту",
  },
};

export default function FilesPage() {
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
                F
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