"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";

const initialProgress = {
  introduction: false,
  literature: false,
  methodology: false,
  analysis: false,
  discussion: false,
  conclusion: false,
  references: false,
};

const pageText = {
  en: {
    title: "Diploma",
    subtitle: "Create a diploma workspace, define your topic, and generate a thesis structure.",
    formTitle: "Diploma Assistant",
    formSubtitle:
      "Create a workspace for your diploma thesis and organize your topic, goals, tasks, structure, and section progress.",
    workspaceTitle: "Diploma workspace",
    topic: "Diploma topic",
    topicPlaceholder: "Example: Performance Comparison of Relational and Graph Databases",
    faculty: "Faculty / Program",
    facultyPlaceholder: "Example: Economics and Management",
    researchArea: "Research area",
    researchAreaPlaceholder: "Example: Information Systems, AI, Data Analysis",
    supervisor: "Supervisor",
    supervisorPlaceholder: "Example: Dr. John Smith",
    deadline: "Deadline",
    deadlinePlaceholder: "MM/DD/YYYY",
    researchType: "Research type",
    goal: "Main goal",
    goalPlaceholder: "Describe the main objective of your diploma thesis...",
    tasks: "Research tasks",
    tasksPlaceholder: "Write the main tasks of your thesis, each on a new line...",
    notes: "Notes",
    notesPlaceholder: "Add important notes, requirements, or university instructions...",
    generateStructure: "Generate diploma structure",
    saveProgress: "Save progress",
    clear: "Clear",
    generatedStructure: "Generated Diploma Structure",
    sectionProgress: "Section Progress",
    progressSaved: "Progress saved successfully.",
    structureReady: "Diploma structure generated successfully.",
    required: "Please fill in the diploma topic, main goal, and research tasks.",
    backToDashboard: "Back to Dashboard",
    frontendNoteTitle: "Frontend status",
    frontendNote:
      "This page includes the frontend UI for diploma workspace creation, topic setup, goal and task definition, diploma structure generation preview, and section progress tracking. Real saving to database or AI generation can be connected later through backend/API.",
    progress: "Progress",
    complete: "complete",
    researchTypes: [
      "Theoretical research",
      "Practical research",
      "Case study",
      "Data analysis",
      "System design",
      "Comparative study",
    ],
    previewCards: [
      {
        title: "Diploma workspace",
        text: "Keep topic, supervisor, deadline, goals, and notes in one place.",
      },
      {
        title: "Thesis structure",
        text: "Generate a standard diploma structure with academic sections.",
      },
      {
        title: "Section progress",
        text: "Track which parts of the diploma are completed.",
      },
    ],
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        description:
          "Introduce the topic, problem, motivation, objectives, and research questions.",
        output:
          "Explain why the topic is important, what problem is being solved, and what the thesis aims to achieve.",
      },
      {
        id: "literature",
        title: "Literature Review",
        description:
          "Summarize academic sources, theories, existing studies, and key concepts.",
        output:
          "Compare existing research and identify the gap that your diploma thesis addresses.",
      },
      {
        id: "methodology",
        title: "Methodology",
        description:
          "Describe research methods, data sources, tools, and evaluation approach.",
        output:
          "Explain how the research will be performed and why the selected method is suitable.",
      },
      {
        id: "analysis",
        title: "Analysis / Results",
        description:
          "Present practical work, collected data, calculations, experiments, or findings.",
        output:
          "Show the main results and connect them to your research tasks.",
      },
      {
        id: "discussion",
        title: "Discussion",
        description:
          "Interpret the results, compare them with expectations, and discuss limitations.",
        output:
          "Explain what the results mean and what limitations should be considered.",
      },
      {
        id: "conclusion",
        title: "Conclusion",
        description:
          "Summarize the thesis, answer research questions, and suggest future work.",
        output:
          "Clearly state what was achieved and how the thesis objective was fulfilled.",
      },
      {
        id: "references",
        title: "References",
        description:
          "List all academic sources, books, articles, websites, and datasets.",
        output:
          "Prepare references according to the required citation style.",
      },
    ],
  },

  ru: {
    title: "Диплом",
    subtitle: "Создайте дипломный workspace, добавьте тему и сгенерируйте структуру.",
    formTitle: "Diploma Assistant",
    formSubtitle:
      "Создайте рабочее пространство для диплома и организуйте тему, цели, задачи, структуру и прогресс по разделам.",
    workspaceTitle: "Дипломный workspace",
    topic: "Тема диплома",
    topicPlaceholder: "Например: Сравнение производительности реляционных и графовых баз данных",
    faculty: "Факультет / программа",
    facultyPlaceholder: "Например: Экономика и менеджмент",
    researchArea: "Область исследования",
    researchAreaPlaceholder: "Например: Информационные системы, AI, анализ данных",
    supervisor: "Научный руководитель",
    supervisorPlaceholder: "Например: Dr. John Smith",
    deadline: "Дедлайн",
    deadlinePlaceholder: "ДД.ММ.ГГ",
    researchType: "Тип исследования",
    goal: "Главная цель",
    goalPlaceholder: "Опишите главную цель вашей дипломной работы...",
    tasks: "Задачи исследования",
    tasksPlaceholder: "Напишите основные задачи диплома, каждую с новой строки...",
    notes: "Заметки",
    notesPlaceholder: "Добавьте важные заметки, требования или инструкции университета...",
    generateStructure: "Сгенерировать структуру диплома",
    saveProgress: "Сохранить прогресс",
    clear: "Очистить",
    generatedStructure: "Сгенерированная структура диплома",
    sectionProgress: "Прогресс по разделам",
    progressSaved: "Прогресс успешно сохранён.",
    structureReady: "Структура диплома успешно сгенерирована.",
    required: "Пожалуйста, заполните тему диплома, главную цель и задачи исследования.",
    backToDashboard: "Назад в панель",
    frontendNoteTitle: "Frontend статус",
    frontendNote:
      "Эта страница содержит frontend UI для создания дипломного workspace, добавления темы, целей и задач, предварительной генерации структуры диплома и отслеживания прогресса по разделам. Реальное сохранение в базу данных или AI-генерацию можно подключить позже через backend/API.",
    progress: "Прогресс",
    complete: "готово",
    researchTypes: [
      "Теоретическое исследование",
      "Практическое исследование",
      "Кейс-стади",
      "Анализ данных",
      "Проектирование системы",
      "Сравнительное исследование",
    ],
    previewCards: [
      {
        title: "Дипломный workspace",
        text: "Храните тему, руководителя, дедлайн, цели и заметки в одном месте.",
      },
      {
        title: "Структура диплома",
        text: "Генерируйте стандартную академическую структуру дипломной работы.",
      },
      {
        title: "Прогресс разделов",
        text: "Отмечайте, какие части диплома уже выполнены.",
      },
    ],
    sections: [
      {
        id: "introduction",
        title: "Введение",
        description:
          "Представьте тему, проблему, мотивацию, цели и исследовательские вопросы.",
        output:
          "Объясните, почему тема важна, какую проблему решает диплом и чего работа должна достичь.",
      },
      {
        id: "literature",
        title: "Обзор литературы",
        description:
          "Соберите академические источники, теории, существующие исследования и ключевые понятия.",
        output:
          "Сравните существующие исследования и покажите пробел, который закрывает ваша работа.",
      },
      {
        id: "methodology",
        title: "Методология",
        description:
          "Опишите методы исследования, источники данных, инструменты и подход к оценке.",
        output:
          "Объясните, как будет проводиться исследование и почему выбранный метод подходит.",
      },
      {
        id: "analysis",
        title: "Анализ / результаты",
        description:
          "Представьте практическую часть, данные, расчёты, эксперименты или результаты.",
        output:
          "Покажите основные результаты и свяжите их с задачами исследования.",
      },
      {
        id: "discussion",
        title: "Обсуждение",
        description:
          "Интерпретируйте результаты, сравните их с ожиданиями и укажите ограничения.",
        output:
          "Объясните значение результатов и ограничения, которые нужно учитывать.",
      },
      {
        id: "conclusion",
        title: "Заключение",
        description:
          "Подведите итоги, ответьте на исследовательские вопросы и предложите будущие направления.",
        output:
          "Чётко укажите, что было достигнуто и как выполнена цель диплома.",
      },
      {
        id: "references",
        title: "Список литературы",
        description:
          "Укажите все академические источники, книги, статьи, сайты и датасеты.",
        output:
          "Подготовьте источники в нужном стиле цитирования.",
      },
    ],
  },

  kz: {
    title: "Диплом",
    subtitle: "Диплом workspace құрып, тақырып қосып, құрылым жасаңыз.",
    formTitle: "Diploma Assistant",
    formSubtitle:
      "Диплом жұмысы үшін жұмыс кеңістігін құрып, тақырып, мақсат, міндеттер, құрылым және бөлімдер прогресін ұйымдастырыңыз.",
    workspaceTitle: "Диплом workspace",
    topic: "Диплом тақырыбы",
    topicPlaceholder: "Мысалы: Реляциялық және графтық дерекқорлардың өнімділігін салыстыру",
    faculty: "Факультет / бағдарлама",
    facultyPlaceholder: "Мысалы: Экономика және менеджмент",
    researchArea: "Зерттеу саласы",
    researchAreaPlaceholder: "Мысалы: Ақпараттық жүйелер, AI, деректер талдауы",
    supervisor: "Ғылыми жетекші",
    supervisorPlaceholder: "Мысалы: Dr. John Smith",
    deadline: "Дедлайн",
    deadlinePlaceholder: "ДД.ММ.ГГ",
    researchType: "Зерттеу түрі",
    goal: "Негізгі мақсат",
    goalPlaceholder: "Диплом жұмысының негізгі мақсатын сипаттаңыз...",
    tasks: "Зерттеу міндеттері",
    tasksPlaceholder: "Дипломның негізгі міндеттерін әр жолға бөлек жазыңыз...",
    notes: "Ескертпелер",
    notesPlaceholder: "Маңызды ескертпелерді, талаптарды немесе университет нұсқауларын қосыңыз...",
    generateStructure: "Диплом құрылымын жасау",
    saveProgress: "Прогресті сақтау",
    clear: "Тазалау",
    generatedStructure: "Жасалған диплом құрылымы",
    sectionProgress: "Бөлімдер прогресі",
    progressSaved: "Прогресс сәтті сақталды.",
    structureReady: "Диплом құрылымы сәтті жасалды.",
    required: "Диплом тақырыбын, негізгі мақсатты және зерттеу міндеттерін толтырыңыз.",
    backToDashboard: "Панельге қайту",
    frontendNoteTitle: "Frontend статусы",
    frontendNote:
      "Бұл бетте диплом workspace құру, тақырып, мақсат және міндеттерді қосу, диплом құрылымын preview ретінде жасау және бөлімдер прогресін бақылау үшін frontend UI бар. Нақты дерекқорға сақтау немесе AI генерация backend/API арқылы кейін қосылады.",
    progress: "Прогресс",
    complete: "дайын",
    researchTypes: [
      "Теориялық зерттеу",
      "Практикалық зерттеу",
      "Кейс-стади",
      "Деректер талдауы",
      "Жүйе жобалау",
      "Салыстырмалы зерттеу",
    ],
    previewCards: [
      {
        title: "Диплом workspace",
        text: "Тақырып, жетекші, дедлайн, мақсат және ескертпелерді бір жерде сақтаңыз.",
      },
      {
        title: "Диплом құрылымы",
        text: "Диплом жұмысының стандартты академиялық құрылымын жасаңыз.",
      },
      {
        title: "Бөлімдер прогресі",
        text: "Дипломның қай бөлімдері дайын екенін белгілеңіз.",
      },
    ],
    sections: [
      {
        id: "introduction",
        title: "Кіріспе",
        description:
          "Тақырыпты, мәселені, мотивацияны, мақсаттарды және зерттеу сұрақтарын таныстырыңыз.",
        output:
          "Тақырыптың маңызын, қандай мәселе шешілетінін және жұмыстың мақсатын түсіндіріңіз.",
      },
      {
        id: "literature",
        title: "Әдебиеттерге шолу",
        description:
          "Академиялық дереккөздерді, теорияларды, зерттеулерді және негізгі ұғымдарды жинақтаңыз.",
        output:
          "Бар зерттеулерді салыстырып, диплом жұмысы қарастыратын бос орынды көрсетіңіз.",
      },
      {
        id: "methodology",
        title: "Методология",
        description:
          "Зерттеу әдістерін, дереккөздерді, құралдарды және бағалау тәсілін сипаттаңыз.",
        output:
          "Зерттеу қалай жүргізілетінін және таңдалған әдістің неге сәйкес екенін түсіндіріңіз.",
      },
      {
        id: "analysis",
        title: "Талдау / нәтижелер",
        description:
          "Практикалық жұмысты, деректерді, есептеулерді, эксперименттерді немесе нәтижелерді көрсетіңіз.",
        output:
          "Негізгі нәтижелерді көрсетіп, оларды зерттеу міндеттерімен байланыстырыңыз.",
      },
      {
        id: "discussion",
        title: "Талқылау",
        description:
          "Нәтижелерді түсіндіріп, күтілген нәтижелермен салыстырып, шектеулерді көрсетіңіз.",
        output:
          "Нәтижелердің мағынасын және ескерілуі керек шектеулерді түсіндіріңіз.",
      },
      {
        id: "conclusion",
        title: "Қорытынды",
        description:
          "Жұмысты қорытындылап, зерттеу сұрақтарына жауап беріп, болашақ бағыттарды ұсыныңыз.",
        output:
          "Не орындалғанын және диплом мақсаты қалай жүзеге асқанын нақты көрсетіңіз.",
      },
      {
        id: "references",
        title: "Пайдаланылған әдебиеттер",
        description:
          "Барлық академиялық дереккөздерді, кітаптарды, мақалаларды, сайттарды және датасеттерді көрсетіңіз.",
        output:
          "Дереккөздерді қажетті citation style бойынша дайындаңыз.",
      },
    ],
  },
};

export default function DiplomaPage() {
  const { language } = useLanguage();
  const text = pageText[language];

  const [topic, setTopic] = useState("");
  const [faculty, setFaculty] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [deadline, setDeadline] = useState("");
  const [researchTypeIndex, setResearchTypeIndex] = useState(0);
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState("");
  const [notes, setNotes] = useState("");

  const [progress, setProgress] = useState<Record<string, boolean>>(initialProgress);
  const [generated, setGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const researchType = text.researchTypes[researchTypeIndex] || text.researchTypes[0];

  const progressPercent = useMemo(() => {
    const completed = Object.values(progress).filter(Boolean).length;
    const total = text.sections.length;

    if (total === 0) return 0;

    return Math.round((completed / total) * 100);
  }, [progress, text.sections.length]);

  useEffect(() => {
    const savedProgress = localStorage.getItem("studyai_diploma_progress");

    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress({
          ...initialProgress,
          ...parsedProgress,
        });
      } catch {
        setProgress(initialProgress);
      }
    }
  }, []);

  function handleGenerateStructure(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!topic.trim() || !goal.trim() || !tasks.trim()) {
      setErrorMessage(text.required);
      setGenerated(false);
      return;
    }

    setGenerated(true);
    setSuccessMessage(text.structureReady);
  }

  function handleSaveProgress() {
    localStorage.setItem("studyai_diploma_progress", JSON.stringify(progress));

    setErrorMessage("");
    setSuccessMessage(text.progressSaved);
  }

  function handleClear() {
    setTopic("");
    setFaculty("");
    setResearchArea("");
    setSupervisor("");
    setDeadline("");
    setResearchTypeIndex(0);
    setGoal("");
    setTasks("");
    setNotes("");
    setProgress({ ...initialProgress });
    setGenerated(false);
    setErrorMessage("");
    setSuccessMessage("");
    localStorage.removeItem("studyai_diploma_progress");
  }

  function toggleSection(sectionId: string) {
    setProgress((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
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
              onSubmit={handleGenerateStructure}
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

              <section className="rounded-3xl bg-slate-50 p-5 sm:p-6">
                <h3 className="mb-5 text-lg font-bold">{text.workspaceTitle}</h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {text.topic}
                    </label>

                    <input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={text.topicPlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {text.faculty}
                    </label>

                    <input
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      placeholder={text.facultyPlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {text.researchArea}
                    </label>

                    <input
                      value={researchArea}
                      onChange={(e) => setResearchArea(e.target.value)}
                      placeholder={text.researchAreaPlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {text.supervisor}
                    </label>

                    <input
                      value={supervisor}
                      onChange={(e) => setSupervisor(e.target.value)}
                      placeholder={text.supervisorPlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {text.deadline}
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder={text.deadlinePlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {text.researchType}
                    </label>

                    <select
                      value={String(researchTypeIndex)}
                      onChange={(e) => setResearchTypeIndex(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    >
                      {text.researchTypes.map((item, index) => (
                        <option key={item} value={String(index)}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="mt-8 grid grid-cols-1 gap-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.goal}
                  </label>

                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={text.goalPlaceholder}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.tasks}
                  </label>

                  <textarea
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                    placeholder={text.tasksPlaceholder}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.notes}
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={text.notesPlaceholder}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </section>

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
                  {text.generateStructure}
                </button>

                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  {text.saveProgress}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
                >
                  {text.clear}
                </button>
              </div>

              {generated && (
                <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-blue-600">
                      {text.generatedStructure}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {topic}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {researchType}
                      {deadline ? ` · ${deadline}` : ""}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {text.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className="rounded-2xl border border-blue-100 bg-white p-5"
                      >
                        <div className="flex gap-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                            {index + 1}
                          </span>

                          <div>
                            <h4 className="font-bold">{section.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {section.description}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {section.output}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{text.sectionProgress}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {text.progress}: {progressPercent}% {text.complete}
                    </p>
                  </div>

                  <div className="h-3 w-full rounded-full bg-slate-100 sm:w-48">
                    <div
                      className="h-3 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {text.sections.map((section) => (
                    <label
                      key={section.id}
                      className={
                        progress[section.id]
                          ? "flex cursor-pointer gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4"
                          : "flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(progress[section.id])}
                        onChange={() => toggleSection(section.id)}
                        className="mt-1 h-4 w-4"
                      />

                      <div>
                        <p className="font-bold">{section.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {section.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
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
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}