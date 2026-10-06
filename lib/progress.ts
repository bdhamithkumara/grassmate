import type { JournalEntry } from "./types";

/** Local calendar day as YYYY-MM-DD. */
export function localDay(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return localDay(new Date(y, m - 1, d + delta));
}

/**
 * Consecutive days with at least one adventure, ending today.
 * A streak that ended yesterday still counts until today is over.
 */
export function currentStreak(entries: JournalEntry[], today: string = localDay()): number {
  const days = new Set(entries.map((e) => e.date));
  let day = days.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (days.has(day)) {
    streak++;
    day = shiftDay(day, -1);
  }
  return streak;
}

/** Longest run of consecutive adventure days in the whole journal. */
export function longestStreak(entries: JournalEntry[]): number {
  const days = [...new Set(entries.map((e) => e.date))].sort();
  let longest = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && shiftDay(days[i - 1], 1) === days[i] ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  return longest;
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  hint: string;
  earned: (entries: JournalEntry[]) => boolean;
}

export const BADGES: Badge[] = [
  { id: "first", emoji: "🌱", name: "First Adventure", hint: "Finish 1 adventure", earned: (e) => e.length >= 1 },
  { id: "explorer", emoji: "🌿", name: "Explorer", hint: "Finish 5 adventures", earned: (e) => e.length >= 5 },
  { id: "nature-lover", emoji: "🌳", name: "Nature Lover", hint: "Finish 10 adventures", earned: (e) => e.length >= 10 },
  { id: "seven-day", emoji: "🍂", name: "Seven-Day Streak", hint: "Go outside 7 days in a row", earned: (e) => longestStreak(e) >= 7 },
];

export function earnedBadgeIds(entries: JournalEntry[]): string[] {
  return BADGES.filter((b) => b.earned(entries)).map((b) => b.id);
}

export function minutesOn(entries: JournalEntry[], day: string): number {
  return entries.filter((e) => e.date === day).reduce((sum, e) => sum + e.minutes, 0);
}
