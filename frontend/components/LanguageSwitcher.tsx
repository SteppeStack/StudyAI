"use client";

import { languages, type Language } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const activeIndex = languages.findIndex((item) => item.code === language);

  return (
    <div className="relative grid w-[132px] shrink-0 grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <div
        className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.5rem)/3)] rounded-lg bg-blue-600 transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLanguage(item.code as Language)}
          className={
            language === item.code
              ? "relative z-10 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors duration-300"
              : "relative z-10 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors duration-300 hover:text-slate-900"
          }
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}