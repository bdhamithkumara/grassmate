import { SURPRISE_MAX_MINUTES, type MissionRequest } from "./types";

// On a low-end laptop CPU, Gemma reads about 11 prompt tokens and writes about
// 4 tokens per second, and Ollama only reuses its cache for identical prompts.
// So both the prompt and the requested fields are kept short.
export const SYSTEM_PROMPT =
  "Invent a short outdoor micro-adventure that is safe, free and needs no phone or equipment. " +
  "Name: 2-3 fun words. Description: under 15 words. Steps: 3-4, under 10 words each. " +
  "Reward: a feeling in 2-3 words. Encouragement: one short sentence with an idea for tomorrow. " +
  "Reflection: one short open question. Reply with compact JSON.";

const THEME_HINTS: Record<string, string> = {
  nature: "noticing nature",
  mindful: "calm and mindful",
  creative: "creative observation game",
  active: "gently active",
};

export function buildUserPrompt(req: MissionRequest): string {
  const parts =
    req.mode === "custom"
      ? [`${req.minutes} minutes or less, ${req.weather} weather, near a ${req.environment}.`]
      : [`Surprise me: pick any place and ${SURPRISE_MAX_MINUTES} minutes or less. Make it unexpected.`];
  if (req.theme !== "any") parts.push(`Style: ${THEME_HINTS[req.theme]}.`);
  if (req.avoid.length > 0) parts.push(`Not: ${req.avoid.join(", ")}.`);
  return parts.join(" ");
}
