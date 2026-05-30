"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "app-settings";
const defaultSettings: { motionEnabled: boolean | null, statsEnabled: boolean } = {
  motionEnabled: null,
  statsEnabled: false,
};

type Settings = typeof defaultSettings;

type SettingsContextType = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  resetSettings: () => void;
  settingsLoaded: boolean;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode; }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsLoaded, setLoaded] = useState(false);

  // Initialize
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoaded(true);
  }, []);

  // If settings change, update
  useEffect(() => {
    if (!settingsLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, settingsLoaded]);

  function resetSettings() {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(defaultSettings);
  }

  return (
    <SettingsContext value={{ settings, setSettings, resetSettings, settingsLoaded }} >
      {children}
    </SettingsContext>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}