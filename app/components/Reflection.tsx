"use client";

import { useState } from "react";
import { localDay, minutesOn } from "@/lib/progress";
import type { JournalEntry, Mission } from "@/lib/types";

interface Props {
  mission: Mission;
  journal: JournalEntry[];
  elapsedMinutes: number;
  onSave: (minutes: number, answer: string) => void;
}

export default function Reflection({ mission, journal, elapsedMinutes, onSave }: Props) {
  const [minutesText, setMinutesText] = useState(String(elapsedMinutes));
  const [answer, setAnswer] = useState("");

  const minutes = Math.min(600, Math.max(1, Math.round(Number(minutesText) || 0)));
  const todayTotal = minutesOn(journal, localDay()) + minutes;

  return (
    <section className="panel reflection">
      <p className="welcome-back" aria-hidden="true">
        {mission.emoji}
      </p>
      <h1>
        You spent {todayTotal} {todayTotal === 1 ? "minute" : "minutes"} outdoors today. Nice work!
      </h1>
      <p className="encouragement">{mission.encouragement}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(minutes, answer);
        }}
      >
        <label className="field">
          <span>Minutes outside on this adventure</span>
          <input
            type="number"
            min={1}
            max={600}
            inputMode="numeric"
            value={minutesText}
            onChange={(e) => setMinutesText(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="reflection-heading">Today&apos;s Reflection</span>
          <span className="reflection-question">{mission.reflection}</span>
          <textarea
            rows={4}
            maxLength={1000}
            placeholder="Write a few words…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </label>

        <div className="actions">
          <button type="submit" className="btn primary">
            Save to Adventure Journal
          </button>
        </div>
      </form>
    </section>
  );
}
