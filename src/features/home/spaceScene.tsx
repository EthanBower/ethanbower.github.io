"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "../../providers/settingsProvider";
import { SceneController } from "@/src/three";
import { AppPermissions } from "@/src/components/utils/appPermissions";

const LIGHT_MODE_COLOR = 0x1a1a1a;
const DARK_MODE_COLOR = 0x0a0a0a;

type SpaceSceneProps = Readonly<{
  onLoadingComplete: () => void;
}>;

export default function SpaceScene({ onLoadingComplete }: SpaceSceneProps) {
  const { settings } = useSettings();
  const threeJsRef = useRef<HTMLDivElement | null>(null);
  const [isInstantiated, setIsInstantiated] = useState(false);

  // Handle initialization and asset loading
  useEffect(() => {
    if (!threeJsRef.current || isInstantiated) return;

    const pageScene = SceneController.getInstance();
    const initLoading = async () => {
      await pageScene.init(threeJsRef.current!);
      setIsInstantiated(true);
      determineBackgroundColor(settings.backgroundColor);
      pageScene.runAnimationLoop();
      onLoadingComplete();
    };

    initLoading();

    return () => { };
  }, []);

  // Handle dark mode listener - remount whenever the background color changes
  useEffect(() => {
    const handleSystemTheme = (e: MediaQueryListEvent) => determineBackgroundColor(settings.backgroundColor, e.matches);
    const darkModeMediaQuery = getDarkModeQuery();

    darkModeMediaQuery.addEventListener("change", handleSystemTheme);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleSystemTheme);
    };
  }, [settings.backgroundColor])

  // Configure custom settings once localSettings is parsed/read
  useEffect(() => {
    if (!isInstantiated) return;
    SceneController.getInstance().setStatsEnable(settings.statsEnabled);
  }, [isInstantiated, settings.statsEnabled]);

  useEffect(() => {
    if (!isInstantiated) return;
    if (!settings.motionEnabled || !AppPermissions.gyroPermissions.gyroCompatible) return;
    SceneController.getInstance().initGyro();
  }, [isInstantiated, settings.motionEnabled]);

  useEffect(() => {
    if (!isInstantiated) return;
    if (settings.dotCount === null) return;
    SceneController.getInstance().changeDotSpawnCount(settings.dotCount);
  }, [isInstantiated, settings.dotCount]);

  useEffect(() => {
    if (!isInstantiated) return;
    SceneController.getInstance().setWaveLighting(settings.waveColors);
  }, [isInstantiated, settings.waveColors]);

  useEffect(() => {
    if (!isInstantiated) return;
    SceneController.getInstance().setPerformance(settings.performance);
  }, [isInstantiated, settings.performance]);

  useEffect(() => {
    if (!isInstantiated) return;
    determineBackgroundColor(settings.backgroundColor);
  }, [isInstantiated, settings.backgroundColor]);

  return <div ref={threeJsRef} id="three-root" className="w-full h-full z-0" />;
}

function determineBackgroundColor(backgroundColor: number | null, mediaQueryRan: boolean | null = null) {
  const sceneController = SceneController.getInstance();

  // Auto - mode enable
  if (backgroundColor == null) {
    const darkModeEnabled = mediaQueryRan ?? getDarkModeQuery().matches;
    sceneController.setBackgroundColor(darkModeEnabled ? DARK_MODE_COLOR : LIGHT_MODE_COLOR);
    return;
  }

  // Custom background
  sceneController.setBackgroundColor(backgroundColor);
}

function getDarkModeQuery(): MediaQueryList {
  return window.matchMedia("(prefers-color-scheme: dark)");
}
