import { pickFallback } from "@/lib/fallback";
import { parseMissionRequest, validateMission } from "@/lib/mission";
import { streamMission } from "@/lib/ollama";
import type { MissionEvent } from "@/lib/stream";
import { maxMinutesFor, type Mission } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Streams Gemma's reply as newline-delimited JSON: "delta" events while the
 * model writes, then one "done" event with the validated mission. Any failure
 * ends with a built-in mission instead, so the user always gets one.
 */
export async function POST(request: Request): Promise<Response> {
  const req = parseMissionRequest(await request.json().catch(() => null));
  if (!req) {
    return Response.json({ error: "Invalid mission request" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      // After the browser disconnects the stream is closed, so writes are skipped.
      const send = (event: MissionEvent) => {
        if (!request.signal.aborted) controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };
      const close = () => {
        if (!request.signal.aborted) controller.close();
      };

      let mission: Mission | null = null;
      try {
        let text = "";
        for await (const delta of streamMission(req, request.signal)) {
          text += delta;
          send({ type: "delta", text: delta });
        }
        mission = validateMission(JSON.parse(text), maxMinutesFor(req));
        if (!mission) throw new Error("Model reply did not match the mission schema");
      } catch (error) {
        if (request.signal.aborted) return;
        console.warn(`[grassmate] AI unavailable, using a saved mission: ${String(error)}`);
      }

      send(mission ? { type: "done", mission, source: "ai" } : { type: "done", mission: pickFallback(req), source: "fallback" });
      close();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
