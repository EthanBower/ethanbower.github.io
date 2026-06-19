"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "app-settings";
export const defaultSettings: {
  lastSeenVersion: string | null;
  motionEnabled: boolean;
  statsEnabled: boolean;
  dotCount: number | null;
  performance: number;
  backgroundColor: number | null;
  waveColors: number[];
} = {
  lastSeenVersion: null,
  motionEnabled: false,
  statsEnabled: false,
  dotCount: null,
  performance: 0.65,
  backgroundColor: null,
  waveColors: [
    0x0e09dc,
    0x8c2700,
    0x00786e,
    0xee3bcf
  ]
};

type Settings = typeof defaultSettings;

type SettingsContextType = {
  settings: Settings;
  settingsLoaded: boolean;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        // Intentionally set to ignore this rule as this is only run once on mount to hydrate localstorage, which needs to run client side.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function resetSettings(): void {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(defaultSettings);
  }

  const memo = useMemo(
    () => ({ settings, settingsLoaded, setSettings, resetSettings }),
    [settings, settingsLoaded],
  );

  return (
    <SettingsContext.Provider value={memo}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
