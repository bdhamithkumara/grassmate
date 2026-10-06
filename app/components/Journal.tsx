"use client";

import { BADGES, currentStreak, type Badge } from "@/lib/progress";
import type { JournalEntry } from "@/lib/types";

function formatDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

interface Props {
  journal: JournalEntry[];
  newBadges: Badge[];
  onDelete: (id: string) => void;
  onNewAdventure: () => void;
}

export default function Journal({ journal, newBadges, onDelete, onNewAdventure }: Props) {
  const streak = currentStreak(journal);
  const totalMinutes = journal.reduce((sum, e) => sum + e.minutes, 0);

  return (
    <section className="journal">
      <h1>Adventure Journal</h1>

      {newBadges.map((b) => (
        <p key={b.id} className="badge-toast" role="status">
          <span aria-hidden="true">{b.emoji}</span> New badge: <strong>{b.name}</strong>
        </p>
      ))}

      <dl className="stats">
        <div>
          <dt>Day streak</dt>
          <dd>{streak}</dd>
        </div>
        <div>
          <dt>Adventures</dt>
          <dd>{journal.length}</dd>
        </div>
        <div>
          <dt>Minutes outside</dt>
          <dd>{totalMinutes}</dd>
        </div>
      </dl>

      <ul className="badges" aria-label="Badges">
        {BADGES.map((b) => {
          const earned = b.earned(journal);
          return (
            <li key={b.id} className={earned ? "earned" : "locked"}>
              <span className="badge-emoji" aria-hidden="true">
                {b.emoji}
              </span>
              <span className="badge-name">{b.name}</span>
              <span className="badge-hint">{earned ? "Earned" : b.hint}</span>
            </li>
          );
        })}
      </ul>

      {journal.length === 0 ? (
        <div className="panel empty">
          <p>Your journal is empty. Your first adventure is one tap away.</p>
          <button className="btn primary" onClick={onNewAdventure}>
            Find an adventure
          </button>
        </div>
      ) : (
        <>
          <ol className="entries">
            {journal.map((e) => (
              <li key={e.id} className="entry">
                <p className="entry-date">{formatDay(e.date)}</p>
                <h2>
                  <span aria-hidden="true">{e.emoji}</span> {e.title}
                </h2>
                <p className="entry-minutes">{e.minutes} minutes</p>
                {e.answer && (
                  <>
                    <p className="entry-question">{e.question}</p>
                    <p className="entry-answer">{e.answer}</p>
                  </>
                )}
                <button
                  className="btn ghost small"
                  onClick={() => {
                    if (window.confirm(`Delete "${e.title}" from your journal?`)) onDelete(e.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ol>
          <div className="actions center">
            <button className="btn primary" onClick={onNewAdventure}>
              New adventure
            </button>
          </div>
        </>
      )}
    </section>
  );
}
