"use client";

import { SceneController } from "@/lib/ts/threeScene";
import { useEffect, useRef } from "react";

export default function SpaceScene() {
  const threeJsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threeJsRef.current) return;

    const pageScene = SceneController.getInstance();
    pageScene.init(threeJsRef.current);
    pageScene.frontPage!.loadAssets();
    pageScene.frontPage!.animatePage(); // Make this wait for loading

    return () => { 
      // Dispose of THREE JS OBJS, Dispose of listeners
    };
  }, []);

  return (
    <div ref={threeJsRef} id="three-root" />
  );
}