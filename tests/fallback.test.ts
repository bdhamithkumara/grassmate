import { describe, expect, it } from "vitest";
import { FALLBACK_MISSIONS, pickFallback } from "@/lib/fallback";
import { validateMission } from "@/lib/mission";
import { ENVIRONMENTS, TIMES, WEATHERS, type MissionRequest } from "@/lib/types";

describe("FALLBACK_MISSIONS", () => {
  it("has about 30 unique missions that pass the schema", () => {
    expect(FALLBACK_MISSIONS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(FALLBACK_MISSIONS.map((m) => m.title)).size).toBe(FALLBACK_MISSIONS.length);
    for (const m of FALLBACK_MISSIONS) {
      expect(validateMission(m, 60), m.title).not.toBeNull();
    }
  });
});

describe("pickFallback", () => {
  it("always returns a mission that fits the time chosen", () => {
    for (const minutes of TIMES)
      for (const weather of WEATHERS)
        for (const environment of ENVIRONMENTS) {
          const req: MissionRequest = { mode: "custom", minutes, weather, environment, theme: "any", avoid: [] };
          const m = pickFallback(req);
          expect(m.duration).toBeLessThanOrEqual(minutes);
          expect(m).not.toHaveProperty("weather");
          expect(m).not.toHaveProperty("environments");
        }
  });

  it("matches weather and environment when it can", () => {
    const req: MissionRequest = { mode: "custom", minutes: 30, weather: "rainy", environment: "beach", theme: "any", avoid: [] };
    for (let i = 0; i < 20; i++) {
      const title = pickFallback(req, () => i / 20).title;
      const source = FALLBACK_MISSIONS.find((m) => m.title === title)!;
      expect(source.weather ?? ["rainy"]).toContain("rainy");
      expect(source.environments ?? ["beach"]).toContain("beach");
    }
  });

  it("skips recent missions", () => {
    const base: MissionRequest = { mode: "surprise", theme: "any", avoid: [] };
    const first = pickFallback(base, () => 0).title;
    expect(pickFallback({ ...base, avoid: [first] }, () => 0).title).not.toBe(first);
  });
});
