"use client";

import { SceneController } from "@/lib/ts/threeScene";
import { useEffect, useRef } from "react";

type SpaceSceneProps = Readonly<{
    onLoadingComplete: () => void;
    isReadyToAnimate: boolean;
}>;

export default function SpaceScene({ onLoadingComplete, isReadyToAnimate }: SpaceSceneProps) {
  const threeJsRef = useRef<HTMLDivElement | null>(null);
  const assetsLoadedRef = useRef(false); // Track asset readiness without causing re-renders

  // Handle initialization and asset loading strictly 'once' on mount
  useEffect(() => {
    if (!threeJsRef.current) return;

    const pageScene = SceneController.getInstance();
    const initLoading = async () => {
      if (threeJsRef.current) threeJsRef.current.innerHTML = "";
      
      await pageScene.init(threeJsRef.current!);
      pageScene.frontPage!.animatePage();
      assetsLoadedRef.current = true;
      onLoadingComplete();

      // Check if the parent page gave us permission prematurely
      if (isReadyToAnimate && pageScene.frontPage) {
        pageScene.frontPage.animatePage();
      }
    };

    initLoading();

    return () => { 
      //pageScene.dispose();
    };
  }, [onLoadingComplete]); 

  // Listen natively to the parent's reactive permission toggle
  useEffect(() => {
    console.log("Ani - " + String(assetsLoadedRef.current));
    if (isReadyToAnimate && assetsLoadedRef.current) {
      const pageScene = SceneController.getInstance();
      pageScene.frontPage!.mainCamera.introAnimation.isAnimating = true;
    }
  }, [isReadyToAnimate]); 

  return (
    <div ref={threeJsRef} id="three-root" />
  );
}