import { MISSION_SCHEMA } from "./mission";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import type { MissionRequest } from "./types";

export const OLLAMA_HOST = (process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434").replace(/\/$/, "");
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gemma3:4b";

/** Covers a cold model load plus generation on a slow CPU-only laptop. */
const MISSION_TIMEOUT_MS = 150_000;

function optionalInt(name: string): number | undefined {
  const value = process.env[name];
  return value !== undefined && value !== "" && Number.isInteger(Number(value)) ? Number(value) : undefined;
}

/**
 * Options that decide how the model is loaded. Every call must send the same
 * values, or Ollama reloads the model, which takes 20 to 80 seconds on a laptop.
 * OLLAMA_NUM_GPU=0 helps when a small GPU can only hold a few layers.
 */
const LOAD_OPTIONS = {
  num_ctx: 2048,
  ...(optionalInt("OLLAMA_NUM_GPU") !== undefined && { num_gpu: optionalInt("OLLAMA_NUM_GPU") }),
  ...(optionalInt("OLLAMA_NUM_THREAD") !== undefined && { num_thread: optionalInt("OLLAMA_NUM_THREAD") }),
};

/** Unload after 5 idle minutes so the model doesn't hold RAM all day. */
const KEEP_ALIVE = "5m";

/**
 * Streams Gemma's raw JSON reply for a mission, chunk by chunk. Aborting
 * `cancel` stops generation, so a mission nobody waits for doesn't keep the CPU busy.
 * Throws on network errors, timeouts and non-200 responses.
 */
export async function* streamMission(req: MissionRequest, cancel?: AbortSignal): AsyncGenerator<string> {
  const timeout = AbortSignal.timeout(MISSION_TIMEOUT_MS);
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: cancel ? AbortSignal.any([cancel, timeout]) : timeout,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: true,
      format: MISSION_SCHEMA,
      keep_alive: KEEP_ALIVE,
      options: {
        ...LOAD_OPTIONS,
        temperature: req.mode === "surprise" ? 1.0 : 0.8,
        num_predict: 400,
      },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(req) },
      ],
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Ollama returned ${res.status}`);

  // Ollama streams one JSON object per line.
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const data = JSON.parse(line) as { message?: { content?: string }; error?: string };
      if (data.error) throw new Error(data.error);
      if (data.message?.content) yield data.message.content;
    }
  }
}

let warming: Promise<void> | null = null;

/**
 * Loads the model and pre-reads the system prompt while the user is still
 * choosing, so the real request only has to read the short user message.
 */
export function warmUp(): Promise<void> {
  warming ??= fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(MISSION_TIMEOUT_MS),
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      keep_alive: KEEP_ALIVE,
      options: { ...LOAD_OPTIONS, num_predict: 1 },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Ready?" },
      ],
    }),
  })
    .then(() => undefined)
    .catch(() => undefined)
    .finally(() => {
      warming = null;
    });
  return warming;
}

/** True when Ollama is reachable and the model has been pulled. */
export async function isModelAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(3_000) });
    if (!res.ok) return false;
    const data = (await res.json()) as { models?: { name: string }[] };
    return (data.models ?? []).some((m) => m.name === OLLAMA_MODEL);
  } catch {
    return false;
  }
}
