import { describe, expect, it } from "vitest";
import { parseMissionRequest, validateMission } from "@/lib/mission";
import { buildUserPrompt } from "@/lib/prompt";

const valid = {
  emoji: "🌿",
  title: "Leaf Hunter",
  description: "Collect leaf shapes.",
  difficulty: "easy",
  duration: 30,
  steps: ["One.", "Two.", "Three."],
  reward: "More curiosity.",
  encouragement: "Nice work.",
  reflection: "What surprised you?",
};

describe("validateMission", () => {
  it("accepts a well-formed mission", () => {
    expect(validateMission(valid, 30)).toEqual(valid);
  });

  it("caps duration at the time chosen and rounds it", () => {
    expect(validateMission({ ...valid, duration: 90 }, 30)?.duration).toBe(30);
    expect(validateMission({ ...valid, duration: 12.6 }, 30)?.duration).toBe(13);
    expect(validateMission({ ...valid, duration: 1 }, 30)?.duration).toBe(5);
  });

  it("rejects missing fields and too few steps", () => {
    expect(validateMission({ ...valid, title: "  " }, 30)).toBeNull();
    expect(validateMission({ ...valid, steps: ["Only one.", ""] }, 30)).toBeNull();
    expect(validateMission({ ...valid, duration: "soon" }, 30)).toBeNull();
    expect(validateMission(null, 30)).toBeNull();
  });

  it("keeps at most five steps and defaults odd values", () => {
    const m = validateMission({ ...valid, steps: ["a", "b", "c", "d", "e", "f"], difficulty: "extreme", emoji: "" }, 30);
    expect(m?.steps).toHaveLength(5);
    expect(m?.difficulty).toBe("easy");
    expect(m?.emoji).toBe("🌱");
  });

  it("trims long text", () => {
    const m = validateMission({ ...valid, title: "x".repeat(100) }, 30);
    expect(m?.title.length).toBe(40);
  });
});

describe("parseMissionRequest", () => {
  it("accepts a custom request", () => {
    const req = parseMissionRequest({ mode: "custom", minutes: 30, weather: "sunny", environment: "park", theme: "nature", avoid: ["A"] });
    expect(req).toEqual({ mode: "custom", minutes: 30, weather: "sunny", environment: "park", theme: "nature", avoid: ["A"] });
  });

  it("rejects unknown options", () => {
    expect(parseMissionRequest({ mode: "custom", minutes: 7, weather: "sunny", environment: "park" })).toBeNull();
    expect(parseMissionRequest({ mode: "custom", minutes: 30, weather: "snowstorm", environment: "park" })).toBeNull();
    expect(parseMissionRequest({ mode: "teleport" })).toBeNull();
  });

  it("defaults the theme and limits the avoid list", () => {
    const req = parseMissionRequest({ mode: "surprise", avoid: ["a", "b", "c", "d", "e", "f", 7] });
    expect(req).toEqual({ mode: "surprise", theme: "any", avoid: ["a", "b", "c", "d", "e"] });
  });
});

describe("buildUserPrompt", () => {
  it("includes the choices and recent missions", () => {
    const prompt = buildUserPrompt({ mode: "custom", minutes: 15, weather: "rainy", environment: "city", theme: "any", avoid: ["Five Sounds"] });
    expect(prompt).toContain("15 minutes");
    expect(prompt).toContain("rainy");
    expect(prompt).toContain("city");
    expect(prompt).toContain("Five Sounds");
  });
});
