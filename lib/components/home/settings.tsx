"use client";

import { defaultSettings, useSettings } from "../global/settingsProvider";
import PopupWindow from "../global/popupWindow";
import Slider from "../utilities/slider";
import { useState } from "react";
import { SceneController } from "@/lib/ts/threeScene";
import ButtonToggle from "../utilities/buttonToggle";
import GearIcon from "../icons/gear";
import ResetArrowsIcon from "../icons/resetArrows";
import { motion } from "framer-motion";
import { getAppVersion } from "../../ts/version";
import SquareGradient from "../utilities/squareGradient";
import PerformanceButton from "../utilities/performanceButton";
import RocketIcon from "../icons/rocket";
import SatelliteIcon from "../icons/satellite";
import TelescopeIcon from "../icons/telescope";

const WAVE_COLOR_PRESETS = [
  { presetName: "Default Bark Space", colors: defaultSettings.waveColors },
  { presetName: "Milky Bone Nebula", colors: [0xB22222, 0x3B0764, 0xF2A900, 0x111111] },
  { presetName: "Event Howlizon", colors: [0x0E09DC, 0x4C1D95, 0xEC4899, 0x030712] },
  { presetName: "Aurora Fetcher", colors: [0x00786E, 0x10B981, 0xFF8844, 0x061320] },
  { presetName: "Space Squirrel Dust", colors: [0x1E293B, 0x334155, 0xE2E8F0, 0x0F172A] },
  { presetName: "Gamma Ray Zoomies", colors: [0x4ade80, 0x2e1065, 0xfacc15, 0x022c22] }
];

const PERFORMANCE_SETTINGS_PRESETS = [
  { presetName: "Star Ultra", performance: 2, icon: <RocketIcon /> },
  { presetName: "Sky-High", performance: 1, icon: <SatelliteIcon /> },
  { presetName: "Earthbound Low", performance: defaultSettings.performance, icon: <TelescopeIcon /> },
];

type SettingsProps = Readonly<{
  isEnabled: boolean;
  onClose: () => void;
}>;

export default function Settings({ isEnabled, onClose }: SettingsProps) {
  const { settings, setSettings, resetSettings } = useSettings();
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

  // todo - in dot density section, make a 'warning' banner with yellow/orange background that has slanted stripes (like a construction sign) that says "Increasing dot density may impact performance on some devices" or something like that. Make it so that the warning only appears if the user has set the dot density above a certain number (maybe 1500 or 2000?).
  return (
    <PopupWindow
      windowIcon={<GearIcon />}
      windowTitle="SETTINGS"
      windowTitleDescription={`App Version: ${getAppVersion()}`}
      isEnabled={isEnabled}
      onClose={onClose}
    >
      <div className="flex m-[5px] gap-2 items-center justify-center bg-black/25 p-3 rounded-xl">
        <div className="flex-1">
          <div className="flex items-center justify-center gap-2">
            <span>Statistics {settings.statsEnabled ? "ON" : "OFF"}</span>
            <ButtonToggle
              enabled={settings.statsEnabled}
              onChange={toggleStats}
            />
          </div>
        </div>
        <div className="self-stretch w-[1px] rounded-xl bg-gray-300/30" />
        <motion.button
          whileHover="hover"
          whileTap="hover"
          onClick={resetSettings}
          className="popup-button-blue m-[4px] flex-1 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2">
            <ResetArrowsIcon />
            <span>Reset Cache</span>
          </div>
        </motion.button>
      </div>
      <div className="m-[5px] bg-black/25 p-3 rounded-xl">
        <div className="pb-[10px] text-center">
          <p>
            DOT DENSITY: <b>{currentDotCount}</b> PARTICLES
          </p>
          <p className="text-sm">
            Resizing window will set it back to auto-mode.
          </p>
        </div>
        <Slider onChange={changeDotCount} value={currentDotCount} />
      </div>
      <div className="m-[5px] bg-black/25 p-3 rounded-xl">
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
      <div className="m-[5px] bg-black/25 p-3 rounded-xl">
        <div className="pb-[10px] text-center">
          <p>
            PERFORMANCE
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          {PERFORMANCE_SETTINGS_PRESETS.map((item) => (
            <PerformanceButton key={item.presetName} presetName={item.presetName} performanceNumber={item.performance} icon={item.icon} onClick={setPerformance} />
          ))}
        </div>
      </div>
    </PopupWindow>
  );
}