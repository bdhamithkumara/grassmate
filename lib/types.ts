export const TIMES = [15, 30, 45, 60] as const;
export const WEATHERS = ["sunny", "cloudy", "rainy", "cold", "hot"] as const;
export const ENVIRONMENTS = ["park", "beach", "forest", "village", "city"] as const;
export const THEMES = ["any", "nature", "mindful", "creative", "active"] as const;
export const DIFFICULTIES = ["easy", "medium", "active"] as const;

export type Minutes = (typeof TIMES)[number];
export type Weather = (typeof WEATHERS)[number];
export type Environment = (typeof ENVIRONMENTS)[number];
export type Theme = (typeof THEMES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Longest mission Surprise Adventure may invent. */
export const SURPRISE_MAX_MINUTES = 45;

export interface Mission {
  emoji: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: number;
  steps: string[];
  reward: string;
  encouragement: string;
  reflection: string;
}

export type MissionRequest =
  | {
      mode: "custom";
      minutes: Minutes;
      weather: Weather;
      environment: Environment;
      theme: Theme;
      avoid: string[];
    }
  | { mode: "surprise"; theme: Theme; avoid: string[] };

export interface MissionResponse {
  mission: Mission;
  source: "ai" | "fallback";
}

export interface JournalEntry {
  id: string;
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  createdAt: string;
  emoji: string;
  title: string;
  minutes: number;
  question: string;
  answer: string;
}

export type ColorMode = "system" | "light" | "dark";

export interface Settings {
  colorMode: ColorMode;
  defaultMinutes: Minutes;
  theme: Theme;
}

export const DEFAULT_SETTINGS: Settings = {
  colorMode: "system",
  defaultMinutes: 30,
  theme: "any",
};

/** Upper bound on mission length for a request. */
export function maxMinutesFor(req: MissionRequest): number {
  return req.mode === "custom" ? req.minutes : SURPRISE_MAX_MINUTES;
}
