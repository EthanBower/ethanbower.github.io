"use client";

import { FrontPageAnimation } from "@/lib";
import { useEffect, useRef } from "react";

export default function Home() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!mountRef.current) {
      return;
    }
    
    const pageAnimation = new FrontPageAnimation(mountRef);
    pageAnimation.loadAssets().then(() => {
      pageAnimation.animatePage();
    });

    return () => { };
  }, []);

  return (
    <div ref={mountRef} className="w-screen h-screen" />
  );
}