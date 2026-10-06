"use client";

import { useEffect, useRef, useState } from "react";
import ChipGroup from "./ChipGroup";
import { BADGES, currentStreak } from "@/lib/progress";
import {
  ENVIRONMENTS,
  TIMES,
  WEATHERS,
  type Environment,
  type JournalEntry,
  type Minutes,
  type Weather,
} from "@/lib/types";

export interface MissionChoices {
  minutes: Minutes;
  weather: Weather;
  environment: Environment;
}

const WEATHER_LABELS: Record<Weather, string> = {
  sunny: "☀️ Sunny",
  cloudy: "☁️ Cloudy",
  rainy: "🌧️ Rainy",
  cold: "❄️ Cold",
  hot: "🔥 Hot",
};

const ENVIRONMENT_LABELS: Record<Environment, string> = {
  park: "🌳 Park",
  beach: "🏖️ Beach",
  forest: "🌲 Forest",
  village: "🏡 Village",
  city: "🏙️ City",
};

interface Props {
  journal: JournalEntry[];
  defaultMinutes: Minutes;
  aiReady: boolean | null;
  loading: boolean;
  error: string | null;
  onGenerate: (choices: MissionChoices) => void;
  onSurprise: () => void;
}

export default function Home({ journal, defaultMinutes, aiReady, loading, error, onGenerate, onSurprise }: Props) {
  const [minutes, setMinutes] = useState<Minutes>(defaultMinutes);
  const [weather, setWeather] = useState<Weather>("sunny");
  const [environment, setEnvironment] = useState<Environment>("park");
  const formRef = useRef<HTMLFormElement>(null);

  // Settings load after the first render, so follow the default when it arrives.
  useEffect(() => setMinutes(defaultMinutes), [defaultMinutes]);

  const streak = currentStreak(journal);
  const badges = BADGES.filter((b) => b.earned(journal));

  return (
    <>
      <section className="hero">
        <h1>
          <span aria-hidden="true">🌱</span> GrassMate
        </h1>
        <p className="tagline">AI that tells you to stop using AI.</p>
        <p className="lede">Create an outdoor adventure in seconds. Runs completely on your computer.</p>
        <button
          className="btn primary large"
          onClick={() => formRef.current?.querySelector<HTMLInputElement>("input")?.focus()}
        >
          Start Adventure
        </button>
        <p className={`ai-status ${aiReady ? "on" : aiReady === false ? "off" : ""}`} role="status">
          {aiReady === null && "Checking for Gemma…"}
          {aiReady === true && "Gemma 3 4B is ready on this computer"}
          {aiReady === false && "AI offline: you'll get saved missions until Ollama is running"}
        </p>
      </section>

      {(streak > 0 || badges.length > 0) && (
        <section className="progress-strip" aria-label="Your progress">
          <span>
            <strong>{streak}</strong>-day streak
          </span>
          <span aria-label={`${badges.length} badges earned`}>
            {badges.map((b) => (
              <span key={b.id} title={b.name} aria-hidden="true">
                {b.emoji}
              </span>
            ))}
          </span>
        </section>
      )}

      <form
        ref={formRef}
        className="panel mission-form"
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate({ minutes, weather, environment });
        }}
      >
        <h2>Tell me about right now</h2>
        <ChipGroup
          legend="I have"
          name="minutes"
          options={TIMES.map((t) => ({ value: t, label: `${t} min` }))}
          value={minutes}
          onChange={setMinutes}
        />
        <ChipGroup
          legend="Weather"
          name="weather"
          options={WEATHERS.map((w) => ({ value: w, label: WEATHER_LABELS[w] }))}
          value={weather}
          onChange={setWeather}
        />
        <ChipGroup
          legend="Environment"
          name="environment"
          options={ENVIRONMENTS.map((env) => ({ value: env, label: ENVIRONMENT_LABELS[env] }))}
          value={environment}
          onChange={setEnvironment}
        />
        <div className="actions">
          <button type="submit" className="btn primary" disabled={loading}>
            Generate Adventure
          </button>
          <button type="button" className="btn surprise" disabled={loading} onClick={onSurprise}>
            🎲 Surprise Adventure
          </button>
        </div>
        {loading && (
          <p className="loading" role="status">
            Gemma is dreaming up your adventure…
          </p>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </form>
    </>
  );
}
