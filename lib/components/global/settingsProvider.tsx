"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "app-settings";
export const defaultSettings: {
  motionEnabled: boolean;
  statsEnabled: boolean;
  dotCount: number | null;
  performance: number;
  waveColors: number[];
} = {
  motionEnabled: false,
  statsEnabled: false,
  dotCount: null,
  performance: 0.65,
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
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);

  // Intentionally set to ignore this rule as this is only run once on mount to hydrate localstorage,
  // which needs to run client side.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function resetSettings() {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(defaultSettings);
  }

  const memo = useMemo(
    () => ({ settings, setSettings, resetSettings }),
    [settings],
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
