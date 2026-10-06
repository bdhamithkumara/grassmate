import type { Mission, MissionResponse } from "./types";

/** One line of the newline-delimited JSON stream sent by /api/mission. */
export type MissionEvent = { type: "delta"; text: string } | ({ type: "done" } & MissionResponse);

export type MissionPreview = Partial<Pick<Mission, "emoji" | "title" | "description" | "difficulty" | "duration" | "reward">> & {
  steps: string[];
};

const STRING = '"((?:[^"\\\\]|\\\\.)*)"';

function decode(raw: string): string | undefined {
  try {
    return JSON.parse(`"${raw}"`) as string;
  } catch {
    return undefined;
  }
}

function stringField(text: string, key: string): string | undefined {
  const match = new RegExp(`"${key}"\\s*:\\s*${STRING}`).exec(text);
  return match ? decode(match[1]) : undefined;
}

/**
 * Pulls the fields that are already complete out of a half-written JSON
 * mission, so the Adventure Card can fill in while Gemma is still writing.
 */
export function previewMission(text: string): MissionPreview {
  const preview: MissionPreview = { steps: [] };
  for (const key of ["emoji", "title", "description", "reward"] as const) {
    const value = stringField(text, key);
    if (value) preview[key] = value;
  }

  const difficulty = stringField(text, "difficulty");
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "active") preview.difficulty = difficulty;

  // Only trust the number once something follows it, so "2" of "25" isn't shown.
  const duration = /"duration"\s*:\s*(\d+)\s*[,}\s]/.exec(text);
  if (duration) preview.duration = Number(duration[1]);

  const steps = /"steps"\s*:\s*\[([^\]]*)/.exec(text);
  if (steps) {
    for (const match of steps[1].matchAll(new RegExp(STRING, "g"))) {
      const step = decode(match[1]);
      if (step) preview.steps.push(step);
    }
  }
  return preview;
}
