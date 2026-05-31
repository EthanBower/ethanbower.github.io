"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "app-settings";
const defaultSettings: { motionEnabled: boolean | null, statsEnabled: boolean, dotCount: number | null } = {
  motionEnabled: null,
  statsEnabled: false,
  dotCount: null
};

type Settings = typeof defaultSettings;

type SettingsContextType = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode; }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window === "undefined") return defaultSettings;

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return defaultSettings;

    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function resetSettings() {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(defaultSettings);
  }

  const memo = useMemo(() => ({ settings, setSettings, resetSettings }), [settings]);

  return (
    <SettingsContext.Provider value={memo}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}