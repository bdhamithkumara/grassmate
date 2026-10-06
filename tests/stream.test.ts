import { describe, expect, it } from "vitest";
import { previewMission } from "@/lib/stream";

const full =
  '{"emoji": "🌿", "title": "Leaf Hunter", "description": "Find leaf \\"shapes\\".", "difficulty": "easy", "duration": 25, ' +
  '"steps": ["Find three leaves.", "Compare edges.", "Pick a favourite."], "reward": "More curiosity.", ' +
  '"encouragement": "Nice!", "reflection": "What surprised you?"}';

describe("previewMission", () => {
  it("reads every field from a complete reply", () => {
    expect(previewMission(full)).toEqual({
      emoji: "🌿",
      title: "Leaf Hunter",
      description: 'Find leaf "shapes".',
      difficulty: "easy",
      duration: 25,
      steps: ["Find three leaves.", "Compare edges.", "Pick a favourite."],
      reward: "More curiosity.",
    });
  });

  it("shows only finished fields while the reply is still streaming", () => {
    const partial = previewMission('{"emoji": "🌿", "title": "Leaf Hu');
    expect(partial).toEqual({ emoji: "🌿", steps: [] });
  });

  it("does not show a number until it is complete", () => {
    expect(previewMission('{"duration": 2').duration).toBeUndefined();
    expect(previewMission('{"duration": 25,').duration).toBe(25);
  });

  it("shows finished steps and skips the one being written", () => {
    const partial = previewMission('{"steps": ["One.", "Two.", "Thr');
    expect(partial.steps).toEqual(["One.", "Two."]);
  });

  it("handles pretty-printed JSON", () => {
    const pretty = JSON.stringify(JSON.parse(full), null, 2);
    expect(previewMission(pretty).steps).toHaveLength(3);
    expect(previewMission(pretty).title).toBe("Leaf Hunter");
  });

  it("ignores unknown difficulty values", () => {
    expect(previewMission('{"difficulty": "extreme",').difficulty).toBeUndefined();
  });
});
