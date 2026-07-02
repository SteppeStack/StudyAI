export type LocalProfile = {
  displayName?: string;
  university?: string;
  program?: string;
  studyLevel?: string;
  studyGoal?: string;
  updatedAt?: string;
};

export const profileStorageKey = "studyai-settings-profile";
const displayNameStorageKeys = ["studyai-display-name", "displayName"];

export function readLocalProfile(): LocalProfile {
  if (typeof window === "undefined") return {};

  const rawProfile = window.localStorage.getItem(profileStorageKey);

  if (!rawProfile) {
    const displayName = getStoredDisplayName();
    return displayName ? { displayName } : {};
  }

  try {
    return JSON.parse(rawProfile) as LocalProfile;
  } catch {
    return {};
  }
}

export function getStoredDisplayName() {
  if (typeof window === "undefined") return "";

  for (const key of displayNameStorageKeys) {
    const value = window.localStorage.getItem(key)?.trim();
    if (value) return value;
  }

  return "";
}

export function saveLocalProfile(profile: LocalProfile) {
  if (typeof window === "undefined") return;

  const previous = readLocalProfile();
  const nextProfile = {
    ...previous,
    ...profile,
    updatedAt: profile.updatedAt ?? new Date().toISOString(),
  };

  window.localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile));

  if (nextProfile.displayName?.trim()) {
    for (const key of displayNameStorageKeys) {
      window.localStorage.setItem(key, nextProfile.displayName.trim());
    }
  }

  window.dispatchEvent(new CustomEvent("studyai:profile-change"));
}

export function saveDisplayName(displayName: string) {
  const cleaned = displayName.trim();
  if (!cleaned) return;

  saveLocalProfile({ displayName: cleaned });
}

export function getDisplayNameFromMetadata(metadata: Record<string, unknown>) {
  const directName =
    getString(metadata.display_name) || getString(metadata.full_name);
  if (directName) return directName;

  const firstName = getString(metadata.first_name);
  const lastName = getString(metadata.last_name);
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
