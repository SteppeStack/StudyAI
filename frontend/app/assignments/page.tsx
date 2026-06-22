"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";

const pageText = {
  en: {
    title: "Assignments",
    subtitle: "Create assignment tasks, generate solution plans, and check answers.",
    formTitle: "Assignment Helper",
    formSubtitle:
      "Fill in the assignment details and choose what kind of help you need.",
    assignmentTitle: "Assignment title",
    assignmentTitlePlaceholder: "Example: Microeconomics homework",
    subject: "Subject",
    helpType: "Type of help",
    deadline: "Deadline",
    deadlinePlaceholder: "MM/DD/YYYY",
    description: "Assignment description",
    descriptionPlaceholder: "Paste or describe your assignment here...",
    studentAnswer: "Student answer",
    studentAnswerPlaceholder: "Paste your answer here if you want to check it...",
    generatePlan: "Generate solution plan",
    checkAnswer: "Check answer",
    clear: "Clear",
    generatedPlan: "Generated Plan",
    answerFeedback: "Answer Feedback",
    required: "Please fill in the assignment title, subject, help type, and description.",
    answerRequired: "Please enter your answer first.",
    backToDashboard: "Back to Dashboard",
    frontendNoteTitle: "Frontend status",
    frontendNote:
      "This page includes the frontend UI for assignment creation, subject selection, help type selection, plan generation preview, and answer checking preview. Real AI generation can be connected later through backend/API.",
    planReady: "Plan generated successfully.",
    feedbackReady: "Answer feedback generated successfully.",
    subjects: [
      "Mathematics",
      "Economics",
      "Programming",
      "English",
      "Physics",
      "Statistics",
      "Business",
      "Other",
    ],
    helpTypes: [
      { value: "explain", label: "Explain the task" },
      { value: "solution_plan", label: "Create solution plan" },
      { value: "check_answer", label: "Check my answer" },
      { value: "improve_text", label: "Improve my text" },
      { value: "outline", label: "Generate outline" },
    ],
    previewCards: [
      {
        title: "Subject selection",
        text: "Choose the academic subject for better assignment context.",
      },
      {
        title: "Help type",
        text: "Select whether you need explanation, planning, or answer checking.",
      },
      {
        title: "Solution plan",
        text: "Generate a structured step-by-step plan for the assignment.",
      },
    ],
    planSteps: [
      "Read the assignment carefully and identify the main objective.",
      "Break the task into smaller parts and define what needs to be solved first.",
      "Collect the required formulas, theory, sources, or examples.",
      "Create a structured answer using clear sections.",
      "Review the final work and check whether it answers the assignment fully.",
    ],
    feedbackItems: [
      "Your answer has a clear structure, but it may need more detail.",
      "Add stronger explanations and connect your points to the assignment question.",
      "Check grammar, formatting, and whether all required parts are included.",
    ],
  },

  ru: {
    title: "Задания",
    subtitle: "Создавайте задания, генерируйте план решения и проверяйте ответы.",
    formTitle: "Assignment Helper",
    formSubtitle:
      "Заполните данные задания и выберите, какая помощь вам нужна.",
    assignmentTitle: "Название задания",
    assignmentTitlePlaceholder: "Например: Домашнее задание по микроэкономике",
    subject: "Предмет",
    helpType: "Тип помощи",
    deadline: "Дедлайн",
    deadlinePlaceholder: "ДД.ММ.ГГ",
    description: "Описание задания",
    descriptionPlaceholder: "Вставьте или опишите ваше задание здесь...",
    studentAnswer: "Ответ студента",
    studentAnswerPlaceholder: "Вставьте ваш ответ, если хотите проверить его...",
    generatePlan: "Сгенерировать план решения",
    checkAnswer: "Проверить ответ",
    clear: "Очистить",
    generatedPlan: "Сгенерированный план",
    answerFeedback: "Проверка ответа",
    required:
      "Пожалуйста, заполните название задания, предмет, тип помощи и описание.",
    answerRequired: "Сначала введите ваш ответ.",
    backToDashboard: "Назад в панель",
    frontendNoteTitle: "Frontend статус",
    frontendNote:
      "Эта страница содержит frontend UI для создания задания, выбора предмета, выбора типа помощи, предварительной генерации плана и проверки ответа. Настоящую AI-генерацию можно подключить позже через backend/API.",
    planReady: "План успешно сгенерирован.",
    feedbackReady: "Проверка ответа успешно сгенерирована.",
    subjects: [
      "Математика",
      "Экономика",
      "Программирование",
      "Английский",
      "Физика",
      "Статистика",
      "Бизнес",
      "Другое",
    ],
    helpTypes: [
      { value: "explain", label: "Объяснить задание" },
      { value: "solution_plan", label: "Создать план решения" },
      { value: "check_answer", label: "Проверить мой ответ" },
      { value: "improve_text", label: "Улучшить текст" },
      { value: "outline", label: "Создать структуру" },
    ],
    previewCards: [
      {
        title: "Выбор предмета",
        text: "Выберите учебный предмет, чтобы лучше определить контекст задания.",
      },
      {
        title: "Тип помощи",
        text: "Выберите объяснение, план решения или проверку ответа.",
      },
      {
        title: "План решения",
        text: "Получите структурированный пошаговый план выполнения задания.",
      },
    ],
    planSteps: [
      "Внимательно прочитать задание и определить главную цель.",
      "Разделить задание на маленькие части и понять, что нужно решить первым.",
      "Собрать нужные формулы, теорию, источники или примеры.",
      "Составить структурированный ответ с понятными разделами.",
      "Проверить финальную работу и убедиться, что она полностью отвечает заданию.",
    ],
    feedbackItems: [
      "Ответ имеет понятную структуру, но его можно раскрыть подробнее.",
      "Добавьте более сильные объяснения и свяжите аргументы с вопросом задания.",
      "Проверьте грамматику, форматирование и наличие всех обязательных частей.",
    ],
  },

  kz: {
    title: "Тапсырмалар",
    subtitle: "Тапсырма құрып, шешім жоспарын жасап, жауаптарды тексеріңіз.",
    formTitle: "Assignment Helper",
    formSubtitle:
      "Тапсырма мәліметтерін толтырып, қандай көмек қажет екенін таңдаңыз.",
    assignmentTitle: "Тапсырма атауы",
    assignmentTitlePlaceholder: "Мысалы: Микроэкономика үй тапсырмасы",
    subject: "Пән",
    helpType: "Көмек түрі",
    deadline: "Мерзім",
    deadlinePlaceholder: "ДД.ММ.ГГ",
    description: "Тапсырма сипаттамасы",
    descriptionPlaceholder: "Тапсырманы осында енгізіңіз немесе сипаттаңыз...",
    studentAnswer: "Студент жауабы",
    studentAnswerPlaceholder: "Жауапты тексеру үшін осында енгізіңіз...",
    generatePlan: "Шешім жоспарын жасау",
    checkAnswer: "Жауапты тексеру",
    clear: "Тазалау",
    generatedPlan: "Жасалған жоспар",
    answerFeedback: "Жауапты тексеру",
    required: "Тапсырма атауын, пәнді, көмек түрін және сипаттаманы толтырыңыз.",
    answerRequired: "Алдымен жауабыңызды енгізіңіз.",
    backToDashboard: "Панельге қайту",
    frontendNoteTitle: "Frontend статусы",
    frontendNote:
      "Бұл бетте тапсырма құру, пән таңдау, көмек түрін таңдау, жоспар preview және жауап тексеру preview үшін frontend UI бар. Нақты AI генерация кейін backend/API арқылы қосылады.",
    planReady: "Жоспар сәтті жасалды.",
    feedbackReady: "Жауап тексеруі сәтті жасалды.",
    subjects: [
      "Математика",
      "Экономика",
      "Бағдарламалау",
      "Ағылшын",
      "Физика",
      "Статистика",
      "Бизнес",
      "Басқа",
    ],
    helpTypes: [
      { value: "explain", label: "Тапсырманы түсіндіру" },
      { value: "solution_plan", label: "Шешім жоспарын жасау" },
      { value: "check_answer", label: "Жауабымды тексеру" },
      { value: "improve_text", label: "Мәтінді жақсарту" },
      { value: "outline", label: "Құрылым жасау" },
    ],
    previewCards: [
      {
        title: "Пән таңдау",
        text: "Тапсырма контекстін жақсырақ анықтау үшін пәнді таңдаңыз.",
      },
      {
        title: "Көмек түрі",
        text: "Түсіндіру, шешім жоспары немесе жауап тексеруді таңдаңыз.",
      },
      {
        title: "Шешім жоспары",
        text: "Тапсырма үшін құрылымды қадамдық жоспар алыңыз.",
      },
    ],
    planSteps: [
      "Тапсырманы мұқият оқып, негізгі мақсатты анықтау.",
      "Тапсырманы кіші бөліктерге бөліп, алдымен не шешілетінін анықтау.",
      "Қажетті формулаларды, теорияны, дереккөздерді немесе мысалдарды жинау.",
      "Жауапты түсінікті бөлімдер арқылы құрылымдау.",
      "Соңғы жұмысты тексеріп, тапсырмаға толық жауап беретінін анықтау.",
    ],
    feedbackItems: [
      "Жауаптың құрылымы түсінікті, бірақ оны толығырақ ашуға болады.",
      "Түсіндірулерді күшейтіп, ойларыңызды тапсырма сұрағымен байланыстырыңыз.",
      "Грамматика, формат және барлық қажетті бөліктердің барын тексеріңіз.",
    ],
  },
};

type HelpType = "explain" | "solution_plan" | "check_answer" | "improve_text" | "outline";

export default function AssignmentsPage() {
  const { language } = useLanguage();
  const text = pageText[language];

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [helpType, setHelpType] = useState<HelpType>("solution_plan");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const subject = text.subjects[subjectIndex] || text.subjects[0];

  const selectedHelpTypeLabel = useMemo(() => {
    return (
      text.helpTypes.find((item) => item.value === helpType)?.label ||
      text.helpTypes[0].label
    );
  }, [helpType, text.helpTypes]);

  function handleGeneratePlan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setShowFeedback(false);

    if (
      !assignmentTitle.trim() ||
      !subject.trim() ||
      !helpType.trim() ||
      !description.trim()
    ) {
      setErrorMessage(text.required);
      setShowPlan(false);
      return;
    }

    setShowPlan(true);
    setSuccessMessage(text.planReady);
  }

  function handleCheckAnswer() {
    setErrorMessage("");
    setSuccessMessage("");
    setShowPlan(false);

    if (!studentAnswer.trim()) {
      setErrorMessage(text.answerRequired);
      setShowFeedback(false);
      return;
    }

    setShowFeedback(true);
    setSuccessMessage(text.feedbackReady);
  }

  function handleClear() {
    setAssignmentTitle("");
    setSubjectIndex(0);
    setHelpType("solution_plan");
    setDeadline("");
    setDescription("");
    setStudentAnswer("");
    setErrorMessage("");
    setSuccessMessage("");
    setShowPlan(false);
    setShowFeedback(false);
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
              onSubmit={handleGeneratePlan}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                  A
                </div>

                <h2 className="text-2xl font-bold">{text.formTitle}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {text.formSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.assignmentTitle}
                  </label>

                  <input
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder={text.assignmentTitlePlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.subject}
                  </label>

                  <select
                    value={String(subjectIndex)}
                    onChange={(e) => setSubjectIndex(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  >
                    {text.subjects.map((item, index) => (
                      <option key={item} value={String(index)}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.helpType}
                  </label>

                  <select
                    value={helpType}
                    onChange={(e) => setHelpType(e.target.value as HelpType)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                  >
                    {text.helpTypes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
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
                    {text.description}
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={text.descriptionPlaceholder}
                    rows={7}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {text.studentAnswer}
                  </label>

                  <textarea
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder={text.studentAnswerPlaceholder}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
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
                  {text.generatePlan}
                </button>

                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  {text.checkAnswer}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
                >
                  {text.clear}
                </button>
              </div>

              {showPlan && (
                <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-blue-600">
                      {text.generatedPlan}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {assignmentTitle}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {subject} · {selectedHelpTypeLabel}
                      {deadline ? ` · ${deadline}` : ""}
                    </p>
                  </div>

                  <ol className="space-y-4">
                    {text.planSteps.map((step, index) => (
                      <li key={step} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="pt-1 text-sm leading-6 text-slate-700">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {showFeedback && (
                <section className="mt-8 rounded-3xl border border-green-100 bg-green-50 p-6">
                  <p className="text-sm font-semibold text-green-600">
                    {text.answerFeedback}
                  </p>

                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                    {text.feedbackItems.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
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
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}