"use client";

import { SceneController } from "@/lib/ts/threeScene";
import { useEffect, useRef } from "react";

export default function SpaceScene() {
  const threeJsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threeJsRef.current) return;

    const pageScene = SceneController.getInstance();
    const init = async () => {
      pageScene.init(threeJsRef.current!);
      await pageScene.frontPage!.loadAssets();
      pageScene.frontPage!.animatePage();
    }

    init();

    return () => { 
      // Dispose of THREE JS OBJS, Dispose of listeners
    };
  }, []);

  return (
    <div ref={threeJsRef} id="three-root" />
  );
}