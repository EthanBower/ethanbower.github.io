"use client";

import { SceneController } from "@/lib/ts/threeScene";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "../global/settingsProvider";
import { AppPermissions } from "@/lib/ts/appPermissions";

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
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemTheme = (e: MediaQueryListEvent) => setSystemTheme(pageScene, e.matches);
    const initLoading = async () => {
      await pageScene.init(threeJsRef.current!);
      setIsInstantiated(true);
      setSystemTheme(pageScene, darkModeMediaQuery.matches);
      pageScene.runAnimationLoop();
      onLoadingComplete();
    };

    initLoading();

    darkModeMediaQuery.addEventListener("change", handleSystemTheme);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleSystemTheme);
    };
  }, []);

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

  return <div ref={threeJsRef} id="three-root" className="w-full h-full z-0" />;
}

function setSystemTheme(pageScene: SceneController, darkModeEnabled: boolean) {
  pageScene.setBackgroundColor(
    darkModeEnabled ? DARK_MODE_COLOR : LIGHT_MODE_COLOR
  );
}
