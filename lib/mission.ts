import {
  DIFFICULTIES,
  ENVIRONMENTS,
  THEMES,
  TIMES,
  WEATHERS,
  type Difficulty,
  type Mission,
  type MissionRequest,
} from "./types";

/** JSON schema passed to Ollama's `format` field. */
export const MISSION_SCHEMA = {
  type: "object",
  properties: {
    emoji: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    difficulty: { type: "string", enum: [...DIFFICULTIES] },
    duration: { type: "integer" },
    steps: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    reward: { type: "string" },
    encouragement: { type: "string" },
    reflection: { type: "string" },
  },
  required: [
    "emoji",
    "title",
    "description",
    "difficulty",
    "duration",
    "steps",
    "reward",
    "encouragement",
    "reflection",
  ],
} as const;

const MIN_DURATION = 5;

function text(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trimEnd()}…` : trimmed;
}

/**
 * Checks a model reply against the mission schema and tidies it up.
 * Returns null when the reply cannot be used, so the caller can fall back.
 */
export function validateMission(raw: unknown, maxMinutes: number): Mission | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const title = text(r.title, 40);
  const description = text(r.description, 200);
  const reward = text(r.reward, 80);
  const encouragement = text(r.encouragement, 220);
  const reflection = text(r.reflection, 160);
  if (!title || !description || !reward || !encouragement || !reflection) return null;

  if (!Array.isArray(r.steps)) return null;
  const steps = r.steps
    .map((s) => text(s, 120))
    .filter((s): s is string => s !== null)
    .slice(0, 5);
  if (steps.length < 3) return null;

  const duration = Number(r.duration);
  if (!Number.isFinite(duration)) return null;

  const difficulty = (DIFFICULTIES as readonly string[]).includes(String(r.difficulty))
    ? (r.difficulty as Difficulty)
    : "easy";

  // Emoji are short; anything long is the model rambling.
  const emoji = text(r.emoji, 8) ?? "🌱";

  return {
    emoji,
    title,
    description,
    difficulty,
    duration: Math.min(maxMinutes, Math.max(MIN_DURATION, Math.round(duration))),
    steps,
    reward,
    encouragement,
    reflection,
  };
}

function oneOf<T extends string | number>(options: readonly T[], value: unknown): T | null {
  return options.includes(value as T) ? (value as T) : null;
}

/** Validates the body the browser posts to /api/mission. */
export function parseMissionRequest(body: unknown): MissionRequest | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const theme = oneOf(THEMES, b.theme) ?? "any";
  const avoid = Array.isArray(b.avoid)
    ? b.avoid
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.slice(0, 40))
        .slice(0, 5)
    : [];

  if (b.mode === "surprise") return { mode: "surprise", theme, avoid };
  if (b.mode !== "custom") return null;

  const minutes = oneOf(TIMES, b.minutes);
  const weather = oneOf(WEATHERS, b.weather);
  const environment = oneOf(ENVIRONMENTS, b.environment);
  if (minutes === null || weather === null || environment === null) return null;

  return { mode: "custom", minutes, weather, environment, theme, avoid };
}
