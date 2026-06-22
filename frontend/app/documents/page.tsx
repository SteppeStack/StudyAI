"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";

const pageText = {
  en: {
    title: "Documents",
    subtitle: "Generate academic documents, summaries, outlines, and study materials.",
    formTitle: "Document Generator",
    formSubtitle:
      "Choose the document type, language, and style, then generate a ready-to-edit text.",
    documentTitle: "Document title",
    documentTitlePlaceholder: "Example: The Impact of AI on Education",
    documentType: "Document type",
    documentLanguage: "Language",
    documentStyle: "Style",
    topic: "Topic / prompt",
    topicPlaceholder: "Describe what the document should be about...",
    requirements: "Requirements",
    requirementsPlaceholder:
      "Add length, structure, citations, teacher instructions, or specific points...",
    keywords: "Keywords",
    keywordsPlaceholder: "Example: AI, education, personalization, ethics",
    generateText: "Generate text",
    saveDocument: "Save document",
    clear: "Clear",
    generatedDocument: "Generated Document",
    savedDocuments: "Saved Documents",
    noSavedDocuments: "No saved documents yet.",
    required: "Please fill in the title, topic, document type, language, and style.",
    generatedReady: "Document text generated successfully.",
    savedReady: "Document saved locally.",
    nothingToSave: "Generate a document first.",
    backToDashboard: "Back to Dashboard",
    frontendNoteTitle: "Frontend status",
    frontendNote:
      "This page includes the frontend UI for document generation, document type selection, language and style selection, text generation preview, and local saving. Real AI generation and profile saving can be connected later through backend/API.",
    savedLocally: "Saved locally",
    documentTypes: [
      "Essay",
      "Report",
      "Summary",
      "Research outline",
      "Presentation text",
      "Formal email",
      "Study notes",
    ],
    languages: ["English", "Russian", "Kazakh"],
    styles: [
      "Academic",
      "Simple",
      "Professional",
      "Formal",
      "Short and clear",
      "Detailed",
    ],
    previewCards: [
      {
        title: "Document type",
        text: "Select what kind of text should be generated.",
      },
      {
        title: "Language and style",
        text: "Choose the output language and writing style.",
      },
      {
        title: "Save document",
        text: "Save generated drafts locally for later use.",
      },
    ],
    generatedIntro: "This document introduces the selected topic and explains its academic relevance.",
    generatedBody:
      "The main section develops the key ideas, connects them with the provided requirements, and organizes the content in a logical structure.",
    generatedConclusion:
      "In conclusion, the document summarizes the main points and provides a clear final statement based on the selected topic.",
  },

  ru: {
    title: "Документы",
    subtitle: "Генерируйте академические документы, summary, планы и учебные материалы.",
    formTitle: "Document Generator",
    formSubtitle:
      "Выберите тип документа, язык и стиль, затем сгенерируйте текст, который можно редактировать.",
    documentTitle: "Название документа",
    documentTitlePlaceholder: "Например: Влияние AI на образование",
    documentType: "Тип документа",
    documentLanguage: "Язык",
    documentStyle: "Стиль",
    topic: "Тема / prompt",
    topicPlaceholder: "Опишите, о чём должен быть документ...",
    requirements: "Требования",
    requirementsPlaceholder:
      "Добавьте объём, структуру, цитирование, инструкции преподавателя или важные пункты...",
    keywords: "Ключевые слова",
    keywordsPlaceholder: "Например: AI, образование, персонализация, этика",
    generateText: "Сгенерировать текст",
    saveDocument: "Сохранить документ",
    clear: "Очистить",
    generatedDocument: "Сгенерированный документ",
    savedDocuments: "Сохранённые документы",
    noSavedDocuments: "Пока нет сохранённых документов.",
    required: "Пожалуйста, заполните название, тему, тип документа, язык и стиль.",
    generatedReady: "Текст документа успешно сгенерирован.",
    savedReady: "Документ сохранён локально.",
    nothingToSave: "Сначала сгенерируйте документ.",
    backToDashboard: "Назад в панель",
    frontendNoteTitle: "Frontend статус",
    frontendNote:
      "Эта страница содержит frontend UI для генерации документов, выбора типа документа, выбора языка и стиля, предварительной генерации текста и локального сохранения. Реальную AI-генерацию и сохранение в профиле можно подключить позже через backend/API.",
    savedLocally: "Сохранено локально",
    documentTypes: [
      "Эссе",
      "Отчёт",
      "Summary",
      "План исследования",
      "Текст презентации",
      "Формальное письмо",
      "Учебные заметки",
    ],
    languages: ["Английский", "Русский", "Казахский"],
    styles: [
      "Академический",
      "Простой",
      "Профессиональный",
      "Формальный",
      "Коротко и понятно",
      "Подробный",
    ],
    previewCards: [
      {
        title: "Тип документа",
        text: "Выберите, какой именно текст нужно сгенерировать.",
      },
      {
        title: "Язык и стиль",
        text: "Выберите язык результата и стиль написания.",
      },
      {
        title: "Сохранение документа",
        text: "Сохраняйте сгенерированные черновики локально.",
      },
    ],
    generatedIntro:
      "Этот документ вводит выбранную тему и объясняет её академическую значимость.",
    generatedBody:
      "Основная часть раскрывает ключевые идеи, связывает их с указанными требованиями и выстраивает материал в логичную структуру.",
    generatedConclusion:
      "В заключение документ подводит итоги, выделяет основные мысли и формирует финальный вывод по выбранной теме.",
  },

  kz: {
    title: "Құжаттар",
    subtitle: "Академиялық құжаттар, summary, жоспарлар және оқу материалдарын жасаңыз.",
    formTitle: "Document Generator",
    formSubtitle:
      "Құжат түрін, тілін және стилін таңдап, өңдеуге дайын мәтін жасаңыз.",
    documentTitle: "Құжат атауы",
    documentTitlePlaceholder: "Мысалы: AI-дың білімге әсері",
    documentType: "Құжат түрі",
    documentLanguage: "Тіл",
    documentStyle: "Стиль",
    topic: "Тақырып / prompt",
    topicPlaceholder: "Құжат не туралы болуы керек екенін сипаттаңыз...",
    requirements: "Талаптар",
    requirementsPlaceholder:
      "Көлем, құрылым, citation, мұғалім нұсқаулары немесе маңызды пункттерді қосыңыз...",
    keywords: "Кілт сөздер",
    keywordsPlaceholder: "Мысалы: AI, білім, персонализация, этика",
    generateText: "Мәтін жасау",
    saveDocument: "Құжатты сақтау",
    clear: "Тазалау",
    generatedDocument: "Жасалған құжат",
    savedDocuments: "Сақталған құжаттар",
    noSavedDocuments: "Әзірге сақталған құжат жоқ.",
    required: "Құжат атауын, тақырыпты, құжат түрін, тілді және стильді толтырыңыз.",
    generatedReady: "Құжат мәтіні сәтті жасалды.",
    savedReady: "Құжат локалды сақталды.",
    nothingToSave: "Алдымен құжат жасаңыз.",
    backToDashboard: "Панельге қайту",
    frontendNoteTitle: "Frontend статусы",
    frontendNote:
      "Бұл бетте құжат жасау, құжат түрін таңдау, тіл және стиль таңдау, мәтін preview жасау және локалды сақтау үшін frontend UI бар. Нақты AI генерация және профильге сақтау кейін backend/API арқылы қосылады.",
    savedLocally: "Локалды сақталды",
    documentTypes: [
      "Эссе",
      "Есеп",
      "Summary",
      "Зерттеу жоспары",
      "Презентация мәтіні",
      "Ресми хат",
      "Оқу жазбалары",
    ],
    languages: ["Ағылшын", "Орыс", "Қазақ"],
    styles: [
      "Академиялық",
      "Қарапайым",
      "Кәсіби",
      "Ресми",
      "Қысқа әрі түсінікті",
      "Толық",
    ],
    previewCards: [
      {
        title: "Құжат түрі",
        text: "Қандай мәтін жасалу керек екенін таңдаңыз.",
      },
      {
        title: "Тіл және стиль",
        text: "Нәтиже тілін және жазу стилін таңдаңыз.",
      },
      {
        title: "Құжатты сақтау",
        text: "Жасалған draft мәтіндерді локалды сақтаңыз.",
      },
    ],
    generatedIntro:
      "Бұл құжат таңдалған тақырыпты таныстырып, оның академиялық маңызын түсіндіреді.",
    generatedBody:
      "Негізгі бөлім басты идеяларды ашып, оларды берілген талаптармен байланыстырады және мәтінді логикалық құрылымға келтіреді.",
    generatedConclusion:
      "Қорытынды бөлім негізгі ойларды жинақтап, таңдалған тақырып бойынша нақты финалдық тұжырым береді.",
  },
};

type SavedDocument = {
  id: string;
  title: string;
  type: string;
  language: string;
  style: string;
  content: string;
  createdAt: string;
};

export default function DocumentsPage() {
  const { language } = useLanguage();
  const text = pageText[language];

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentTypeIndex, setDocumentTypeIndex] = useState(0);
  const [documentLanguageIndex, setDocumentLanguageIndex] = useState(0);
  const [documentStyleIndex, setDocumentStyleIndex] = useState(0);
  const [topic, setTopic] = useState("");
  const [requirements, setRequirements] = useState("");
  const [keywords, setKeywords] = useState("");

  const [generatedText, setGeneratedText] = useState("");
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const documentType = text.documentTypes[documentTypeIndex] || text.documentTypes[0];
  const documentLanguage =
    text.languages[documentLanguageIndex] || text.languages[0];
  const documentStyle = text.styles[documentStyleIndex] || text.styles[0];

  useMemo(() => {
    const saved = localStorage.getItem("studyai_saved_documents");

    if (saved) {
      try {
        setSavedDocuments(JSON.parse(saved));
      } catch {
        setSavedDocuments([]);
      }
    }
  }, []);

  function handleGenerateText(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !documentTitle.trim() ||
      !topic.trim() ||
      !documentType.trim() ||
      !documentLanguage.trim() ||
      !documentStyle.trim()
    ) {
      setErrorMessage(text.required);
      setGeneratedText("");
      return;
    }

    const requirementsBlock = requirements.trim()
      ? `\n\nRequirements:\n${requirements.trim()}`
      : "";

    const keywordsBlock = keywords.trim()
      ? `\n\nKeywords:\n${keywords.trim()}`
      : "";

    const result = `${documentTitle}

Document type: ${documentType}
Language: ${documentLanguage}
Style: ${documentStyle}

1. Introduction
${text.generatedIntro}

2. Main Content
${text.generatedBody}

Topic:
${topic.trim()}

3. Conclusion
${text.generatedConclusion}${requirementsBlock}${keywordsBlock}`;

    setGeneratedText(result);
    setSuccessMessage(text.generatedReady);
  }

  function handleSaveDocument() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!generatedText.trim()) {
      setErrorMessage(text.nothingToSave);
      return;
    }

    const newDocument: SavedDocument = {
      id: crypto.randomUUID(),
      title: documentTitle.trim(),
      type: documentType,
      language: documentLanguage,
      style: documentStyle,
      content: generatedText,
      createdAt: new Date().toLocaleString(),
    };

    const updatedDocuments = [newDocument, ...savedDocuments].slice(0, 5);

    setSavedDocuments(updatedDocuments);
    localStorage.setItem(
      "studyai_saved_documents",
      JSON.stringify(updatedDocuments)
    );

    setSuccessMessage(text.savedReady);
  }

  function handleClear() {
    setDocumentTitle("");
    setDocumentTypeIndex(0);
    setDocumentLanguageIndex(0);
    setDocumentStyleIndex(0);
    setTopic("");
    setRequirements("");
    setKeywords("");
    setGeneratedText("");
    setErrorMessage("");
    setSuccessMessage("");
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

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
            <form
              onSubmit={handleGenerateText}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                  D
                </div>

                <h2 className="text-2xl font-bold">{text.formTitle}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {text.formSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.documentTitle}
                  </label>

                  <input
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder={text.documentTitlePlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.documentType}
                  </label>

                  <select
                    value={String(documentTypeIndex)}
                    onChange={(e) =>
                      setDocumentTypeIndex(Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  >
                    {text.documentTypes.map((item, index) => (
                      <option key={item} value={String(index)}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.documentLanguage}
                  </label>

                  <select
                    value={String(documentLanguageIndex)}
                    onChange={(e) =>
                      setDocumentLanguageIndex(Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  >
                    {text.languages.map((item, index) => (
                      <option key={item} value={String(index)}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.documentStyle}
                  </label>

                  <select
                    value={String(documentStyleIndex)}
                    onChange={(e) =>
                      setDocumentStyleIndex(Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  >
                    {text.styles.map((item, index) => (
                      <option key={item} value={String(index)}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.topic}
                  </label>

                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={text.topicPlaceholder}
                    rows={6}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.requirements}
                  </label>

                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder={text.requirementsPlaceholder}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.keywords}
                  </label>

                  <input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder={text.keywordsPlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
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

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  {text.generateText}
                </button>

                <button
                  type="button"
                  onClick={handleSaveDocument}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  {text.saveDocument}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
                >
                  {text.clear}
                </button>
              </div>

              {generatedText && (
                <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
                  <p className="text-sm font-semibold text-blue-600">
                    {text.generatedDocument}
                  </p>

                  <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-white p-5 text-sm leading-7 text-slate-700">
                    {generatedText}
                  </pre>
                </section>
              )}
            </form>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-blue-600">
                  {text.frontendNoteTitle}
                </h2>

                <p className="mt-4 text-sm leading-7 text-blue-700">
                  {text.frontendNote}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  {text.previewCards.map((card) => (
                    <div key={card.title} className="rounded-2xl bg-slate-50 p-5">
                      <h3 className="font-bold">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {card.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">{text.savedDocuments}</h2>

                {savedDocuments.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    {text.noSavedDocuments}
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {savedDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <h3 className="font-bold">{document.title}</h3>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {document.type} · {document.language} ·{" "}
                          {document.style}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {text.savedLocally}: {document.createdAt}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}