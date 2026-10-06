"use client";

import { useEffect, useRef, useState } from "react";
import AdventureCard from "./components/AdventureCard";
import GoOutside from "./components/GoOutside";
import Home, { type MissionChoices } from "./components/Home";
import Journal from "./components/Journal";
import Reflection from "./components/Reflection";
import SettingsPanel from "./components/SettingsPanel";
import { BADGES, earnedBadgeIds, localDay } from "@/lib/progress";
import { loadJournal, loadSettings, saveJournal, saveSettings } from "@/lib/storage";
import { previewMission, type MissionEvent, type MissionPreview } from "@/lib/stream";
import {
  DEFAULT_SETTINGS,
  type JournalEntry,
  type MissionRequest,
  type MissionResponse,
  type Settings,
} from "@/lib/types";

type Screen = "home" | "card" | "outside" | "reflect" | "journal" | "settings";

export default function GrassMate() {
  const [screen, setScreen] = useState<Screen>("home");
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [aiReady, setAiReady] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<MissionResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<MissionRequest | null>(null);
  const [sessionTitles, setSessionTitles] = useState<string[]>([]);
  const [leftAt, setLeftAt] = useState<number | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [preview, setPreview] = useState<MissionPreview | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    setJournal(loadJournal());
    setSettings(loadSettings());
    fetch("/api/health")
      .then((res) => res.json())
      .then((data: { ai: boolean }) => setAiReady(data.ai))
      .catch(() => setAiReady(false));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.colorMode === "system") delete root.dataset.theme;
    else root.dataset.theme = settings.colorMode;
  }, [settings.colorMode]);

  function updateSettings(next: Settings) {
    setSettings(next);
    saveSettings(next);
  }

  function recentTitles(): string[] {
    const fromJournal = journal.slice(0, 5).map((e) => e.title);
    return [...new Set([...sessionTitles, ...fromJournal])].slice(0, 5);
  }

  async function requestMission(req: MissionRequest) {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    setLoading(true);
    setError(null);
    setLastRequest(req);
    setCurrent(null);
    setPreview({ steps: [] });
    setScreen("card");
    try {
      const res = await fetch("/api/mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);

      // The route streams one JSON event per line: deltas, then "done".
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let text = "";
      let finished = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as MissionEvent;
          if (event.type === "delta") {
            text += event.text;
            setPreview(previewMission(text));
          } else {
            finished = true;
            setCurrent({ mission: event.mission, source: event.source });
            setAiReady(event.source === "ai");
            setSessionTitles((titles) => [event.mission.title, ...titles].slice(0, 5));
          }
        }
      }
      if (!finished) throw new Error("Mission stream ended early");
    } catch {
      if (controller.signal.aborted) return;
      setError("Couldn't create a mission. Is the GrassMate server still running?");
      setScreen("home");
    } finally {
      if (inFlight.current === controller) {
        inFlight.current = null;
        setLoading(false);
        setPreview(null);
      }
    }
  }

  function generate(choices: MissionChoices) {
    requestMission({ mode: "custom", ...choices, theme: settings.theme, avoid: recentTitles() });
  }

  function surprise() {
    requestMission({ mode: "surprise", theme: settings.theme, avoid: recentTitles() });
  }

  function tryAnother() {
    if (lastRequest) requestMission({ ...lastRequest, avoid: recentTitles() });
  }

  function saveEntry(minutes: number, answer: string) {
    if (!current) return;
    const now = new Date();
    const entry: JournalEntry = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      date: localDay(now),
      createdAt: now.toISOString(),
      emoji: current.mission.emoji,
      title: current.mission.title,
      minutes,
      question: current.mission.reflection,
      answer: answer.trim(),
    };
    const before = new Set(earnedBadgeIds(journal));
    const next = [entry, ...journal];
    setJournal(next);
    saveJournal(next);
    setNewBadges(earnedBadgeIds(next).filter((id) => !before.has(id)));
    setCurrent(null);
    setLeftAt(null);
    setScreen("journal");
  }

  function deleteEntry(id: string) {
    const next = journal.filter((e) => e.id !== id);
    setJournal(next);
    saveJournal(next);
  }

  function goHome() {
    inFlight.current?.abort();
    setNewBadges([]);
    setScreen("home");
  }

  if (screen === "outside" && current) {
    return (
      <GoOutside
        mission={current.mission}
        leftAt={leftAt}
        onLeave={() => setLeftAt(Date.now())}
        onBack={() => setScreen("reflect")}
      />
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="logo" onClick={goHome} aria-label="GrassMate home">
          <span aria-hidden="true">🌱</span> GrassMate
        </button>
        <nav className="topnav">
          <button className={screen === "journal" ? "active" : ""} onClick={() => setScreen("journal")}>
            Journal
          </button>
          <button className={screen === "settings" ? "active" : ""} onClick={() => setScreen("settings")}>
            Settings
          </button>
        </nav>
      </header>

      <main>
        {screen === "home" && (
          <Home
            journal={journal}
            defaultMinutes={settings.defaultMinutes}
            aiReady={aiReady}
            loading={loading}
            error={error}
            onGenerate={generate}
            onSurprise={surprise}
          />
        )}
        {screen === "card" && (current || preview) && (
          <AdventureCard
            response={current}
            preview={preview}
            loading={loading}
            error={error}
            onStart={() => setScreen("outside")}
            onTryAnother={tryAnother}
            onBack={goHome}
          />
        )}
        {screen === "reflect" && current && (
          <Reflection
            mission={current.mission}
            journal={journal}
            elapsedMinutes={leftAt ? Math.max(1, Math.round((Date.now() - leftAt) / 60_000)) : current.mission.duration}
            onSave={saveEntry}
          />
        )}
        {screen === "journal" && (
          <Journal
            journal={journal}
            newBadges={BADGES.filter((b) => newBadges.includes(b.id))}
            onDelete={deleteEntry}
            onNewAdventure={goHome}
          />
        )}
        {screen === "settings" && <SettingsPanel settings={settings} onChange={updateSettings} />}
      </main>

      <footer className="footer">Close your laptop. Go outside. Come back happier.</footer>
    </div>
  );
}
