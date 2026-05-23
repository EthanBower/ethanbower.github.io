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
    <main className="relative">
      <div ref={mountRef} id="three-root" />
      <div className="main-ui items-center justify-center flex">
        <p className="text-center text-white">This is a test.</p>
      </div>
    </main>
  );
}