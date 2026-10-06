"use client";

import { useEffect, useState } from "react";
import type { Mission } from "@/lib/types";

/** How long the calm message shows before the user can move on. */
const PAUSE_MS = 4_000;

interface Props {
  mission: Mission;
  leftAt: number | null;
  onLeave: () => void;
  onBack: () => void;
}

export default function GoOutside({ mission, leftAt, onLeave, onBack }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), PAUSE_MS);
    return () => clearTimeout(timer);
  }, []);

  if (leftAt) {
    return (
      <main className="outside">
        <div className="outside-inner">
          <p className="outside-emoji" aria-hidden="true">
            {mission.emoji}
          </p>
          <h1>{mission.title}</h1>
          <p className="outside-line">You&apos;re on an adventure. This page will wait.</p>
          <button className="btn primary large" onClick={onBack}>
            I&apos;m back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="outside">
      <div className="outside-inner">
        <p className="outside-emoji sprout" aria-hidden="true">
          🌱
        </p>
        <h1>Adventure begins now.</h1>
        <p className="outside-line">Close this laptop.</p>
        <p className="outside-line">Put your phone in your pocket.</p>
        <p className="outside-line">We&apos;ll be here when you return.</p>
        <p className="outside-line soft">See you soon.</p>
        <div className="outside-action">
          {ready && (
            <button className="btn primary large fade-in" onClick={onLeave} autoFocus>
              I&apos;m leaving
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
