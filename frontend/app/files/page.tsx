"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentTheme } from "@/lib/theme";
import {
  analyzeFile,
  createFileSignedUrl,
  deleteFile,
  listFiles,
  uploadFile,
  type UserFile,
} from "@/lib/studyApi";

type Language = "en" | "ru" | "kz";
type Theme = "light" | "dark";
type FileCategory = "notes" | "documents" | "examMaterials" | "images";
type FileStatus = "ready" | "saved" | "processing";
type FilterKey = "all" | FileCategory;

type FileItem = {
  id: string;
  title: string;
  category: FileCategory;
  size: string;
  date: string;
  status: FileStatus;
  icon: string;
  source: "api" | "local" | "demo";
  analysis?: string;
};

type FolderItem = {
  key: FileCategory;
  count: number;
  icon: string;
};

type Copy = {
  pageBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  storageTitle: string;
  storageSubtitle: string;
  used: string;
  available: string;
  uploadTitle: string;
  uploadSubtitle: string;
  chooseFilesTitle: string;
  chooseFilesSubtitle: string;
  chooseFilesButton: string;
  quickFoldersTitle: string;
  quickFoldersSubtitle: string;
  recentFilesTitle: string;
  recentFilesSubtitle: string;
  searchPlaceholder: string;
  open: string;
  download: string;
  remove: string;
  analyze: string;
  analyzing: string;
  uploading: string;
  localBanner: string;
  demoBanner: string;
  apiBanner: string;
  unsupportedFile: string;
  localOpenUnavailable: string;
  deleted: string;
  uploaded: string;
  analysisReady: string;
  all: string;
  files: string;
  noFilesTitle: string;
  noFilesSubtitle: string;
  categories: Record<FileCategory, string>;
  statuses: Record<FileStatus, string>;
};

const copy: Record<Language, Copy> = {
  en: {
    pageBadge: "Files Workspace",
    heroTitle: "Keep all study materials organized",
    heroSubtitle:
      "Store lecture notes, assignments, documents, screenshots, exam materials, and research files in one clean workspace.",
    storageTitle: "Storage usage",
    storageSubtitle: "Used storage for academic files",
    used: "Used",
    available: "Available",
    uploadTitle: "Upload files",
    uploadSubtitle:
      "Drag files here or choose them from your device. Later, uploaded files will be connected to AI Tutor, Exam Prep, and Document Generator.",
    chooseFilesTitle: "Choose files",
    chooseFilesSubtitle: "Frontend preview",
    chooseFilesButton: "Choose files",
    quickFoldersTitle: "Quick folders",
    quickFoldersSubtitle: "Organize files by study purpose.",
    recentFilesTitle: "Recent files",
    recentFilesSubtitle: "Your latest uploaded and saved academic materials.",
    searchPlaceholder: "Search files...",
    open: "Open",
    download: "Download",
    remove: "Remove",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    uploading: "Uploading...",
    localBanner:
      "Backend is unavailable. File metadata is saved locally in this browser.",
    demoBanner:
      "Demo files are shown because backend is unavailable and no local files exist yet.",
    apiBanner: "Live API files are connected.",
    unsupportedFile: "Unsupported file type.",
    localOpenUnavailable:
      "Local preview metadata cannot reopen files after refresh without backend storage.",
    deleted: "File removed.",
    uploaded: "File added.",
    analysisReady: "Analysis preview is ready.",
    all: "All",
    files: "files",
    noFilesTitle: "No files found",
    noFilesSubtitle: "Try another search or choose a different folder filter.",
    categories: {
      notes: "Lecture notes",
      documents: "Documents",
      examMaterials: "Exam materials",
      images: "Images",
    },
    statuses: {
      ready: "Ready",
      saved: "Saved",
      processing: "Processing",
    },
  },
  ru: {
    pageBadge: "Files Workspace",
    heroTitle: "Храни все учебные материалы в порядке",
    heroSubtitle:
      "Сохраняй лекции, задания, документы, скриншоты, материалы к экзаменам и исследовательские файлы в одном аккуратном workspace.",
    storageTitle: "Использование хранилища",
    storageSubtitle: "Занято учебными файлами",
    used: "Использовано",
    available: "Доступно",
    uploadTitle: "Загрузка файлов",
    uploadSubtitle:
      "Перетащи файлы сюда или выбери их с устройства. Позже загруженные файлы будут подключены к AI Tutor, Exam Prep и генератору документов.",
    chooseFilesTitle: "Выбрать файлы",
    chooseFilesSubtitle: "Frontend preview",
    chooseFilesButton: "Выбрать файлы",
    quickFoldersTitle: "Быстрые папки",
    quickFoldersSubtitle: "Организуй файлы по учебной цели.",
    recentFilesTitle: "Недавние файлы",
    recentFilesSubtitle: "Последние загруженные и сохранённые учебные материалы.",
    searchPlaceholder: "Поиск файлов...",
    open: "Открыть",
    download: "Скачать",
    remove: "Удалить",
    analyze: "Анализ",
    analyzing: "Анализ...",
    uploading: "Загрузка...",
    localBanner:
      "Backend недоступен. Метаданные файлов сохраняются локально в этом браузере.",
    demoBanner:
      "Показаны demo-файлы, потому что backend недоступен и локальных файлов пока нет.",
    apiBanner: "Подключены live-файлы из API.",
    unsupportedFile: "Неподдерживаемый тип файла.",
    localOpenUnavailable:
      "Локальный preview хранит только метаданные и не сможет открыть файл после refresh без backend storage.",
    deleted: "Файл удалён.",
    uploaded: "Файл добавлен.",
    analysisReady: "Preview анализа готов.",
    all: "Все",
    files: "файлов",
    noFilesTitle: "Файлы не найдены",
    noFilesSubtitle: "Попробуй изменить поиск или выбрать другой фильтр папки.",
    categories: {
      notes: "Лекции",
      documents: "Документы",
      examMaterials: "Материалы к экзаменам",
      images: "Изображения",
    },
    statuses: {
      ready: "Готово",
      saved: "Сохранено",
      processing: "Обработка",
    },
  },
  kz: {
    pageBadge: "Files Workspace",
    heroTitle: "Барлық оқу материалдарын реттеп сақтаңыз",
    heroSubtitle:
      "Лекциялар, тапсырмалар, құжаттар, скриншоттар, емтихан материалдары және зерттеу файлдарын бір таза workspace ішінде сақтаңыз.",
    storageTitle: "Хранилище қолдану",
    storageSubtitle: "Оқу файлдары үшін қолданылған орын",
    used: "Қолданылды",
    available: "Қолжетімді",
    uploadTitle: "Файлдарды жүктеу",
    uploadSubtitle:
      "Файлдарды осы жерге сүйреңіз немесе құрылғыдан таңдаңыз. Кейін жүктелген файлдар AI Tutor, Exam Prep және Document Generator арқылы қолданылады.",
    chooseFilesTitle: "Файлдарды таңдау",
    chooseFilesSubtitle: "Frontend preview",
    chooseFilesButton: "Файлдарды таңдау",
    quickFoldersTitle: "Жылдам папкалар",
    quickFoldersSubtitle: "Файлдарды оқу мақсаты бойынша реттеңіз.",
    recentFilesTitle: "Соңғы файлдар",
    recentFilesSubtitle: "Соңғы жүктелген және сақталған оқу материалдары.",
    searchPlaceholder: "Файлдарды іздеу...",
    open: "Ашу",
    download: "Жүктеу",
    remove: "Жою",
    analyze: "Талдау",
    analyzing: "Талдау...",
    uploading: "Жүктелуде...",
    localBanner:
      "Backend қолжетімсіз. Файл метадеректері осы браузерде жергілікті сақталады.",
    demoBanner:
      "Backend қолжетімсіз және жергілікті файлдар жоқ болғандықтан demo-файлдар көрсетілді.",
    apiBanner: "API арқылы live файлдар қосылған.",
    unsupportedFile: "Қолдау көрсетілмейтін файл түрі.",
    localOpenUnavailable:
      "Local preview тек метадеректерді сақтайды, backend storage болмаса refresh кейін файл ашылмайды.",
    deleted: "Файл жойылды.",
    uploaded: "Файл қосылды.",
    analysisReady: "Талдау preview дайын.",
    all: "Барлығы",
    files: "файл",
    noFilesTitle: "Файлдар табылмады",
    noFilesSubtitle: "Басқа іздеу қолданып көріңіз немесе басқа папка фильтрін таңдаңыз.",
    categories: {
      notes: "Лекциялар",
      documents: "Құжаттар",
      examMaterials: "Емтихан материалдары",
      images: "Суреттер",
    },
    statuses: {
      ready: "Дайын",
      saved: "Сақталды",
      processing: "Өңделуде",
    },
  },
};

const languageStorageKeys = [
  "studyai-language",
  "studyai_lang",
  "language",
  "locale",
];

const localFilesStorageKey = "studyai-local-files";
const allowedExtensions = [
  "pdf",
  "doc",
  "docx",
  "txt",
  "md",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "csv",
  "png",
  "jpg",
  "jpeg",
];

const demoFiles: FileItem[] = [
  {
    id: "demo-database-notes",
    title: "Database Systems Lecture Notes.pdf",
    category: "notes",
    size: "2.4 MB",
    date: "Today",
    status: "ready",
    icon: "📄",
    source: "demo",
  },
  {
    id: "demo-research-draft",
    title: "Research Paper Draft.docx",
    category: "documents",
    size: "860 KB",
    date: "Yesterday",
    status: "saved",
    icon: "📝",
    source: "demo",
  },
  {
    id: "demo-formula-sheet",
    title: "Exam Formula Sheet.png",
    category: "examMaterials",
    size: "1.1 MB",
    date: "18.05.26",
    status: "processing",
    icon: "🎯",
    source: "demo",
  },
  {
    id: "demo-whiteboard",
    title: "Whiteboard Screenshot.jpg",
    category: "images",
    size: "740 KB",
    date: "17.05.26",
    status: "ready",
    icon: "🖼️",
    source: "demo",
  },
];

const folderItems: FolderItem[] = [
  {
    key: "notes",
    count: 12,
    icon: "📝",
  },
  {
    key: "documents",
    count: 9,
    icon: "📄",
  },
  {
    key: "examMaterials",
    count: 7,
    icon: "🎯",
  },
  {
    key: "images",
    count: 5,
    icon: "🖼️",
  },
];

function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function isAllowedFile(file: File) {
  return allowedExtensions.includes(getExtension(file.name));
}

function getCategory(fileName: string): FileCategory {
  const extension = getExtension(fileName);

  if (["png", "jpg", "jpeg"].includes(extension)) return "images";
  if (["ppt", "pptx", "xls", "xlsx", "csv"].includes(extension)) {
    return "examMaterials";
  }
  if (["pdf", "doc", "docx"].includes(extension)) return "documents";

  return "notes";
}

function getFileIcon(category: FileCategory) {
  if (category === "images") return "🖼️";
  if (category === "examMaterials") return "🎯";
  if (category === "documents") return "📄";
  return "📝";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function todayLabel() {
  return new Date().toLocaleDateString("de-DE");
}

function readLocalFiles() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(localFilesStorageKey);
    if (!raw) return [];
    return (JSON.parse(raw) as FileItem[]).map((file) => ({
      ...file,
      source: "local" as const,
    }));
  } catch {
    return [];
  }
}

function saveLocalFiles(files: FileItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    localFilesStorageKey,
    JSON.stringify(
      files
        .filter((file) => file.source !== "demo")
        .map((file) => ({ ...file, source: "local" as const }))
    )
  );
}

function fileFromApi(file: UserFile): FileItem {
  const category = getCategory(file.original_name);

  return {
    id: file.id,
    title: file.original_name || "Untitled file",
    category,
    size: formatBytes(file.size_bytes),
    date: file.created_at ? new Date(file.created_at).toLocaleDateString("de-DE") : todayLabel(),
    status: file.status === "processing" ? "processing" : "ready",
    icon: getFileIcon(category),
    source: "api",
  };
}

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

function getStatusColor(status: FileStatus, isDark: boolean) {
  if (status === "ready") {
    return isDark
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-emerald-50 text-emerald-700";
  }

  if (status === "saved") {
    return isDark
      ? "bg-blue-500/15 text-blue-300"
      : "bg-blue-50 text-blue-700";
  }

  return isDark
    ? "bg-orange-500/15 text-orange-300"
    : "bg-orange-50 text-orange-700";
}

function FilesContent() {
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>(() => getCurrentTheme());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dataMode, setDataMode] = useState<"api" | "local" | "demo">("demo");
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const t = copy[language];
  const isDark = theme === "dark";

  function showTransientToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setTheme(getCurrentTheme());

    async function loadInitialFiles() {
      try {
        const apiFiles = await listFiles();
        setFiles(apiFiles.map(fileFromApi));
        setDataMode("api");
      } catch {
        const localFiles = readLocalFiles();

        if (localFiles.length > 0) {
          setFiles(localFiles);
          setDataMode("local");
        } else {
          setFiles(demoFiles);
          setDataMode("demo");
        }
      }
    }

    loadInitialFiles();

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
      setTheme(getCurrentTheme());
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

  function persistLocalFiles(nextFiles: FileItem[]) {
    setFiles(nextFiles);
    setDataMode("local");
    saveLocalFiles(nextFiles);
  }

  async function handleFileSelect(fileList: FileList | null) {
    if (!fileList?.length) return;

    const selectedFiles = Array.from(fileList);
    const unsupportedFile = selectedFiles.find((file) => !isAllowedFile(file));

    if (unsupportedFile) {
      showTransientToast(`${t.unsupportedFile} ${unsupportedFile.name}`);
      return;
    }

    setUploading(true);

    try {
      if (dataMode === "api") {
        const uploaded = await Promise.all(selectedFiles.map((file) => uploadFile(file)));
        setFiles((current) => [...uploaded.map(fileFromApi), ...current]);
      } else {
        const localFiles = selectedFiles.map((file) => {
          const category = getCategory(file.name);
          return {
            id: `local-file-${Date.now()}-${file.name}`,
            title: file.name,
            category,
            size: formatBytes(file.size),
            date: todayLabel(),
            status: "saved" as const,
            icon: getFileIcon(category),
            source: "local" as const,
          };
        });
        persistLocalFiles([...localFiles, ...files.filter((file) => file.source !== "demo")]);
      }

      showTransientToast(t.uploaded);
    } catch {
      const localFiles = selectedFiles.map((file) => {
        const category = getCategory(file.name);
        return {
          id: `local-file-${Date.now()}-${file.name}`,
          title: file.name,
          category,
          size: formatBytes(file.size),
          date: todayLabel(),
          status: "saved" as const,
          icon: getFileIcon(category),
          source: "local" as const,
        };
      });
      persistLocalFiles([...localFiles, ...readLocalFiles()]);
      showTransientToast(t.localBanner);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleOpen(file: FileItem) {
    if (file.source !== "api") {
      showTransientToast(t.localOpenUnavailable);
      return;
    }

    try {
      const response = await createFileSignedUrl(file.id);
      window.open(response.signed_url, "_blank", "noopener,noreferrer");
    } catch {
      showTransientToast(t.localOpenUnavailable);
    }
  }

  async function handleDelete(file: FileItem) {
    try {
      if (file.source === "api") await deleteFile(file.id);
    } catch {
      // Local removal still keeps the UI usable if the backend is temporarily down.
    }

    const nextFiles = files.filter((item) => item.id !== file.id);
    if (dataMode === "api") {
      setFiles(nextFiles);
    } else {
      persistLocalFiles(nextFiles);
    }
    showTransientToast(t.deleted);
  }

  async function handleAnalyze(file: FileItem) {
    setAnalyzingId(file.id);

    try {
      if (file.source === "api") {
        const response = await analyzeFile(file.id, { action: "summarize" });
        setFiles((current) =>
          current.map((item) =>
            item.id === file.id ? { ...item, analysis: response.result } : item
          )
        );
      } else {
        persistLocalFiles(
          files.map((item) =>
            item.id === file.id
              ? {
                  ...item,
                  analysis:
                    "Local preview: summarize the file, extract key terms, and prepare questions for review.",
                }
              : item
          )
        );
      }

      showTransientToast(t.analysisReady);
    } catch {
      persistLocalFiles(
        files.map((item) =>
          item.id === file.id
            ? {
                ...item,
                analysis:
                  "Local preview: summarize the file, extract key terms, and prepare questions for review.",
              }
            : item
        )
      );
      showTransientToast(t.localBanner);
    } finally {
      setAnalyzingId(null);
    }
  }

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return files.filter((file) => {
      const matchesFilter = filter === "all" || file.category === filter;

      const text = [
        file.title,
        t.categories[file.category],
        t.statuses[file.status],
        file.size,
        file.date,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || text.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [files, filter, search, t]);

  const dynamicFolderItems = useMemo(() => {
    return folderItems.map((folder) => ({
      ...folder,
      count: files.filter((file) => file.category === folder.key).length,
    }));
  }, [files]);

  const bannerText =
    dataMode === "api" ? t.apiBanner : dataMode === "local" ? t.localBanner : t.demoBanner;

  const pageClass = isDark
    ? "min-h-full bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"
    : "min-h-full bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8";

  const cardClass = isDark
    ? "border-white/10 bg-slate-900/70 shadow-sm"
    : "border-slate-200 bg-white shadow-sm";

  const softCardClass = isDark
    ? "border-white/10 bg-slate-950/50"
    : "border-slate-200 bg-slate-50";

  const accentCardClass = isDark
    ? "border-blue-400/20 bg-blue-500/15"
    : "border-blue-100 bg-blue-50";

  const titleClass = isDark ? "text-white" : "text-slate-950";
  const textClass = isDark ? "text-slate-300" : "text-slate-600";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";

  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-500/10"
    : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/10";

  return (
    <div className={pageClass}>
      {toast && (
        <div className="fixed right-4 top-20 z-[70] w-[min(360px,calc(100vw-2rem))] rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6">
        <section
          className={`overflow-hidden rounded-[2rem] border p-5 sm:p-6 lg:p-8 ${cardClass}`}
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${
                  isDark
                    ? "border-blue-400/20 bg-blue-400/10 text-blue-200"
                    : "border-blue-100 bg-blue-50 text-blue-700"
                }`}
              >
                📁 {t.pageBadge}
              </div>

              <h1
                className={`max-w-4xl text-3xl font-black tracking-tight sm:text-4xl ${titleClass}`}
              >
                {t.heroTitle}
              </h1>

              <p
                className={`mt-4 max-w-4xl text-sm leading-7 sm:text-base ${textClass}`}
              >
                {t.heroSubtitle}
              </p>
            </div>

            <div
              className={`w-full shrink-0 rounded-3xl border p-5 lg:w-80 ${accentCardClass}`}
            >
              <p className="text-sm font-black text-blue-500">
                {t.storageTitle}
              </p>

              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.storageSubtitle}
              </p>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className={`text-xs font-black ${mutedClass}`}>
                  {t.used}: 3.2 GB
                </p>

                <p className={`text-xs font-black ${mutedClass}`}>
                  {t.available}: 10 GB
                </p>
              </div>

              <div
                className={`mt-3 h-3 overflow-hidden rounded-full ${
                  isDark ? "bg-slate-950" : "bg-white"
                }`}
              >
                <div className="h-full w-[32%] rounded-full bg-blue-600" />
              </div>
            </div>
          </div>
        </section>

        <section
          className={`rounded-[1.5rem] border px-4 py-3 text-sm font-bold ${
            dataMode === "api"
              ? isDark
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                : "border-emerald-100 bg-emerald-50 text-emerald-700"
              : isDark
                ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
                : "border-amber-100 bg-amber-50 text-amber-800"
          }`}
        >
          {bannerText}
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(340px,0.8fr)_minmax(0,1.2fr)]">
          <aside className="grid min-w-0 gap-6">
            <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.uploadTitle}
              </h2>

              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.uploadSubtitle}
              </p>

              <div
                className={`mt-6 rounded-[2rem] border border-dashed p-8 text-center ${
                  isDark
                    ? "border-blue-400/20 bg-blue-500/15"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-2xl ${
                    isDark ? "bg-slate-950/60" : "bg-white"
                  }`}
                >
                  📤
                </div>

                <h3 className={`mt-5 text-lg font-black ${titleClass}`}>
                  {t.chooseFilesTitle}
                </h3>

                <p className={`mt-2 text-sm font-semibold ${mutedClass}`}>
                  {t.chooseFilesSubtitle}
                </p>

                <label className="mt-5 inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700">
                  {uploading ? t.uploading : t.chooseFilesButton}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept={allowedExtensions.map((extension) => `.${extension}`).join(",")}
                    onChange={(event) => handleFileSelect(event.target.files)}
                  />
                </label>
              </div>
            </section>

            <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
              <h2 className={`text-xl font-black ${titleClass}`}>
                {t.quickFoldersTitle}
              </h2>

              <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                {t.quickFoldersSubtitle}
              </p>

              <div className="mt-5 grid gap-3">
                {dynamicFolderItems.map((folder) => {
                  const active = filter === folder.key;

                  return (
                    <button
                      key={folder.key}
                      type="button"
                      onClick={() => setFilter(folder.key)}
                      className={`flex min-w-0 items-center gap-4 rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${
                        active
                          ? "border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                          : softCardClass
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                          active
                            ? "bg-white/15"
                            : isDark
                              ? "bg-blue-500/15"
                              : "bg-blue-50"
                        }`}
                      >
                        {folder.icon}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-black ${
                            active ? "text-white" : titleClass
                          }`}
                        >
                          {t.categories[folder.key]}
                        </p>

                        <p
                          className={`mt-1 text-xs font-semibold ${
                            active ? "text-blue-100" : mutedClass
                          }`}
                        >
                          {folder.count} {t.files}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>

          <section className={`rounded-[2rem] border p-5 sm:p-6 ${cardClass}`}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div className="min-w-0">
                <h2 className={`text-xl font-black ${titleClass}`}>
                  {t.recentFilesTitle}
                </h2>

                <p className={`mt-2 text-sm leading-6 ${textClass}`}>
                  {t.recentFilesSubtitle}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_160px] lg:w-[420px]">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`h-12 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                />

                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as FilterKey)}
                  className={`h-12 rounded-2xl border px-4 text-sm font-black outline-none transition focus:ring-4 ${inputClass}`}
                >
                  <option value="all">{t.all}</option>
                  <option value="notes">{t.categories.notes}</option>
                  <option value="documents">{t.categories.documents}</option>
                  <option value="examMaterials">
                    {t.categories.examMaterials}
                  </option>
                  <option value="images">{t.categories.images}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <article
                    key={file.id}
                    className={`min-w-0 rounded-[1.75rem] border p-4 sm:p-5 ${softCardClass}`}
                  >
                    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl ${
                            isDark ? "bg-blue-500/15" : "bg-blue-50"
                          }`}
                        >
                          {file.icon}
                        </div>

                        <div className="min-w-0">
                          <h3
                            className={`break-words text-base font-black ${titleClass}`}
                          >
                            {file.title}
                          </h3>

                          <p className={`mt-1 text-sm font-semibold ${mutedClass}`}>
                            {t.categories[file.category]} · {file.size} ·{" "}
                            {file.date}
                          </p>

                          <span
                            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${getStatusColor(
                              file.status,
                              isDark
                            )}`}
                          >
                            {t.statuses[file.status]}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3 lg:shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpen(file)}
                          className={`h-10 rounded-2xl px-4 text-sm font-black transition ${
                            isDark
                              ? "bg-blue-500/15 text-blue-200 hover:bg-blue-600 hover:text-white"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          {t.open}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAnalyze(file)}
                          disabled={analyzingId === file.id}
                          className={`h-10 rounded-2xl px-4 text-sm font-black transition ${
                            isDark
                              ? "bg-slate-800 text-slate-200 hover:bg-white/10"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {analyzingId === file.id ? t.analyzing : t.analyze}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(file)}
                          className={`h-10 rounded-2xl px-4 text-sm font-black transition ${
                            isDark
                              ? "bg-red-500/10 text-red-300 hover:bg-red-600 hover:text-white"
                              : "bg-red-50 text-red-700 hover:bg-red-600 hover:text-white"
                          }`}
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                    {file.analysis && (
                      <div
                        className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${softCardClass}`}
                      >
                        {file.analysis}
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div className={`rounded-[1.75rem] border p-8 text-center ${softCardClass}`}>
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${
                      isDark ? "bg-blue-500/15" : "bg-blue-50"
                    }`}
                  >
                    🔎
                  </div>

                  <h3 className={`mt-4 text-xl font-black ${titleClass}`}>
                    {t.noFilesTitle}
                  </h3>

                  <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedClass}`}>
                    {t.noFilesSubtitle}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function FilesPage() {
  return (
    <AppShell>
      <FilesContent />
    </AppShell>
  );
}
