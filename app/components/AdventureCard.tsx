"use client";

import { useEffect, useState } from "react";
import type { MissionPreview } from "@/lib/stream";
import type { MissionResponse } from "@/lib/types";

const DIFFICULTY_LABELS = { easy: "Easy", medium: "Medium", active: "Active" } as const;

/** Shown while a field hasn't been written yet. */
function Pending({ width }: { width: string }) {
  return <span className="pending" style={{ width }} aria-hidden="true" />;
}

function useElapsedSeconds(running: boolean): number {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    setSeconds(0);
    const started = Date.now();
    const timer = setInterval(() => setSeconds(Math.round((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  return seconds;
}

interface Props {
  response: MissionResponse | null;
  preview: MissionPreview | null;
  loading: boolean;
  error: string | null;
  onStart: () => void;
  onTryAnother: () => void;
  onBack: () => void;
}

export default function AdventureCard({ response, preview, loading, error, onStart, onTryAnother, onBack }: Props) {
  const writing = !response;
  const mission = response?.mission ?? preview ?? { steps: [] };
  const seconds = useElapsedSeconds(writing);

  return (
    <section className="card-screen">
      <article className={`adventure-card ${writing ? "writing" : ""}`} aria-busy={writing}>
        <header className="card-head">
          <span className="card-emoji" aria-hidden="true">
            {mission.emoji ?? "🌱"}
          </span>
          <h1>{mission.title ?? <Pending width="60%" />}</h1>
          <p>{mission.description ?? <Pending width="85%" />}</p>
        </header>

        <dl className="card-meta">
          <div>
            <dt>Difficulty</dt>
            <dd>{mission.difficulty ? DIFFICULTY_LABELS[mission.difficulty] : <Pending width="4rem" />}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{mission.duration ? `${mission.duration} min` : <Pending width="3.5rem" />}</dd>
          </div>
        </dl>

        <div className="card-section">
          <h2>Today&apos;s mission</h2>
          <ul>
            {mission.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
            {writing && mission.steps.length < 3 && (
              <li className="pending-item">
                <Pending width="70%" />
              </li>
            )}
          </ul>
        </div>

        <div className="card-section">
          <h2>Reward</h2>
          <p className="reward">{mission.reward ?? <Pending width="40%" />}</p>
        </div>

        <footer className="card-source" role="status">
          {writing
            ? `Gemma is writing your card on this computer… ${seconds}s`
            : response.source === "ai"
              ? "Invented by Gemma 3 4B on this computer"
              : "Saved mission · AI offline"}
        </footer>
      </article>

      <div className="actions center">
        <button className="btn primary large" onClick={onStart} disabled={writing}>
          Start Adventure
        </button>
        <button className="btn" onClick={onTryAnother} disabled={loading}>
          Try another
        </button>
        <button className="btn ghost" onClick={onBack}>
          {writing ? "Cancel" : "Back"}
        </button>
      </div>
      {error && (
        <p className="error center" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
