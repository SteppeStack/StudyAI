import { saveLocalProfile } from "@/lib/profile";

export type PreviewUser = {
  id: string;
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
};

export type PreviewSession = {
  userId: string;
  email: string;
  displayName: string;
  createdAt: string;
};

export const previewUsersStorageKey = "studyai-preview-users";
export const previewSessionStorageKey = "studyai-preview-session";
export const previewAuthCookieName = "studyai-preview-auth";

export function isLocalPreviewOrigin() {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV === "production") return false;

  const hostname = window.location.hostname.toLowerCase();

  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (hostname.startsWith("192.168.")) return true;
  if (hostname.startsWith("10.")) return true;

  const parts = hostname.split(".");
  const first = Number(parts[0]);
  const second = Number(parts[1]);

  return first === 172 && second >= 16 && second <= 31;
}

export function setPreviewAuthCookie(loggedIn: boolean) {
  if (typeof document === "undefined") return;

  document.cookie = loggedIn
    ? `${previewAuthCookieName}=1; Path=/; SameSite=Lax; Max-Age=604800`
    : `${previewAuthCookieName}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export function hasPreviewAuthCookie() {
  if (typeof document === "undefined") return false;

  return document.cookie
    .split(";")
    .some((item) => item.trim() === `${previewAuthCookieName}=1`);
}

// MVP/demo fallback only. This is intentionally local to each browser origin
// and is used when Supabase is unavailable or a preview account is used.
export function readPreviewUsers(): PreviewUser[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(previewUsersStorageKey) ?? "[]"
    );

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readPreviewSession(): PreviewSession | null {
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(previewSessionStorageKey) ?? "null"
    ) as PreviewSession | null;

    if (!parsed?.email || !parsed.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createPreviewUser({
  email,
  password,
  displayName,
}: {
  email: string;
  password: string;
  displayName: string;
}) {
  if (typeof window === "undefined") {
    throw new Error("Preview auth is available only in the browser.");
  }

  const normalizedEmail = normalizeEmail(email);
  const users = readPreviewUsers();
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error("Preview account already exists. Please log in.");
  }

  const user: PreviewUser = {
    id: `preview-${Date.now()}`,
    email: normalizedEmail,
    password,
    displayName,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    previewUsersStorageKey,
    JSON.stringify([...users, user])
  );

  return createPreviewSession(user);
}

export function signInPreviewUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = readPreviewUsers().find(
    (item) => item.email === normalizedEmail && item.password === password
  );

  if (!user) return null;
  return createPreviewSession(user);
}

export function clearPreviewSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(previewSessionStorageKey);
  setPreviewAuthCookie(false);
}

function createPreviewSession(user: PreviewUser) {
  const session: PreviewSession = {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(previewSessionStorageKey, JSON.stringify(session));
  setPreviewAuthCookie(true);
  saveLocalProfile({ displayName: user.displayName });
  window.dispatchEvent(new CustomEvent("studyai:preview-auth-change"));

  return session;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
