"use client";

import { SceneController } from "@/lib/ts/threeScene";
import { useEffect, useRef } from "react";

type SpaceSceneProps = Readonly<{
    onLoadingComplete: () => void;
    isReadyToAnimate: boolean;
}>;

export default function SpaceScene({ onLoadingComplete, isReadyToAnimate }: SpaceSceneProps) {
  const threeJsRef = useRef<HTMLDivElement | null>(null);
  const assetsLoadedRef = useRef(false);
  const initializedRef = useRef(false); 

  // Handle initialization and asset loading strictly 'once' on mount
  useEffect(() => {
    // todo - Remove guard against double execution in strict mode when pageScene gets a proper disposal
    if (!threeJsRef.current || initializedRef.current) return;
    initializedRef.current = true;

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

  // Listen to parents toggle
  useEffect(() => {    
    if (isReadyToAnimate && assetsLoadedRef.current) {
      SceneController
        .getInstance()
        .moveCameraDownToHomePage();
    }
  }, [isReadyToAnimate]); // This will fire when Home updates 'enableAnimation' to true

  return (
    <div ref={threeJsRef} id="three-root" className="w-full h-full" />
  );
}