"use client";

import ChipGroup from "./ChipGroup";
import { THEMES, TIMES, type ColorMode, type Settings, type Theme } from "@/lib/types";

const COLOR_MODES: { value: ColorMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const THEME_LABELS: Record<Theme, string> = {
  any: "🎲 Any",
  nature: "🌿 Nature",
  mindful: "🧘 Mindful",
  creative: "🎨 Creative",
  active: "🏃 Active",
};

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export default function SettingsPanel({ settings, onChange }: Props) {
  return (
    <section className="panel settings">
      <h1>Settings</h1>
      <ChipGroup
        legend="Dark mode"
        name="colorMode"
        options={COLOR_MODES}
        value={settings.colorMode}
        onChange={(colorMode) => onChange({ ...settings, colorMode })}
      />
      <ChipGroup
        legend="Mission duration"
        name="defaultMinutes"
        options={TIMES.map((t) => ({ value: t, label: `${t} min` }))}
        value={settings.defaultMinutes}
        onChange={(defaultMinutes) => onChange({ ...settings, defaultMinutes })}
      />
      <ChipGroup
        legend="Theme"
        name="theme"
        options={THEMES.map((t) => ({ value: t, label: THEME_LABELS[t] }))}
        value={settings.theme}
        onChange={(theme) => onChange({ ...settings, theme })}
      />
      <p className="note">Settings and your journal are saved in this browser only.</p>
    </section>
  );
}
