"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "../../providers/settingsProvider";
import { SceneController } from "@/src/three";
import { AppPermissions } from "@/src/components/utils/appPermissions";
import WarningWindow from "@/src/components/ui/warningWindow";

const LIGHT_MODE_COLOR = 0x1a1a1a;
const DARK_MODE_COLOR = 0x0a0a0a;

type SpaceSceneProps = Readonly<{
  onLoadingComplete: () => void;
}>;

export default function SpaceScene({ onLoadingComplete }: SpaceSceneProps) {
  const { settings } = useSettings();
  const [errorOccurred, setErrorOccurred] = useState(false);
  const threeJsRef = useRef<HTMLDivElement | null>(null);
  const [isInstantiated, setIsInstantiated] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Handle initialization and asset loading.
  useEffect(() => {
    if (!threeJsRef.current || isInstantiated) return;

    const pageScene = SceneController.getInstance();
    const initLoading = async () => {
      try {
        await pageScene.init(threeJsRef.current!);
        setIsInstantiated(true);
        determineBackgroundColor(settings.backgroundColor);
        pageScene.runAnimationLoop((error) => {
          setError(new Error("Space animation loop crashed. Please consider refreshing the page.", { cause: error }));
        });
      } catch (error) {
        throw new Error("Failed to initialize the scene, please try refreshing. Will otherwise attempt to continue on with page if window is exited.", {
          cause: error instanceof Error ? error : new Error(String(error)),
        });
      } finally {
        onLoadingComplete();
      }
    };

    initLoading().catch((error) => {
      setErrorOccurred(true);
      setError(error instanceof Error ? error : new Error(String(error)));
    });

    return () => { };
    // eslint rule disabled because this is meant to run exactly once, as this space scene is a singleton instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle dark mode listener
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

  return (
    <>
      {!errorOccurred && <div ref={threeJsRef} id="three-root" className="fixed inset-0 w-screen h-full z-0 w-full h-full z-0" />}
      {errorOccurred && <p className="absolute flex justify-center items-center w-full h-full text-white">An error occurred loading the 3D scene. Please consider refreshing the page.</p>}
      <WarningWindow enable={error != null} error={error} onClose={() => setError(null)} />
    </>
  );
}

function determineBackgroundColor(backgroundColor: number | null, mediaQueryRan: boolean | null = null) {
  const sceneController = SceneController.getInstance();

  // Auto - mode enable
  if (backgroundColor == null) {
    const darkModeEnabled = mediaQueryRan ?? getDarkModeQuery().matches;
    backgroundColor = darkModeEnabled ? DARK_MODE_COLOR : LIGHT_MODE_COLOR;
  }

  sceneController.setBackgroundColor(backgroundColor);
  document.documentElement.style.setProperty("--background", `#${backgroundColor.toString(16).padStart(6, "0")}`);
}

function getDarkModeQuery(): MediaQueryList {
  return window.matchMedia("(prefers-color-scheme: dark)");
}
