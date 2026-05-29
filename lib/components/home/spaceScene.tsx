"use client";

import { SceneController } from "@/lib/ts/threeScene";
import { useEffect, useRef } from "react";

type SpaceSceneProps = Readonly<{
    onLoadingComplete: () => void;
}>;

export default function SpaceScene({ onLoadingComplete }: SpaceSceneProps) {
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

  return (
    <div ref={threeJsRef} id="three-root" className="w-full h-full" />
  );
}