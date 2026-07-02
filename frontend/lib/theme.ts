export type Theme = "light" | "dark";

export const themeStorageKeys = ["studyai-theme", "studyai_theme", "theme"];

function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "light";

  const datasetTheme = document.documentElement.dataset.theme;
  if (isTheme(datasetTheme)) return datasetTheme;

  if (typeof window !== "undefined") {
    for (const key of themeStorageKeys) {
      const value = window.localStorage.getItem(key);
      if (isTheme(value)) return value;
    }
  }

  return "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.dataset.theme = "dark";
  } else {
    root.classList.remove("dark");
    root.dataset.theme = "light";
  }
}

export function saveTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  for (const key of themeStorageKeys) {
    window.localStorage.setItem(key, theme);
  }
}
