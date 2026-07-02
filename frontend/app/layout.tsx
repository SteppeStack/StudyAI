import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import AuthGuard from "@/components/AuthGuard";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyAI — Academic AI Workspace",
  description:
    "StudyAI helps students manage assignments, generate documents, prepare for exams, organize files, and study smarter with AI.",
};

const themeInitScript = `
(function () {
  try {
    var keys = ["studyai-theme", "studyai_theme", "theme"];
    var theme = "light";

    for (var index = 0; index < keys.length; index += 1) {
      var value = window.localStorage.getItem(keys[index]);
      if (value === "light" || value === "dark") {
        theme = value;
        break;
      }
    }

    var root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }

    for (var syncIndex = 0; syncIndex < keys.length; syncIndex += 1) {
      window.localStorage.setItem(keys[syncIndex], theme);
    }
  } catch (_error) {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="light"
      className={`${notoSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="min-h-full font-sans">
        <LanguageProvider>
          <AuthGuard>{children}</AuthGuard>
        </LanguageProvider>
      </body>
    </html>
  );
}
