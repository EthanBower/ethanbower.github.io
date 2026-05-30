"use client";

import { SceneController } from "@/lib/ts/threeScene";
import { useEffect, useRef } from "react";
import { useSettings } from "../global/settingsProvider";

type SpaceSceneProps = Readonly<{
    onLoadingComplete: () => void;
}>;

export default function SpaceScene({ onLoadingComplete }: SpaceSceneProps) {
  const { settings } = useSettings();
  const threeJsRef = useRef<HTMLDivElement | null>(null);
  const assetsLoadedRef = useRef(false);
  const instantiatedRef = useRef(false);

  // Handle initialization and asset loading
  useEffect(() => {
    if (!threeJsRef.current || instantiatedRef.current == true) return;
    instantiatedRef.current = true;

    const pageScene = SceneController.getInstance();
    const initLoading = async () => {      
      await pageScene.init(threeJsRef.current!);
      pageScene.runAnimationLoop();
      assetsLoadedRef.current = true;  
      onLoadingComplete(); 
    };

    initLoading();

    return () => { 
      //pageScene.dispose();
    };
  }, [onLoadingComplete]); 

  // Configure custom settings once localSettings is parsed/read
  useEffect(() => {
    SceneController.getInstance().setStatsEnable(settings.statsEnabled);
  }, [settings.statsEnabled]);

  useEffect(() => {
    if (!settings.motionEnabled) return;
    console.log("GYRO");
    SceneController.getInstance().initGyro();
  }, [settings.motionEnabled]);

  return (
    <div ref={threeJsRef} id="three-root" className="w-full h-full" />
  );
}