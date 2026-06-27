"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import AppShell from "@/components/AppShell";
import { sendAiTutorMessage } from "@/lib/studyApi";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type TutorCopy = {
  chatTitle: string;
  chatSubtitle: string;
  clearChat: string;
  emptyTitle: string;
  emptySubtitle: string;
  userMessage: string;
  assistantMessage: string;
  inputPlaceholder: string;
  send: string;
  attach: string;
  quickTips: string;
  beta: string;
  recentChats: string;
  viewAll: string;
  today: string;
  onlineTitle: string;
  onlineSubtitle: string;
  cards: {
    explain: {
      title: string;
      subtitle: string;
    };
    step: {
      title: string;
      subtitle: string;
    };
    exam: {
      title: string;
      subtitle: string;
    };
    practice: {
      title: string;
      subtitle: string;
    };
  };
  tips: {
    specific: {
      title: string;
      subtitle: string;
    };
    step: {
      title: string;
      subtitle: string;
    };
    examples: {
      title: string;
      subtitle: string;
    };
    practice: {
      title: string;
      subtitle: string;
    };
  };
  recent: {
    pythagorean: string;
    photosynthesis: string;
    newton: string;
    quadratic: string;
    cell: string;
  };
};

const copy: Record<Language, TutorCopy> = {
  en: {
    chatTitle: "AI Tutor Chat",
    chatSubtitle:
      "Ask about any subject, assignment, exam topic, or uploaded study material.",
    clearChat: "Clear chat",
    emptyTitle: "Start learning with AI Tutor",
    emptySubtitle:
      "Ask about any subject, assignment, exam topic, or uploaded study material.",
    userMessage: "Can you explain the Pythagorean theorem and how it is used?",
    assistantMessage:
      "Absolutely. The Pythagorean theorem is used in right triangles. It says that the square of the hypotenuse equals the sum of the squares of the other two sides: a² + b² = c². It helps you find a missing side when you know the other two.",
    inputPlaceholder:
      "Ask me anything... e.g. explain photosynthesis, help with calculus, summarize this topic...",
    send: "Send",
    attach: "Attach",
    quickTips: "Quick tips",
    beta: "Beta",
    recentChats: "Recent chats",
    viewAll: "View all",
    today: "Today",
    onlineTitle: "AI Tutor is online",
    onlineSubtitle:
      "Ready to help with explanations, exam prep, summaries, and practice questions.",
    cards: {
      explain: {
        title: "Explain a topic",
        subtitle: "Get simple explanations with examples.",
      },
      step: {
        title: "Step by step",
        subtitle: "Break down difficult problems.",
      },
      exam: {
        title: "Prepare for exam",
        subtitle: "Create a quick revision plan.",
      },
      practice: {
        title: "Create practice questions",
        subtitle: "Generate questions to test yourself.",
      },
    },
    tips: {
      specific: {
        title: "Be specific",
        subtitle: "Ask clear and detailed questions.",
      },
      step: {
        title: "Ask step by step",
        subtitle: "Request explanations in smaller parts.",
      },
      examples: {
        title: "Use examples",
        subtitle: "Ask for real-world examples.",
      },
      practice: {
        title: "Practice more",
        subtitle: "Turn explanations into quizzes.",
      },
    },
    recent: {
      pythagorean: "Pythagorean theorem explanation",
      photosynthesis: "Photosynthesis process",
      newton: "Newton’s laws of motion",
      quadratic: "Quadratic equation problems",
      cell: "Cell structure and function",
    },
  },
  ru: {
    chatTitle: "Чат с AI Tutor",
    chatSubtitle:
      "Задай вопрос по предмету, заданию, теме экзамена или загруженному учебному материалу.",
    clearChat: "Очистить чат",
    emptyTitle: "Начни учиться с AI Tutor",
    emptySubtitle:
      "Задай вопрос по предмету, заданию, теме экзамена или загруженному учебному материалу.",
    userMessage:
      "Можешь объяснить теорему Пифагора и как она используется?",
    assistantMessage:
      "Конечно. Теорема Пифагора используется в прямоугольных треугольниках. Она говорит, что квадрат гипотенузы равен сумме квадратов двух других сторон: a² + b² = c². С её помощью можно найти неизвестную сторону, если известны две другие.",
    inputPlaceholder:
      "Спроси что угодно... например: объясни фотосинтез, помоги с математикой, кратко перескажи тему...",
    send: "Отправить",
    attach: "Прикрепить",
    quickTips: "Быстрые советы",
    beta: "Бета",
    recentChats: "Недавние чаты",
    viewAll: "Смотреть все",
    today: "Сегодня",
    onlineTitle: "AI Tutor онлайн",
    onlineSubtitle:
      "Готов помочь с объяснениями, подготовкой к экзаменам, конспектами и практическими вопросами.",
    cards: {
      explain: {
        title: "Объяснить тему",
        subtitle: "Простые объяснения с примерами.",
      },
      step: {
        title: "Пошаговое решение",
        subtitle: "Разбор сложных задач по частям.",
      },
      exam: {
        title: "Подготовка к экзамену",
        subtitle: "Быстрый план повторения.",
      },
      practice: {
        title: "Создать вопросы",
        subtitle: "Практические вопросы для проверки себя.",
      },
    },
    tips: {
      specific: {
        title: "Пиши конкретно",
        subtitle: "Задавай понятные и подробные вопросы.",
      },
      step: {
        title: "Проси по шагам",
        subtitle: "Разбивай объяснение на маленькие части.",
      },
      examples: {
        title: "Используй примеры",
        subtitle: "Проси примеры из реальной жизни.",
      },
      practice: {
        title: "Больше практики",
        subtitle: "Превращай объяснения в мини-тесты.",
      },
    },
    recent: {
      pythagorean: "Объяснение теоремы Пифагора",
      photosynthesis: "Процесс фотосинтеза",
      newton: "Законы движения Ньютона",
      quadratic: "Задачи с квадратными уравнениями",
      cell: "Строение и функции клетки",
    },
  },
  kz: {
    chatTitle: "AI Tutor чаты",
    chatSubtitle:
      "Пән, тапсырма, емтихан тақырыбы немесе жүктелген оқу материалы бойынша сұрақ қойыңыз.",
    clearChat: "Чатты тазарту",
    emptyTitle: "AI Tutor арқылы оқуды бастаңыз",
    emptySubtitle:
      "Пән, тапсырма, емтихан тақырыбы немесе жүктелген оқу материалы бойынша сұрақ қойыңыз.",
    userMessage:
      "Пифагор теоремасын және оның қалай қолданылатынын түсіндіре аласың ба?",
    assistantMessage:
      "Әрине. Пифагор теоремасы тікбұрышты үшбұрыштарда қолданылады. Ол гипотенузаның квадраты қалған екі қабырғаның квадраттарының қосындысына тең екенін айтады: a² + b² = c². Бұл екі қабырға белгілі болғанда белгісіз қабырғаны табуға көмектеседі.",
    inputPlaceholder:
      "Кез келген сұрақ қойыңыз... мысалы: фотосинтезді түсіндір, математикадан көмектес, тақырыпты қысқаша қорытындыла...",
    send: "Жіберу",
    attach: "Тіркеу",
    quickTips: "Жылдам кеңестер",
    beta: "Бета",
    recentChats: "Соңғы чаттар",
    viewAll: "Барлығын көру",
    today: "Бүгін",
    onlineTitle: "AI Tutor онлайн",
    onlineSubtitle:
      "Түсіндіру, емтиханға дайындық, қысқаша конспект және практикалық сұрақтар бойынша көмектесуге дайын.",
    cards: {
      explain: {
        title: "Тақырыпты түсіндіру",
        subtitle: "Мысалдармен қарапайым түсіндіру.",
      },
      step: {
        title: "Қадам бойынша",
        subtitle: "Күрделі есептерді бөліп түсіндіру.",
      },
      exam: {
        title: "Емтиханға дайындық",
        subtitle: "Жылдам қайталау жоспары.",
      },
      practice: {
        title: "Сұрақтар жасау",
        subtitle: "Өзіңізді тексеруге арналған сұрақтар.",
      },
    },
    tips: {
      specific: {
        title: "Нақты жазыңыз",
        subtitle: "Сұрақты түсінікті және толық қойыңыз.",
      },
      step: {
        title: "Қадаммен сұраңыз",
        subtitle: "Түсіндіруді кіші бөліктерге бөліңіз.",
      },
      examples: {
        title: "Мысал қолданыңыз",
        subtitle: "Шынайы өмірден мысал сұраңыз.",
      },
      practice: {
        title: "Көбірек практика",
        subtitle: "Түсіндірмелерді тестке айналдырыңыз.",
      },
    },
    recent: {
      pythagorean: "Пифагор теоремасын түсіндіру",
      photosynthesis: "Фотосинтез процесі",
      newton: "Ньютонның қозғалыс заңдары",
      quadratic: "Квадрат теңдеу есептері",
      cell: "Жасушаның құрылысы мен қызметі",
    },
  },
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

const themeStorageKeys = ["studyai-theme", "studyai_theme", "theme"];

const localeMap: Record<Language, string> = {
  en: "en-US",
  ru: "ru-RU",
  kz: "kk-KZ",
};

const promptCards = [
  {
    key: "explain",
    icon: "💡",
  },
  {
    key: "step",
    icon: "🧩",
  },
  {
    key: "exam",
    icon: "🎯",
  },
  {
    key: "practice",
    icon: "📝",
  },
] as const;

const tips = [
  {
    key: "specific",
    icon: "✍️",
  },
  {
    key: "step",
    icon: "🧠",
  },
  {
    key: "examples",
    icon: "🔍",
  },
  {
    key: "practice",
    icon: "✅",
  },
] as const;

const recentChats = [
  {
    key: "pythagorean",
    date: "today",
  },
  {
    key: "photosynthesis",
    date: new Date("2026-05-11T12:00:00"),
  },
  {
    key: "newton",
    date: new Date("2026-05-10T12:00:00"),
  },
  {
    key: "quadratic",
    date: new Date("2026-05-09T12:00:00"),
  },
  {
    key: "cell",
    date: new Date("2026-05-08T12:00:00"),
  },
] as const;

const promptText: Record<
  Language,
  Record<(typeof promptCards)[number]["key"], string>
> = {
  en: {
    explain: "Explain this topic in simple words with examples.",
    step: "Solve this step by step and explain each step clearly.",
    exam: "Create a quick exam revision plan for this topic.",
    practice: "Create practice questions with answers for this topic.",
  },
  ru: {
    explain: "Объясни эту тему простыми словами с примерами.",
    step: "Реши это пошагово и понятно объясни каждый шаг.",
    exam: "Составь быстрый план повторения этой темы перед экзаменом.",
    practice: "Создай практические вопросы с ответами по этой теме.",
  },
  kz: {
    explain: "Осы тақырыпты мысалдармен қарапайым тілде түсіндір.",
    step: "Мұны қадам бойынша шығарып, әр қадамды түсіндір.",
    exam: "Осы тақырып бойынша емтиханға жылдам қайталау жоспарын құр.",
    practice: "Осы тақырып бойынша жауаптары бар тәжірибелік сұрақтар жаса.",
  },
};

const recentPromptText: Record<
  Language,
  Record<(typeof recentChats)[number]["key"], string>
> = {
  en: {
    pythagorean: "Explain the Pythagorean theorem and show one example.",
    photosynthesis: "Explain the photosynthesis process in simple terms.",
    newton: "Explain Newton's laws of motion with examples.",
    quadratic: "Help me solve quadratic equation problems step by step.",
    cell: "Explain cell structure and function for exam revision.",
  },
  ru: {
    pythagorean: "Объясни теорему Пифагора и покажи один пример.",
    photosynthesis: "Объясни процесс фотосинтеза простыми словами.",
    newton: "Объясни законы движения Ньютона с примерами.",
    quadratic: "Помоги решать квадратные уравнения пошагово.",
    cell: "Объясни строение и функции клетки для подготовки к экзамену.",
  },
  kz: {
    pythagorean: "Пифагор теоремасын түсіндір және бір мысал көрсет.",
    photosynthesis: "Фотосинтез процесін қарапайым тілде түсіндір.",
    newton: "Ньютонның қозғалыс заңдарын мысалдармен түсіндір.",
    quadratic: "Квадрат теңдеулерді қадам бойынша шығаруға көмектес.",
    cell: "Емтиханға дайындық үшін жасушаның құрылымы мен қызметін түсіндір.",
  },
};

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "ru";

  for (const key of languageStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "en" || value === "ru" || value === "kz") {
      return value;
    }
  }

  return "ru";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  for (const key of themeStorageKeys) {
    const value = window.localStorage.getItem(key);

    if (value === "light" || value === "dark") {
      return value;
    }
  }

  return "dark";
}

function formatDate(date: Date | "today", language: Language, todayLabel: string) {
  if (date === "today") return todayLabel;

  return new Intl.DateTimeFormat(localeMap[language], {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function TutorContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("dark");
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [usageLabel, setUsageLabel] = useState("");

  const t = copy[language];
  const isDark = theme === "dark";

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getStoredTheme());

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<Language>;

      if (
        customEvent.detail === "en" ||
        customEvent.detail === "ru" ||
        customEvent.detail === "kz"
      ) {
        setLanguage(customEvent.detail);
      }
    }

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<Theme>;

      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setTheme(customEvent.detail);
      }
    }

    function handleStorageChange() {
      setLanguage(getStoredLanguage());
      setTheme(getStoredTheme());
    }

    window.addEventListener("studyai:language-change", handleLanguageChange);
    window.addEventListener("studyai:theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "studyai:language-change",
        handleLanguageChange
      );
      window.removeEventListener("studyai:theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const pageClass = isDark
    ? "min-h-full bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"
    : "min-h-full bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8";

  const cardClass = isDark
    ? "border-white/10 bg-slate-900/70 shadow-sm"
    : "border-slate-200 bg-white shadow-sm";

  const softCardClass = isDark
    ? "border-white/10 bg-slate-950/50"
    : "border-slate-200 bg-slate-50";

  const titleClass = isDark ? "text-white" : "text-slate-950";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-500/10"
    : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/10";

  const recentList = useMemo(
    () =>
      recentChats.map((chat) => ({
        ...chat,
        formattedDate: formatDate(chat.date, language, t.today),
      })),
    [language, t.today]
  );

  async function sendMessage(messageText: string) {
    const trimmed = messageText.trim();

    if (!trimmed || sending) return;

    const now = new Date().toISOString();
    const optimisticUserMessage: ChatMessage = {
      id: `local-user-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: now,
    };

    setMessages((current) => [...current, optimisticUserMessage]);
    setInput("");
    setError("");
    setSending(true);

    try {
      const response = await sendAiTutorMessage({
        message: trimmed,
        conversation_id: conversationId,
        title: trimmed.slice(0, 80),
      });

      setConversationId(response.conversation_id);
      setMessages((current) => [
        ...current.filter((message) => message.id !== optimisticUserMessage.id),
        {
          id: response.user_message.id,
          role: "user",
          content: response.user_message.content,
          createdAt: response.user_message.created_at,
        },
        {
          id: response.assistant_message.id,
          role: "assistant",
          content: response.assistant_message.content,
          createdAt: response.assistant_message.created_at,
        },
      ]);
      setUsageLabel(
        `${response.usage.ai_requests_used} / ${response.usage.monthly_ai_request_limit}`
      );
    } catch (sendError) {
      setMessages((current) =>
        current.filter((message) => message.id !== optimisticUserMessage.id)
      );
      setInput(trimmed);
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handlePromptClick(key: (typeof promptCards)[number]["key"]) {
    setInput(promptText[language][key]);
  }

  function handleRecentClick(key: (typeof recentChats)[number]["key"]) {
    void sendMessage(recentPromptText[language][key]);
  }

  function formatMessageTime(value: string) {
    return new Intl.DateTimeFormat(localeMap[language], {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  return (
    <div className={pageClass}>
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section
          className={`min-w-0 overflow-hidden rounded-[2rem] border ${cardClass}`}
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div className="min-w-0">
              <h1 className={`text-2xl font-black ${titleClass}`}>
                {t.chatTitle}
              </h1>
              <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                {t.chatSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setConversationId(undefined);
                setMessages([]);
                setInput("");
                setError("");
                setUsageLabel("");
              }}
              className={`inline-flex h-11 shrink-0 items-center justify-center rounded-2xl border px-4 text-sm font-black transition ${
                isDark
                  ? "border-white/10 bg-slate-950/60 text-slate-200 hover:border-blue-400/30 hover:bg-blue-400/10"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
              }`}
            >
              {t.clearChat}
            </button>
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-3xl text-2xl ${
                  isDark ? "bg-blue-500/15" : "bg-blue-600/10"
                }`}
              >
                🎓
              </div>

              <h2 className={`mt-5 text-3xl font-black ${titleClass}`}>
                {t.emptyTitle}
              </h2>

              <p className={`mt-3 max-w-2xl text-sm leading-6 ${mutedClass}`}>
                {t.emptySubtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {promptCards.map((card) => (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => handlePromptClick(card.key)}
                  className={`min-w-0 rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    isDark
                      ? "border-white/10 bg-slate-950/40 hover:border-blue-400/40 hover:bg-blue-400/10"
                      : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${
                      isDark ? "bg-blue-500/15" : "bg-blue-600/10"
                    }`}
                  >
                    {card.icon}
                  </div>

                  <p className={`mt-5 text-sm font-black ${titleClass}`}>
                    {t.cards[card.key].title}
                  </p>

                  <p className={`mt-2 text-xs font-semibold leading-5 ${mutedClass}`}>
                    {t.cards[card.key].subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 p-5 dark:border-white/10 sm:p-6">
            {messages.length === 0 ? (
              <>
                <div className="flex justify-end">
                  <div className="max-w-[560px] rounded-[1.5rem] bg-blue-600 px-5 py-4 text-white shadow-sm shadow-blue-600/20">
                    <p className="text-sm font-semibold leading-6">
                      {t.userMessage}
                    </p>
                    <p className="mt-2 text-xs font-bold text-blue-100">10:23</p>
                  </div>
                </div>

                <div className="mt-5 flex justify-start">
                  <div
                    className={`max-w-[680px] rounded-[1.5rem] border px-5 py-4 ${softCardClass}`}
                  >
                    <p
                      className={`text-sm font-semibold leading-7 ${titleClass}`}
                    >
                      {t.assistantMessage}
                    </p>
                    <p className={`mt-2 text-xs font-bold ${mutedClass}`}>
                      10:24
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "max-w-[560px] rounded-[1.5rem] bg-blue-600 px-5 py-4 text-white shadow-sm shadow-blue-600/20"
                          : `max-w-[680px] rounded-[1.5rem] border px-5 py-4 ${softCardClass}`
                      }
                    >
                      <p
                        className={
                          message.role === "user"
                            ? "whitespace-pre-wrap text-sm font-semibold leading-6"
                            : `whitespace-pre-wrap text-sm font-semibold leading-7 ${titleClass}`
                        }
                      >
                        {message.content}
                      </p>
                      <p
                        className={
                          message.role === "user"
                            ? "mt-2 text-xs font-bold text-blue-100"
                            : `mt-2 text-xs font-bold ${mutedClass}`
                        }
                      >
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[680px] rounded-[1.5rem] border px-5 py-4 ${softCardClass}`}
                    >
                      <p className={`text-sm font-semibold ${mutedClass}`}>
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-5 dark:border-white/10 sm:p-6">
            <form
              onSubmit={handleSubmit}
              className={`flex flex-col gap-3 rounded-3xl border p-3 sm:flex-row sm:items-center ${softCardClass}`}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t.inputPlaceholder}
                className={`h-12 min-w-0 flex-1 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setError("File attachments are available on the Files page.")
                  }
                  className={`inline-flex h-12 flex-1 items-center justify-center rounded-2xl border px-4 text-sm font-black transition sm:flex-none ${
                    isDark
                      ? "border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t.attach}
                </button>

                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  {sending ? "..." : t.send}
                </button>
              </div>
            </form>

            {(error || usageLabel) && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {error && (
                  <p className="text-sm font-semibold text-red-500">{error}</p>
                )}
                {usageLabel && (
                  <p className={`text-xs font-black ${mutedClass}`}>
                    AI usage: {usageLabel}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <aside className="grid min-w-0 gap-6">
          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div className="flex items-center justify-between gap-4">
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.quickTips}
              </h2>

              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-black text-blue-600">
                {t.beta}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {tips.map((tip) => (
                <div
                  key={tip.key}
                  className={`flex min-w-0 gap-4 rounded-3xl border p-4 ${softCardClass}`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
                      isDark ? "bg-blue-500/15" : "bg-blue-600/10"
                    }`}
                  >
                    {tip.icon}
                  </div>

                  <div className="min-w-0">
                    <p className={`text-sm font-black ${titleClass}`}>
                      {t.tips[tip.key].title}
                    </p>
                    <p className={`mt-1 text-xs font-semibold leading-5 ${mutedClass}`}>
                      {t.tips[tip.key].subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div className="flex items-center justify-between gap-4">
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.recentChats}
              </h2>

              <button
                type="button"
                className="text-sm font-black text-blue-600 transition hover:text-blue-700"
              >
                {t.viewAll}
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {recentList.map((chat) => (
                <button
                  key={chat.key}
                  type="button"
                  onClick={() => handleRecentClick(chat.key)}
                  className={`flex min-w-0 items-center gap-4 rounded-2xl p-3 text-left transition ${
                    isDark
                      ? "hover:bg-white/10"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isDark ? "bg-blue-500/15" : "bg-blue-600/10"
                    }`}
                  >
                    💬
                  </div>

                  <div className="min-w-0">
                    <p className={`truncate text-sm font-black ${titleClass}`}>
                      {t.recent[chat.key]}
                    </p>
                    <p className={`mt-1 text-xs font-semibold ${mutedClass}`}>
                      {chat.formattedDate}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-sm shadow-blue-600/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl">
              ✨
            </div>

            <h2 className="mt-5 text-xl font-black">{t.onlineTitle}</h2>

            <p className="mt-2 text-sm font-medium leading-6 text-blue-100">
              {t.onlineSubtitle}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function AiTutorPage() {
  return (
    <AppShell>
      <TutorContent />
    </AppShell>
  );
}
