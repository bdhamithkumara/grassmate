import { OLLAMA_MODEL, isModelAvailable, warmUp } from "@/lib/ollama";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const ai = await isModelAvailable();
  // Start loading the model now; the user takes a few seconds to choose anyway.
  if (ai) void warmUp();
  return Response.json({ ai, model: OLLAMA_MODEL });
}
