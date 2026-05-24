"use client";

import { FrontPageAnimation } from "@/lib/ts";
import { useEffect, useRef, useState } from "react";
import Permissions from "../../lib/components/permissions";

export default function Home() {
  const threeJsRef = useRef<HTMLDivElement | null>(null);
  const [permissionsPageEnabled, setEnabled] = useState(true);

  const handleEnable = async () => {
    if (!threeJsRef.current) return;

    const pageAnimation = new FrontPageAnimation(threeJsRef.current);
    await pageAnimation.loadAssets();

    setEnabled(false);

    pageAnimation.animatePage();
  };

  useEffect(() => {
    return () => { 
      // Dispose of THREE JS OBJS, Dispose of listeners
    };
  }, []);

  return (
    <main className="relative w-full h-screen">
      {permissionsPageEnabled && <Permissions onComplete={handleEnable} />}
      <div ref={threeJsRef} id="three-root" />
    </main>
  );
}