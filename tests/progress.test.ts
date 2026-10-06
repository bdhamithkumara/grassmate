import { describe, expect, it } from "vitest";
import { currentStreak, earnedBadgeIds, localDay, longestStreak, minutesOn } from "@/lib/progress";
import type { JournalEntry } from "@/lib/types";

function entry(date: string, minutes = 20): JournalEntry {
  return { id: `${date}-${Math.random()}`, date, createdAt: `${date}T10:00:00Z`, emoji: "🌿", title: "Leaf Hunter", minutes, question: "Q?", answer: "A" };
}

describe("localDay", () => {
  it("formats the local calendar day", () => {
    expect(localDay(new Date(2026, 9, 6, 23, 30))).toBe("2026-10-06");
    expect(localDay(new Date(2026, 0, 1, 0, 5))).toBe("2026-01-01");
  });
});

describe("currentStreak", () => {
  it("is zero for an empty journal", () => {
    expect(currentStreak([], "2026-10-06")).toBe(0);
  });

  it("counts consecutive days ending today, ignoring duplicates", () => {
    const j = [entry("2026-10-06"), entry("2026-10-06"), entry("2026-10-05"), entry("2026-10-04"), entry("2026-10-02")];
    expect(currentStreak(j, "2026-10-06")).toBe(3);
  });

  it("keeps yesterday's streak alive until today ends", () => {
    expect(currentStreak([entry("2026-10-05"), entry("2026-10-04")], "2026-10-06")).toBe(2);
  });

  it("breaks after a missed day", () => {
    expect(currentStreak([entry("2026-10-04")], "2026-10-06")).toBe(0);
  });

  it("crosses month and year boundaries", () => {
    expect(currentStreak([entry("2027-01-01"), entry("2026-12-31"), entry("2026-12-30")], "2027-01-01")).toBe(3);
  });
});

describe("longestStreak", () => {
  it("finds the longest run anywhere in the journal", () => {
    const j = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-10", "2026-09-11"].map((d) => entry(d));
    expect(longestStreak(j)).toBe(4);
  });
});

describe("badges", () => {
  it("awards badges at their milestones", () => {
    expect(earnedBadgeIds([])).toEqual([]);
    expect(earnedBadgeIds([entry("2026-10-01")])).toEqual(["first"]);
    const five = ["01", "03", "05", "07", "09"].map((d) => entry(`2026-10-${d}`));
    expect(earnedBadgeIds(five)).toEqual(["first", "explorer"]);
  });

  it("awards the seven-day badge for any past 7-day run", () => {
    const week = Array.from({ length: 7 }, (_, i) => entry(`2026-09-0${i + 1}`));
    expect(earnedBadgeIds(week)).toContain("seven-day");
  });
});

describe("minutesOn", () => {
  it("sums minutes for one day", () => {
    expect(minutesOn([entry("2026-10-06", 20), entry("2026-10-06", 15), entry("2026-10-05", 30)], "2026-10-06")).toBe(35);
  });
});
