"use client";

import { defaultSettings, useSettings } from "../../providers/settingsProvider";
import PopupWindow from "../../components/ui/popupWindow";
import Slider from "../../components/ui/slider";
import { useState } from "react";
import ButtonToggle from "../../components/ui/buttonToggle";
import GearIcon from "../../components/icons/gear";
import ResetArrowsIcon from "../../components/icons/resetArrows";
import { motion } from "framer-motion";
import SquareGradient from "./squareGradient";
import PerformanceButton from "./performanceButton";
import RocketIcon from "../../components/icons/rocket";
import SatelliteIcon from "../../components/icons/satellite";
import TelescopeIcon from "../../components/icons/telescope";
import { SceneController } from "@/src/three";
import WarningWindow from "@/src/components/ui/warningWindow";
import LoadingSpinner from "@/src/components/ui/loadingSpinner";
import StatefulButton from "@/src/components/ui/statefulButton";
import CheckMark from "@/src/components/icons/checkMark";
import WarningBackground from "@/src/components/ui/warningBackground";
import { yellowWindowGlow } from "@/src/styles/windows";

export const BACKGROUND_COLOR_PRESETS = [
  { presetName: "Cosmic Night Walk", colors: [0x0b1020] },
  { presetName: "Nebula Puppy Glow", colors: [0x120b1f] },
  { presetName: "Galaxy Collar Blue", colors: [0x0b1b2b] },
  { presetName: "Deep Space Kennel Void", colors: [0x000000], },
  { presetName: "Comfy Space Blanket", colors: [0x111827] },
  { presetName: "Golden Retriever Starlight", colors: [0x0f0f0f] }
];

const WAVE_COLOR_PRESETS = [
  { presetName: "Default Bark Space", colors: defaultSettings.waveColors },
  { presetName: "Milky Bone Nebula", colors: [0xB22222, 0x3B0764, 0xF2A900, 0x111111] },
  { presetName: "Event Howlizon", colors: [0x0E09DC, 0x4C1D95, 0xEC4899, 0x030712] },
  { presetName: "Aurora Fetcher", colors: [0x00786E, 0x10B981, 0xFF8844, 0x061320] },
  { presetName: "Space Squirrel Dust", colors: [0x1E293B, 0x334155, 0xE2E8F0, 0x0F172A] },
  { presetName: "Gamma Ray Zoomies", colors: [0x4ade80, 0x2e1065, 0xfacc15, 0x022c22] }
];

const PERFORMANCE_SETTINGS_PRESETS = [
  { presetName: "Star-Ultra", performance: 2, icon: <RocketIcon /> },
  { presetName: "Sky-High", performance: 1, icon: <SatelliteIcon /> },
  { presetName: "Earthbound-Low", performance: defaultSettings.performance, icon: <TelescopeIcon /> },
];

type SettingsProps = Readonly<{
  isEnabled: boolean;
  onClose: () => void;
}>;

export default function Settings({ isEnabled, onClose }: SettingsProps) {
  const { settings, setSettings, resetSettings } = useSettings();
  const [error, setError] = useState<Error | null>(null);
  const [currentDotCount, setCurrentDotCount] = useState(
    SceneController.getInstance().frontPage!.dotScene.dots.length,
  );

  // to-do make a callback on three js app to update the real dot count
  function changeDotCount(dotNumber: number) {
    setCurrentDotCount(dotNumber);
    setSettings((s) => ({
      ...s,
      dotCount: dotNumber,
    }));
  }

  function toggleStats() {
    setSettings((s) => ({
      ...s,
      statsEnabled: !s.statsEnabled,
    }));
  }

  function setWaveColor(colors: number[]) {
    setSettings((s) => ({
      ...s,
      waveColors: colors,
    }));
  }

  function setPerformance(performanceNumber: number) {
    setSettings((s) => ({
      ...s,
      performance: performanceNumber,
    }));
  }

  function setBackgroundColor(backgroundColor: number | null) {
    setSettings((s) => ({
      ...s,
      backgroundColor: backgroundColor,
    }));
  }

  return (
    <div>
      <WarningWindow enable={error != null} error={error} onClose={() => setError(null)} consoleLogError={false} />
      <PopupWindow
        windowIcon={<GearIcon className="cursor-pointer text-gray-300" />}
        windowTitle="SETTINGS"
        windowTitleDescription={`App Version: ${process.env.NEXT_PUBLIC_SITE_APP_VERSION || "dev-local"}`}
        isEnabled={isEnabled}
        onClose={onClose}
      >
        <div className="m-[5px] bg-black/15 dark:bg-slate-500/10 p-3 rounded-xl">
          <div className="pb-[10px] text-center">
            <p>
              GRAPHICS
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            {PERFORMANCE_SETTINGS_PRESETS.map((item) => (
              <PerformanceButton key={item.presetName} presetName={item.presetName} performanceNumber={item.performance} icon={item.icon} onClick={setPerformance} />
            ))}
          </div>
        </div>
        <div className="m-[5px] bg-black/15 dark:bg-slate-500/10 p-3 rounded-xl">
          <div className="pb-[10px] text-center">
            <p>
              BACKGROUND COLORS
            </p>
          </div>
          <div className="flex self-container justify-between items-center">
            <div className="flex flex-col flex-1 text-left justify-center">
              <span>Auto (System Theme): {settings.backgroundColor === null ? "ON" : "OFF"}</span>
              <span className="text-sm text-white/50">Turn this button off by selecting a below box.</span>
            </div>
            <ButtonToggle
              enabled={settings.backgroundColor === null}
              onChange={(toggleVal) => {
                if (toggleVal) {
                  setBackgroundColor(null);
                } else {
                  setError(new Error("Please select a background to disable."));
                }
              }}
            />
          </div>
          <div className="w-full h-[1px] rounded-xl bg-gray-300/30 my-3" />
          <div className="grid grid-cols-3 gap-4 text-center disable">
            {BACKGROUND_COLOR_PRESETS.map((item) => (
              <SquareGradient key={item.presetName} presetName={item.presetName} colors={item.colors} onClick={(c) => setBackgroundColor(c[0])} />
            ))}
          </div>
        </div>
        <div className="m-[5px] bg-black/15 dark:bg-slate-500/10 p-3 rounded-xl">
          <div className="pb-[10px] text-center">
            <p>
              WAVE COLORS
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {WAVE_COLOR_PRESETS.map((item) => (
              <SquareGradient key={item.presetName} presetName={item.presetName} colors={item.colors} onClick={setWaveColor} />
            ))}
          </div>
        </div>
        <div className="m-[5px] bg-black/15 dark:bg-slate-500/10 p-3 rounded-xl">
          <div className="pb-[10px] text-center">
            <p>
              DOT DENSITY: <b>{currentDotCount}</b> PARTICLES
            </p>
            <div className="flex items-center justify-center">
              <WarningBackground className={`p-2 rounded-xl ${yellowWindowGlow}`} runIntro={false}>
                <p className="text-sm text-white/60 text-shadow-sm">
                  Resizing window will set it back to auto-mode.
                </p>
              </WarningBackground>
            </div>
          </div>
          <Slider onChange={changeDotCount} value={currentDotCount} />
        </div>
        <div className="m-[5px] bg-black/15 dark:bg-slate-500/10 p-3 rounded-xl">
          <div className="pb-[10px] text-center">
            <p>
              DEBUG
            </p>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span>Statistics {settings.statsEnabled ? "ON" : "OFF"}</span>
                <ButtonToggle
                  enabled={settings.statsEnabled}
                  onChange={toggleStats}
                />
              </div>
            </div>
            <div className="self-stretch w-[1px] rounded-xl bg-gray-300/30" />
            <div className="flex-1">
              <StatefulButton
                buttonStates={{
                  init: (
                    <motion.div animate="rotate" className="flex gap-2 items-center">
                      <ResetArrowsIcon />
                      <span>Reset Cache</span>
                    </motion.div>
                  ),
                  loading: (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      <span>Resetting Cache...</span>
                    </div>
                  ),
                  complete: (
                    <motion.div animate="rotate" className="flex gap-2 items-center">
                      <CheckMark />
                      <span>Success!</span>
                    </motion.div>
                  )
                }}
                onClick={resetSettings} />
            </div>
          </div>
        </div>
      </PopupWindow>
    </div>
  );
}