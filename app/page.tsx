"use client";

import { FrontPageAnimation } from "@/lib";
import { useEffect, useRef } from "react";

export default function Home() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!mountRef.current) {
      return;
    }
    
    new FrontPageAnimation(mountRef);

    return () => {
      //page.dispose();
    }
  }, []);

  return (
    <div ref={mountRef} className="w-screen h-screen" />
  );
}