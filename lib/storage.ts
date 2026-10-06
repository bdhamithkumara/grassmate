import { DEFAULT_SETTINGS, type JournalEntry, type Settings } from "./types";

const JOURNAL_KEY = "grassmate.journal.v1";
const SETTINGS_KEY = "grassmate.settings.v1";

// localStorage can be missing or throw (private windows, blocked storage),
// so every access is guarded and the app keeps working in memory.
function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable; nothing else to do.
  }
}

export function loadJournal(): JournalEntry[] {
  const entries = read<unknown>(JOURNAL_KEY, []);
  return Array.isArray(entries) ? (entries as JournalEntry[]) : [];
}

export function saveJournal(entries: JournalEntry[]): void {
  write(JOURNAL_KEY, entries);
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: Settings): void {
  write(SETTINGS_KEY, settings);
}
